// priority: 0

// スーパーゾンビ・スーパークリーパー（#116。2026-11-15、利用者と決定）。
// 自然に湧いたゾンビとクリーパーが、まれに強い個体になる。見た目はバニラのまま、名前を頭の上に出す。
// 数値はすべて kubejs/config/grades.json の superMobs に書く（grades.js が読む）。ここには数値を書かない。
//   chance: スーパー版になる確率。health・damage・speed: 最大体力・攻撃力・移動の速さの基本値に掛ける倍率。
//   knockbackResistance: ノックバック耐性（0〜1）。
//   クリーパーだけ: explosionRadius（爆発の大きさ。バニラは 3）、powered（帯電。爆発が2倍になる）、fuseSeconds（爆発までの秒数。バニラは 1.5）。
//
// 自然に湧いたものだけ（スポナー、/summon、スポーンエッグは対象にしない）。種類は superMobs に書いたものだけで、
// ハスクやドラウンドなどの仲間は入らない。
// 湧いたかどうかの判定は startup_scripts/super_mobs.js（Forge のイベント）で、ここの global.kenmaSuperMobs.roll を呼ぶ。
// /reload で、このファイルと grades.json を読み直す。新しい値は、次に湧くものから効く（もういるものは変えない）。
// 名前はコードで付けるので、名札と違い、遠くに離れればふつうのモブと同じように消える。
//
// L2 Hostility の強化（危険度）は、この上に重なる（基本値を変えるので、L2 Hostility の倍率もそれに掛かる）。
//
// スーパー版とは別に、自然に湧いたクリーパーを grades.json の chargedCreeper.chance の確率で帯電させる（rollCharged）。

const SUPER_MOBS_TAG = 'kenma_super'
const CHARGED_CREEPER_TAG = 'kenma_charged'
const SuperMobsAttributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')

global.kenmaSuperMobs = {
  settings(type) {
    var g = global.kenmaGrades
    if (g == null || g.config == null || g.config.superMobs == null) return null
    return g.config.superMobs[type] || null
  },

  // ふつうの帯電クリーパー（2026-11-16、利用者と決定）。バニラでは落雷でしか帯電しないので、湧いたときに帯電させる。
  // 名前は付けない。見つけやすいように、タグ kenma_charged を付ける。
  rollCharged(entity) {
    var g = global.kenmaGrades, c
    if (String(entity.type) !== 'minecraft:creeper') return
    c = g == null || g.config == null ? null : g.config.chargedCreeper
    if (c == null || !(Math.random() < c.chance)) return
    entity.addTag(CHARGED_CREEPER_TAG)
    entity.mergeNbt({ powered: true })
  },

  // 基本値に倍率を掛ける。
  scale(entity, attribute, mul) {
    var a
    if (mul == null || mul === 1) return
    a = entity.getAttribute(attribute)
    if (a != null) a.setBaseValue(a.getBaseValue() * mul)
  },

  // 自然に湧いたときに呼ばれる。確率に当たれば、スーパー版にする。
  // スーパー版にならなかったクリーパーは、chargedCreeper.chance の確率で帯電させる（ほかはバニラのまま）。
  roll(entity) {
    var s = this.settings(String(entity.type)), a
    if (entity.getTags().contains(SUPER_MOBS_TAG)) return
    if (s == null || !(Math.random() < s.chance)) {
      this.rollCharged(entity)
      return
    }
    entity.addTag(SUPER_MOBS_TAG)
    entity.setCustomName(Text.of(s.name))
    entity.setCustomNameVisible(true)
    this.scale(entity, SuperMobsAttributes.MAX_HEALTH, s.health)
    this.scale(entity, SuperMobsAttributes.ATTACK_DAMAGE, s.damage)
    this.scale(entity, SuperMobsAttributes.MOVEMENT_SPEED, s.speed)
    if (s.knockbackResistance != null) {
      a = entity.getAttribute(SuperMobsAttributes.KNOCKBACK_RESISTANCE)
      if (a != null) a.setBaseValue(s.knockbackResistance)
    }
    entity.setHealth(entity.getMaxHealth())
    if (String(entity.type) === 'minecraft:creeper') {
      var nbt = {}
      if (s.explosionRadius != null) nbt.ExplosionRadius = s.explosionRadius
      if (s.powered) nbt.powered = true
      if (s.fuseSeconds != null) nbt.Fuse = Math.round(s.fuseSeconds * 20)
      entity.mergeNbt(nbt)
    }
    // バニラ（ゾンビのリーダー）や L2 Hostility が、このあとで最大体力の倍率を付けるので、1 tick 後に満タンにし直す。
    entity.level.server.scheduleInTicks(1, () => {
      if (entity.isAlive()) entity.setHealth(entity.getMaxHealth())
    })
    console.info(`super_mobs: ${s.name} が湧いた（${entity.level.dimension} ${entity.blockX} ${entity.blockY} ${entity.blockZ}）`)
  },
}
