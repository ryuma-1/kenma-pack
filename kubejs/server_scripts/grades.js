// priority: 10

// ボスの等級ごとの強さ（#107、#106。2026-11-15、利用者と決定）。
// 数値はすべて kubejs/config/grades.json に書く。ここには数値を書かない。調整のしかたは docs/boss-grades.md。
//
// 等級はボスだけに付く分類（第四〜第一、第零、？の魔王）。ボスの強さは「等級ごとの基本の強さ ＋ 危険度による強さ」。
//   基本の強さ: 体力（最大体力の基本値をこの値にする）と、攻撃の倍率（ボスが与えるダメージすべてに掛ける）。
//   危険度による強さ: L2 Hostility のレベルで足される体力と攻撃。ボスには、普通の敵の bossHealthScale 倍・bossDamageScale 倍だけ効く。
//     L2 Hostility がもとからボスに付けていた最低レベル（Cataclysm のボスの 100、200 など）は外す（下の highPriorityData）。
//
// /reload で、このファイルと grades.json を読み直す。次に出るボスにも、もうワールドにいるボスにも新しい値が効く。
//   体力: ボスがワールドに出たとき（区画の読み込みを含む）と /reload のときに、基本値を grades.json の値に合わせる。
//         残りの体力は割合を保つ（初めて等級が付いたときだけ満タンにする）。
//   攻撃の倍率: ダメージを与えるたびに grades.json の値で計算する（startup_scripts/grades.js。Forge のイベントは起動時スクリプトでしか登録できない）。
//
// どのボスに等級を付けるかは grades.json の bosses。heirOnly のものは、拠点で呼び出した継承者（目印のタグ kenma_heir。
// server_scripts/structure_bases.js）だけに付ける。拠点以外にもとからいる同じモブは、ボス以外として扱う（2026-11-15、利用者と決定）。
// 付けた等級は、タグ kenma_grade_<等級の ID> でボスに記録する。
//
// /kenma_grade（OP だけ）で、見ているボスの等級と今の値をチャットに出す。

const GRADES_CONFIG_PATH = 'kubejs/config/grades.json'
const GRADES_TAG_PREFIX = 'kenma_grade_'
const GRADES_HEIR_TAG = 'kenma_heir' // structure_bases.js の KENMA_HEIR_TAG と同じ

// L2 Hostility がボスに付けている設定のうち、grades.json のボスを含むファイル（jar の中身で確かめた。l2hostility-2.5.19）。
// grades.json のボスに含まれるものだけ、中身を空にして外す。
// エンダードラゴンは、ほかのボスと同じファイル（l2hostility:l2hostility_config/entity/bosses）に入っているので、
// ドラゴンだけを抜いたものを kubejs/data/l2hostility/l2hostility_config/entity/bosses.json に置いてある。
const GRADES_L2_ORIGINAL_FILES = {
  'cataclysm:aptrgangr': 'cataclysm:l2hostility_config/entity/aptrgangr',
  'cataclysm:wadjet': 'cataclysm:l2hostility_config/entity/wadjet',
  'cataclysm:ignis': 'cataclysm:l2hostility_config/entity/ignis',
  'cataclysm:the_leviathan': 'cataclysm:l2hostility_config/entity/the_leviathan',
  'cataclysm:the_harbinger': 'cataclysm:l2hostility_config/entity/the_harbinger',
  'cataclysm:netherite_monstrosity': 'cataclysm:l2hostility_config/entity/netherite_monstrosity',
  'cataclysm:ancient_remnant': 'cataclysm:l2hostility_config/entity/ancient_remnant',
  'cataclysm:scylla': 'cataclysm:l2hostility_config/entity/scylla',
  'cataclysm:maledictus': 'cataclysm:l2hostility_config/entity/maledictus',
  'cataclysm:ender_guardian': 'cataclysm:l2hostility_config/entity/ender_guardian',
}

const GradesMobTraitCap = Java.loadClass('dev.xkmc.l2hostility.content.capability.mob.MobTraitCap')
const GradesPlayerDifficulty = Java.loadClass('dev.xkmc.l2hostility.content.capability.player.PlayerDifficulty')
const GradesLHConfig = Java.loadClass('dev.xkmc.l2hostility.init.data.LHConfig')
const GradesAttributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')
const GradesTraits = Java.loadClass('dev.xkmc.l2hostility.init.registrate.LHTraits')
const GradesResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

// grades.json を読み、間違いがあればログに出す。読めなければ null（そのときは何もしない）。
function gradesLoad() {
  var config, byEntity = {}, i, b
  try {
    config = JSON.parse(String(JsonIO.readString(GRADES_CONFIG_PATH)))
  } catch (e) {
    console.error(`grades: ${GRADES_CONFIG_PATH} を読めない: ${e}`)
    return null
  }
  for (i = 0; i < config.bosses.length; i++) {
    b = config.bosses[i]
    if (!config.grades[b.grade]) {
      console.error(`grades: ${b.entity} の等級 ${b.grade} が grades にない`)
      continue
    }
    byEntity[b.entity] = b
  }
  config.byEntity = byEntity
  console.info(`grades: ${GRADES_CONFIG_PATH} を読んだ（等級 ${Object.keys(config.grades).length}、ボス ${Object.keys(byEntity).length}）`)
  return config
}

global.kenmaGrades = {
  config: gradesLoad(),

  // そのモブに付いている等級の ID。なければ null。
  // 何度も呼ばれる関数なので var で書く（boss_bar.js の注意を参照）。
  gradeOf(entity) {
    var tags = entity.getTags(), id
    if (this.config == null) return null
    for (id in this.config.grades) if (tags.contains(GRADES_TAG_PREFIX + id)) return id
    return null
  },

  // grades.json の bosses で、そのモブに付けるべき等級の ID。なければ null。
  wantedGradeOf(entity) {
    var b
    if (this.config == null) return null
    b = this.config.byEntity[String(entity.type)]
    if (b == null) return null
    if (b.heirOnly && !entity.getTags().contains(GRADES_HEIR_TAG)) return null
    return b.grade
  },

  // 呪文の系統の弱点と耐性（#127。2026-11-16、利用者と決定）。grades.json の bosses の weakTo（弱点の系統）と
  // resists（自分の系統）、倍率は spellWeakness（weak、resist）。呪文のダメージに掛ける倍率を返す（関係なければ 1）。
  // heirOnly のボスは、継承者にだけ効く。呼ぶのは startup_scripts/spell_weakness.js（Forge のイベント）。
  spellMultiplier(target, school) {
    var b, s
    if (this.config == null || this.config.spellWeakness == null || this.wantedGradeOf(target) == null) return 1
    b = this.config.byEntity[String(target.type)]
    s = this.config.spellWeakness
    if (b.weakTo === school) return s.weak
    if (b.resists === school) return s.resist
    return 1
  },

  // 等級の体力を当てる。ワールドに出たときと /reload のときに呼ぶ。
  apply(entity, server) {
    var wanted, current, id, grade, first, ratio, b
    if (!entity.isLiving() || !entity.isAlive()) return
    wanted = this.wantedGradeOf(entity)
    current = this.gradeOf(entity)
    // 等級が変わった（grades.json から外した、別の等級にした）ら、古いタグを外す。外したボスの体力は戻さない。
    if (current != null && current !== wanted) {
      for (id in this.config.grades) entity.removeTag(GRADES_TAG_PREFIX + id)
    }
    if (wanted == null) return
    grade = this.config.grades[wanted]
    first = current == null
    ratio = first ? 1 : Math.max(0, Math.min(1, entity.getHealth() / entity.getMaxHealth()))
    entity.addTag(GRADES_TAG_PREFIX + wanted)
    entity.setMaxHealth(grade.health)
    // L2 Hostility が最大体力の倍率をあとから付けることがあるので、1 tick 後に残りの体力を合わせる。
    server.scheduleInTicks(1, () => {
      if (entity.isAlive()) entity.setHealth(entity.getMaxHealth() * ratio)
    })
    b = this.config.byEntity[String(entity.type)]
    if (b.traits) server.scheduleInTicks(1, () => this.applyTraits(entity, server, b.traits, 0))
  },

  // ボスが与えるダメージに掛ける倍率。startup_scripts/grades.js から呼ぶ。
  damageMultiplier(attacker) {
    var id = this.gradeOf(attacker)
    return id == null ? 1 : this.config.grades[id].damage
  },

  // L2 Hostility の設定（datapack）として、grades.json のボスの設定を作る。
  // 最低レベルなし、足し算なし。危険度（L2 Hostility のレベル）の効き目を bossHealthScale・bossDamageScale 倍にする。
  // traits を書いたボス（#129）は、ランダムな特性を付けない（presetTraitsOnly、traits は空）。決まった特性は applyTraits で付ける。
  l2Config() {
    var list = [], byEntity = this.config.byEntity, random = [], fixed = []
    Object.keys(byEntity).forEach(e => (byEntity[e].traits ? fixed : random).push(e))
    var entry = (entities, presetOnly) => ({
      entities: entities,
      difficulty: { apply_chance: 1.0, base: 0, min: 0, scale: 0.0, suppression: 0.0, trait_chance: 1.0, variation: 0.0 },
      healthScale: this.config.danger.bossHealthScale,
      attackScale: this.config.danger.bossDamageScale,
      blacklist: [], items: [], traits: [], specialConditions: [],
      maxLevel: 0, maxTraitCount: -1, minSpawnLevel: 0, presetTraitsOnly: presetOnly,
    })
    if (random.length > 0) list.push(entry(random, false))
    if (fixed.length > 0) list.push(entry(fixed, true))
    return { list: list }
  },

  // grades.json の traits（特性の ID: ランク）を、そのボスに決まった特性として付ける（#129。2026-11-16、利用者と決定）。
  // L2 Hostility の決まった特性（datapack の traits）は、モブのレベルが特性の出始めるレベルより低いと付かないので、
  // L2 Hostility が初期化を終えたあとに MobTraitCap.setTrait で直接付ける。書いていない特性は外す（ランク 0）。
  // setTrait は予約で、L2 Hostility の次の処理で付いたり外れたりする。
  applyTraits(entity, server, wanted, tries) {
    var cap, id, trait, have
    if (!entity.isAlive()) return
    try {
      if (!GradesMobTraitCap.HOLDER.isProper(entity)) return
      cap = GradesMobTraitCap.HOLDER.get(entity)
      if (!cap.isInitialized()) {
        if (tries < 40) server.scheduleInTicks(5, () => this.applyTraits(entity, server, wanted, tries + 1))
        else console.error(`grades: ${entity.type} の L2 Hostility が初期化されないので、特性を付けられない`)
        return
      }
      have = {}
      cap.traits.keySet().forEach(t => { have[String(GradesTraits.TRAITS.get().getKey(t))] = cap.getTraitLevel(t) })
      for (id in have) if (!(id in wanted)) cap.setTrait(GradesTraits.TRAITS.get().getValue(new GradesResourceLocation(id)), 0)
      for (id in wanted) {
        trait = GradesTraits.TRAITS.get().getValue(new GradesResourceLocation(id))
        if (trait == null) { console.error(`grades: 特性 ${id} がない`); continue }
        if (have[id] !== wanted[id]) cap.setTrait(trait, wanted[id])
      }
    } catch (e) {
      console.error(`grades: ${entity.type} に特性を付けられない: ${e}`)
    }
  },

  // そのモブに付いている特性（ID とランク）。
  traitText(entity) {
    var cap, list = []
    try {
      if (!GradesMobTraitCap.HOLDER.isProper(entity)) return '（L2 Hostility の対象外）'
      cap = GradesMobTraitCap.HOLDER.get(entity)
      cap.traits.keySet().forEach(t => list.push(`${GradesTraits.TRAITS.get().getKey(t)} ${cap.getTraitLevel(t)}`))
    } catch (e) {
      return `（読めない: ${e}）`
    }
    return list.length === 0 ? 'なし' : list.join('、')
  },

  // /kenma_grade: 見ているモブ（いなければ 64 ブロック以内でいちばん近い等級付きのボス）の値を出す。
  info(player) {
    var target = null, hit, best = 1e9, list, i, e, d, id, grade, lv, hf, df, scale
    try {
      hit = player.rayTrace(64)
      if (hit != null && hit.entity != null && hit.entity.isLiving()) target = hit.entity
    } catch (err) { /* 見ているモブがなければ、近くのボスを探す */ }
    if (target == null) {
      list = player.level.getEntities()
      for (i = 0; i < list.size(); i++) {
        e = list.get(i)
        if (!e.isLiving() || this.gradeOf(e) == null) continue
        d = player.getDistance(e.getX(), e.getY(), e.getZ()) // distanceTo は KubeJS から呼べなかった（danger.js）
        if (d < 64 && d < best) { best = d; target = e }
      }
    }
    if (target == null) {
      player.tell('等級の付いたボスが見つからない（見ているモブも、64 ブロック以内のボスもない）')
      return 0
    }
    id = this.gradeOf(target)
    grade = id == null ? null : this.config.grades[id]
    lv = 0
    try { if (GradesMobTraitCap.HOLDER.isProper(target)) lv = GradesMobTraitCap.HOLDER.get(target).getLevel() } catch (err) { lv = -1 }
    hf = GradesLHConfig.COMMON.healthFactor.get()
    df = GradesLHConfig.COMMON.damageFactor.get()
    scale = grade == null ? { h: 1, d: 1 } : { h: this.config.danger.bossHealthScale, d: this.config.danger.bossDamageScale }
    player.tell(`[等級] ${target.displayName.string}（${target.type}）`)
    player.tell(`  等級: ${grade == null ? 'ボス以外' : grade.name + '（' + id + '）'}`)
    player.tell(`  体力: ${target.getHealth().toFixed(1)} / ${target.getMaxHealth().toFixed(1)}（基本 ${target.getAttributeBaseValue(GradesAttributes.MAX_HEALTH)}）`)
    player.tell(`  攻撃の倍率（等級）: ${grade == null ? 1 : grade.damage}`)
    player.tell(`  L2 Hostility のレベル: ${lv}（体力 +${(lv * hf * scale.h * 100).toFixed(0)}%、攻撃 +${(lv * df * scale.d * 100).toFixed(0)}%）`)
    player.tell(`  特性: ${this.traitText(target)}`)
    if (this.wantedGradeOf(target) != null) {
      player.tell(`  弱点の系統: ${this.config.byEntity[String(target.type)].weakTo || 'なし'}、耐性の系統: ${this.config.byEntity[String(target.type)].resists || 'なし'}`)
    }
    try {
      player.tell(`  あなたの危険度（L2 Hostility のプレイヤーのレベル）: ${GradesPlayerDifficulty.HOLDER.get(player).getLevel().getLevel()}`)
    } catch (err) { /* 出せなくてもよい */ }
    return 1
  },
}

EntityEvents.spawned(event => {
  try {
    global.kenmaGrades.apply(event.entity, event.server)
  } catch (e) {
    console.error(`grades: ${e}`)
  }
})

// /reload のとき、もうワールドにいるボスにも当て直す（起動したときは、まだ誰もいないので何もしない）。
if (Utils.server != null) {
  Utils.server.scheduleInTicks(1, () => {
    var n = 0
    Utils.server.getAllLevels().forEach(level => {
      level.getEntities().forEach(e => {
        try {
          global.kenmaGrades.apply(e, Utils.server)
          if (global.kenmaGrades.gradeOf(e) != null) n++
        } catch (err) {
          console.error(`grades: ${err}`)
        }
      })
    })
    console.info(`grades: ワールドにいる等級付きのボス ${n} 体に当て直した`)
  })
}

// L2 Hostility の設定を上書きする。
ServerEvents.highPriorityData(event => {
  var g = global.kenmaGrades, entity
  if (g.config == null) return
  // 名前空間は、読み込まれている MOD のものにする（L2 Hostility は、MOD がない名前空間のファイルを読まない。kenma では読まれなかった）。
  event.addJson('l2hostility:l2hostility_config/entity/kenma_grades', g.l2Config())
  for (entity in GRADES_L2_ORIGINAL_FILES) {
    if (g.config.byEntity[entity]) event.addJson(GRADES_L2_ORIGINAL_FILES[entity], { list: [] })
  }
})

ServerEvents.commandRegistry(event => {
  const { commands: Commands } = event
  event.register(Commands.literal('kenma_grade')
    .requires(source => source.hasPermission(2))
    .executes(ctx => {
      var player = ctx.source.getPlayer()
      if (player == null) return 0
      return global.kenmaGrades.info(player)
    }))
})
