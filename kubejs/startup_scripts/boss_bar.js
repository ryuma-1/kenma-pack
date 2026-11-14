// priority: 10

// 自作のボス（EntityJS のモブ）にボスバーを付ける共通の部品（#47）。
// EntityJS にはボスバーの仕組みがないので、バニラの ServerBossEvent（ウィザーなどと同じもの）を自分で動かす。
// 使い方: モブの登録で .tick(entity => global.kenmaBossBar.tick(entity, 'green'))
// 片付け（倒された・消えたモブのボスバーを消す）は server_scripts/boss_bar.js。

const KenmaServerBossEvent = Java.loadClass('net.minecraft.server.level.ServerBossEvent')
const KenmaBossBarColor = Java.loadClass('net.minecraft.world.BossEvent$BossBarColor')
const KenmaBossBarOverlay = Java.loadClass('net.minecraft.world.BossEvent$BossBarOverlay')

// ボスバーを見せる距離（ブロック）。
const KENMA_BOSS_BAR_RANGE = 48

global.kenmaBossBar = {
  // UUID → { bar, entity }
  bars: {},

  // モブの tick から毎回呼ぶ。サーバー側だけで動く。
  // バニラの名前のまま呼べない関数がある（getStringUUID、tickCount、level.players() など）ので、
  // KubeJS が用意している名前（getStringUuid()、age、level.players、x/y/z）を使う。
  // 注意: 何度も呼ばれる関数の中の { } で const / let を使うと、Rhino が 2 回目に
  // 「redeclaration of var」で失敗する。ここでは var を関数の先頭でまとめて宣言する。
  tick(entity, color, refreshPlayers) {
    var id, entry, rangeSqr, players, i, player, dx, dy, dz
    if (entity.level.isClientSide()) return
    id = entity.getStringUuid()
    entry = this.bars[id]
    if (!entry) {
      entry = {
        bar: new KenmaServerBossEvent(entity.getDisplayName(),
          KenmaBossBarColor[(color || 'purple').toUpperCase()], KenmaBossBarOverlay.PROGRESS),
        entity: entity,
      }
      this.bars[id] = entry
    }
    entry.bar.setProgress(Math.max(0, Math.min(1, entity.getHealth() / entity.getMaxHealth())))

    // 見せる相手は 10 tick ごとに入れ替える（近くのプレイヤーだけ）。
    // 既存の MOD のモブは server_scripts/boss_bar.js から 10 tick ごとに呼ぶので、refreshPlayers を true にして毎回入れ替える。
    if (!refreshPlayers && entity.age % 10 !== 0) return
    rangeSqr = KENMA_BOSS_BAR_RANGE * KENMA_BOSS_BAR_RANGE
    players = entity.level.players
    for (i = 0; i < players.length; i++) {
      player = players[i]
      dx = player.x - entity.x
      dy = player.y - entity.y
      dz = player.z - entity.z
      if (entity.isAlive() && dx * dx + dy * dy + dz * dz <= rangeSqr) entry.bar.addPlayer(player)
      else entry.bar.removePlayer(player)
    }
  },

  // 倒された・消えたモブのボスバーを消す。server_scripts/boss_bar.js から定期的に呼ぶ。
  cleanUp() {
    var ids = Object.keys(this.bars), i, entry
    for (i = 0; i < ids.length; i++) {
      entry = this.bars[ids[i]]
      if (entry.entity.isRemoved() || !entry.entity.isAlive()) {
        entry.bar.removeAllPlayers()
        delete this.bars[ids[i]]
      }
    }
  },
}
