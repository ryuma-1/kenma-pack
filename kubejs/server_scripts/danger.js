// priority: 0

// ワールド全体の危険度（#106。2026-11-15、利用者と決定）。
// 危険度はプレイヤーごとではなく、サーバーに1つだけ持つ（server.persistentData の kenma_danger。再起動しても消えない）。
// 全員の L2 Hostility のレベル（プレイヤーのレベルの基本の部分）を、数秒ごとにこの値にそろえる。
// 敵のレベルは今までどおり L2 Hostility が決めるので、誰の近くでも同じ危険度で敵が強くなる。
//
// 上がり方（値はすべて kubejs/config/grades.json。grades.js が読む）:
//   ボス以外の敵（モンスター）をプレイヤーが倒す: danger.perNormalKill
//   等級のボスが死ぬ（近く danger.bossKillRange ブロック以内にプレイヤーがいれば）: grades.<等級>.dangerOnKill
//   誰かが初めてほかの次元に入る（オーバーワールド以外。次元ごとに1回）: danger.perNewDimension
// 下がらない。L2 Hostility がもともと持つ上がり方（倒した敵の経験値、次元ごとの +10）と、死んだときに下がる仕組みは、
// config/l2_configs/l2hostility-common.toml で止めている（killsPerLevel、dimensionFactor、playerDeathDecay など）。
//
// /kenma_danger（OP だけ）: 今の危険度を出す。/kenma_danger set <値>: 危険度を変える。

const DANGER_KEY = 'kenma_danger'
const DANGER_DIMS_KEY = 'kenma_danger_dims'
const DANGER_ORBS_KEY = 'kenma_orbs_given'
const DANGER_MAX = 2000 // L2 Hostility の maxPlayerLevel
const DangerPlayerDifficulty = Java.loadClass('dev.xkmc.l2hostility.content.capability.player.PlayerDifficulty')
const DangerFloatArgument = Java.loadClass('com.mojang.brigadier.arguments.FloatArgumentType')

global.kenmaDanger = {
  settings() {
    var g = global.kenmaGrades
    return g == null || g.config == null ? null : g.config.danger
  },

  get(server) {
    return server.persistentData.getDouble(DANGER_KEY)
  },

  set(server, value, reason) {
    var before = this.get(server)
    value = Math.max(0, Math.min(DANGER_MAX, value))
    server.persistentData.putDouble(DANGER_KEY, value)
    if (Math.floor(value) !== Math.floor(before)) {
      console.info(`danger: ${before.toFixed(2)} → ${value.toFixed(2)}（${reason}）`)
      this.syncAll(server)
    }
  },

  add(server, amount, reason) {
    if (!(amount > 0)) return
    this.set(server, this.get(server) + amount, reason)
  },

  // 1人のプレイヤーの L2 Hostility のレベルを、ワールドの危険度にそろえる。
  // setBase は経験値も 0 にするので、違うときだけ書く。
  syncPlayer(player, level) {
    var cap, d
    try {
      cap = DangerPlayerDifficulty.HOLDER.get(player)
      d = cap.getLevelEditor()
      if (d.getBase() !== level) {
        d.setBase(level)
        cap.sync()
      }
    } catch (e) {
      console.error(`danger: ${player.username} のレベルをそろえられない: ${e}`)
    }
  },

  syncAll(server) {
    var level = Math.floor(this.get(server))
    server.players.forEach(p => {
      this.syncPlayer(p, level)
      this.giveOrbs(p, server)
    })
  },

  // Hostility Orb を配る（#124。2026-11-16、利用者と決定）。危険度が danger.orbEvery 上がるごとに、1人に1個。
  // L2 Hostility はもともとプレイヤーのレベルが上がるたびに配るが、パックではその上がり方を止めているので、ここで配る。
  // 配った回数はプレイヤーごとに覚える（persistentData の kenma_orbs_given）。いなかった間の分は、入ったときにまとめて渡す。
  // 危険度を下げても（/kenma_danger set）、渡したオーブは減らさない。
  giveOrbs(player, server) {
    var s = this.settings(), want, given, n
    if (s == null || !(s.orbEvery > 0)) return
    want = Math.floor(this.get(server) / s.orbEvery)
    given = player.persistentData.getInt(DANGER_ORBS_KEY)
    if (want <= given) return
    n = want - given
    player.persistentData.putInt(DANGER_ORBS_KEY, want)
    player.give(Item.of('l2hostility:hostility_orb', n))
    player.tell(Text.translate('message.kenma.hostility_orb', String(n)).yellow())
    console.info(`danger: ${player.username} に Hostility Orb を ${n} 個渡した（危険度 ${this.get(server).toFixed(2)}）`)
  },

  // 初めて入った次元なら、危険度を足す。
  checkDimension(server, player) {
    var s = this.settings(), dim = String(player.level.dimension), dims
    if (s == null || dim === 'minecraft:overworld') return
    try { dims = JSON.parse(String(server.persistentData.getString(DANGER_DIMS_KEY)) || '[]') } catch (e) { dims = [] }
    if (dims.indexOf(dim) >= 0) return
    dims.push(dim)
    server.persistentData.putString(DANGER_DIMS_KEY, JSON.stringify(dims))
    this.add(server, s.perNewDimension, `${player.username} が初めて ${dim} に入った`)
  },

  onDeath(event) {
    var s = this.settings(), entity = event.entity, server = event.server, grades = global.kenmaGrades
    var id, killer, near
    if (s == null || entity.isPlayer()) return
    id = grades.gradeOf(entity)
    if (id != null) {
      // 等級のボス: とどめがプレイヤーでなくても（燃えた、落ちたなど）、近くにプレイヤーがいれば数える。
      near = false
      server.players.forEach(p => {
        // distanceTo は KubeJS から呼べなかったので、KubeJS の getDistance(x, y, z) を使う。
        if (p.level === entity.level && p.getDistance(entity.getX(), entity.getY(), entity.getZ()) <= s.bossKillRange) near = true
      })
      if (!near) return
      this.add(server, grades.config.grades[id].dangerOnKill, `${grades.config.grades[id].name} の ${entity.type} が死んだ`)
      return
    }
    if (!entity.isMonster()) return
    killer = event.source.player
    if (killer == null) return
    this.add(server, s.perNormalKill, `${killer.username} が ${entity.type} を倒した`)
  },
}

EntityEvents.death(event => {
  try {
    global.kenmaDanger.onDeath(event)
  } catch (e) {
    console.error(`danger: ${e}`)
  }
})

PlayerEvents.loggedIn(event => {
  try {
    global.kenmaDanger.syncPlayer(event.player, Math.floor(global.kenmaDanger.get(event.server)))
    global.kenmaDanger.checkDimension(event.server, event.player)
    global.kenmaDanger.giveOrbs(event.player, event.server)
  } catch (e) {
    console.error(`danger: ${e}`)
  }
})

// 数秒ごとに、全員のレベルをそろえ、入った次元を調べる（リスポーンや次元の移動のあとも、ここでそろう）。
ServerEvents.tick(event => {
  var s = global.kenmaDanger.settings(), server = event.server
  if (s == null || server.tickCount % (20 * s.syncSeconds) !== 0) return
  try {
    server.players.forEach(p => global.kenmaDanger.checkDimension(server, p))
    global.kenmaDanger.syncAll(server)
  } catch (e) {
    console.error(`danger: ${e}`)
  }
})

ServerEvents.commandRegistry(event => {
  const { commands: Commands } = event
  event.register(Commands.literal('kenma_danger')
    .requires(source => source.hasPermission(2))
    .executes(ctx => {
      var server = ctx.source.getServer(), d = global.kenmaDanger, dims
      dims = String(server.persistentData.getString(DANGER_DIMS_KEY)) || '[]'
      ctx.source.sendSystemMessage(Text.of(`[危険度] ワールドの危険度: ${d.get(server).toFixed(2)}（敵に効くのは整数の部分 ${Math.floor(d.get(server))}）`))
      ctx.source.sendSystemMessage(Text.of(`  入ったことのある次元: ${dims}`))
      return 1
    })
    .then(Commands.literal('set')
      .then(Commands.argument('value', DangerFloatArgument.floatArg(0, DANGER_MAX))
        .executes(ctx => {
          var server = ctx.source.getServer(), v = DangerFloatArgument.getFloat(ctx, 'value')
          global.kenmaDanger.set(server, v, 'コマンドで変えた')
          global.kenmaDanger.syncAll(server)
          ctx.source.sendSystemMessage(Text.of(`[危険度] ${global.kenmaDanger.get(server).toFixed(2)} にした`))
          return 1
        }))))
})
