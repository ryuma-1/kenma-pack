// priority: 0

// 淀みの魔法（#53、淀みの剣士）。作中の淀みの魔法は8つ（Pixiv 百科事典）。
// 確定ダメージが多く、防具・エンチャント・耐性を貫く。代わりに、自分にも呪い（回復阻害）が付くものがある。
//
// 作中の魔法と、ここで作るもの（2026-11-12、利用者と決定）:
//   アシッドオーブ   = Iron's Spells の酸の唾液（irons_spellbooks:acid_orb、自然系）を使う。ここでは作らない
//   カースドスキャター = kenma:cursed_scatter  周りの敵に確定ダメージ。自分に呪い
//   カースドチェイン  = kenma:cursed_chain    周りの敵を数の制限なしに束縛。自分と相手に短い呪い
//   カースドラング   = kenma:cursed_lung     自分に瘴気耐性（Thin Air の薄い空気で息が減らない）
//   カースドアイ    = kenma:cursed_eye      周りの敵に発光と長めの呪い
//   カースドオーブ   = kenma:cursed_orb      近くの敵、数体までに淀みの侵食（続けて確定ダメージ）
//   カースドハート   = kenma:cursed_heart    自分に魔法ダメージを与え、一時体力（衝撃吸収）を得る
//   チェインカース   = kenma:chain_curse     狙った敵に確定ダメージ。近くの敵へ数体まで連鎖する
//
// 使う部品:
//   呪い（回復阻害） = L2 Complements の l2complements:curse
//   束縛           = L2 Complements の l2complements:stone_cage
//   確定ダメージ      = ダメージの種類 kenma:stagnation（kubejs/data/kenma/damage_type/。防具などを無視するタグ付き）
//   瘴気            = Thin Air の薄い空気（作中の設定）。瘴気耐性の処理は server_scripts/miasma.js
// ダメージの量、効果の長さ、対象の数、マナ、クールダウンは仮の値（試して直す）。
// 名前と説明は client_scripts/stagnation_magic.js、アイコンは tools/textures/stagnation_icons.py で描く。
// 登録なので、変えたらサーバーの再起動が要る。

const KenmaStagnationLivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
const KenmaStagnationPlayer = Java.loadClass('net.minecraft.world.entity.player.Player')
const KenmaStagnationResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
const KenmaStagnationRegistries = Java.loadClass('net.minecraft.core.registries.Registries')
const KenmaStagnationResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

// 呪文の中で使う共通の処理。呪文は何度も唱えられるので、関数の中は var で書く（boss_bar.js の注意を参照）。
global.kenmaStagnation = {
  damageKey: KenmaStagnationResourceKey.create(KenmaStagnationRegistries.DAMAGE_TYPE,
    new KenmaStagnationResourceLocation('kenma', 'stagnation')),

  // 確定ダメージを与える。attacker が null なら、攻撃した者なしのダメージになる。
  trueDamage(target, amount, attacker) {
    var sources = target.damageSources(), source
    if (attacker) source = sources.source(this.damageKey, attacker)
    else source = sources.source(this.damageKey)
    // バニラの hurt は KubeJS からは attack という名前で呼ぶ。
    target.attack(source, amount)
  },

  // caster が狙ってよい相手か。自分と、同じ種類のモブは狙わない。プレイヤーが唱えたときは、ほかのプレイヤーも狙わない。
  isEnemy(caster, entity) {
    // Java のオブジェクトは === で比べられないことがあるので、ID で比べる。
    if (entity.getId() === caster.getId() || !entity.isAlive()) return false
    if (caster instanceof KenmaStagnationPlayer) return !(entity instanceof KenmaStagnationPlayer)
    return !entity.getType().equals(caster.getType())
  },

  // caster の周り radius ブロックの敵を、近い順に返す。
  enemiesAround(caster, radius) {
    var list = caster.level.getEntitiesOfClass(KenmaStagnationLivingEntity, caster.getBoundingBox().inflate(radius))
    var out = [], i, e
    for (i = 0; i < list.size(); i++) {
      e = list.get(i)
      if (this.isEnemy(caster, e) && caster.distanceToSqr(e) <= radius * radius) out.push(e)
    }
    out.sort((a, b) => caster.distanceToSqr(a) - caster.distanceToSqr(b))
    return out
  },

  // 唱えた者が狙っている相手。モブは今の標的、プレイヤーは視線の先（range ブロック以内で、いちばん視線に近い敵）。
  aimedTarget(caster, range) {
    var look, list, i, e, dx, dy, dz, dist, dot, best = null, bestDot = 0.95
    if (!(caster instanceof KenmaStagnationPlayer)) {
      e = caster.getTarget ? caster.getTarget() : null
      return e && e.isAlive() ? e : null
    }
    look = caster.getLookAngle()
    list = this.enemiesAround(caster, range)
    for (i = 0; i < list.length; i++) {
      e = list[i]
      dx = e.getX() - caster.getX()
      dy = e.getY() + e.getBbHeight() / 2 - caster.getEyeY()
      dz = e.getZ() - caster.getZ()
      dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < 0.01) continue
      dot = (dx * look.x + dy * look.y + dz * look.z) / dist
      if (dot > bestDot && caster.hasLineOfSight(e)) {
        bestDot = dot
        best = e
      }
    }
    return best
  },

  addEffect(entity, id, ticks, amplifier) {
    entity.potionEffects.add(id, ticks, amplifier || 0)
  },
}

StartupEvents.registry('irons_spellbooks:schools', event => {
  event.create('kenma:stagnation')
    .setName(Text.of('淀み').color(0x7a5a8c))
    .setFocus('kenma:stagnation_focus')
    // 威力は淀みの魔法の力（startup_scripts/spellbooks.js で作る。第三等級の魔導書で上がる）。
    // 耐性の属性はまだ作らない。酸の唾液（アシッドオーブ）と同じ自然系の属性を使う。
    .setPowerAttribute('kenma:stagnation_spell_power')
    .setResistanceAttribute('irons_spellbooks:nature_magic_resist')
    .setDefaultCastSound('minecraft:entity.wither.ambient')
    .setDamageType('kenma:stagnation')
})

StartupEvents.registry('mob_effect', event => {
  // カースドラングで付く。効き目は server_scripts/miasma.js（空気が薄い場所で息が減らない）。
  event.create('kenma:miasma_resistance')
    .beneficial()
    .color(0x9a8fb8)

  // カースドオーブで付く。1秒ごとに確定ダメージ（1 + 0.5 × 強さ）。
  event.create('kenma:stagnant_rot')
    .harmful()
    .color(0x4b2c5e)
    .effectTick((entity, amplifier) => {
      if (entity.level.isClientSide() || entity.age % 20 !== 0) return
      global.kenmaStagnation.trueDamage(entity, 1 + 0.5 * amplifier, null)
    })
})

StartupEvents.registry('irons_spellbooks:spells', event => {
  event.create('kenma:cursed_scatter')
    .setSchool('kenma:stagnation').setCastType('instant').setMinRarity('uncommon').setMaxLevel(10)
    .setCooldownSeconds(12).setBaseManaCost(40).setManaCostPerLevel(5)
    .setBaseSpellPower(4).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.true_damage', 3 + lv), global.kenmaSpellInfo.line('ui.irons_spellbooks.radius', 5), global.kenmaSpellInfo.line('ui.kenma.self_curse_seconds', 8)])
    .onCast(ctx => {
      var s = global.kenmaStagnation, caster = ctx.entity, list = s.enemiesAround(caster, 5), i
      for (i = 0; i < list.length; i++) s.trueDamage(list[i], 3 + ctx.spellLevel, caster)
      // 代償: 自分に呪い（8秒）
      s.addEffect(caster, 'l2complements:curse', 160, 0)
    })

  event.create('kenma:cursed_chain')
    .setSchool('kenma:stagnation').setCastType('instant').setMinRarity('rare').setMaxLevel(5)
    .setCooldownSeconds(25).setBaseManaCost(60).setManaCostPerLevel(10)
    .setBaseSpellPower(2).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.bind_seconds', 2 + 0.5 * lv), global.kenmaSpellInfo.line('ui.kenma.curse_seconds', 3), global.kenmaSpellInfo.line('ui.irons_spellbooks.radius', 8), global.kenmaSpellInfo.line('ui.kenma.self_curse_seconds', 3)])
    .onCast(ctx => {
      var s = global.kenmaStagnation, caster = ctx.entity, list = s.enemiesAround(caster, 8), i
      for (i = 0; i < list.length; i++) {
        s.addEffect(list[i], 'l2complements:stone_cage', 40 + 10 * ctx.spellLevel, 0)
        s.addEffect(list[i], 'l2complements:curse', 60, 0)
      }
      // 代償: 自分にも短い呪い（3秒）
      s.addEffect(caster, 'l2complements:curse', 60, 0)
    })

  event.create('kenma:cursed_lung')
    .setSchool('kenma:stagnation').setCastType('instant').setMinRarity('common').setMaxLevel(3)
    .setCooldownSeconds(30).setBaseManaCost(30).setManaCostPerLevel(10)
    .setBaseSpellPower(1).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.duration_minutes', 2 * lv)])
    .onCast(ctx => {
      // 2分 × レベル
      global.kenmaStagnation.addEffect(ctx.entity, 'kenma:miasma_resistance', 2400 * ctx.spellLevel, 0)
    })

  event.create('kenma:cursed_eye')
    .setSchool('kenma:stagnation').setCastType('instant').setMinRarity('uncommon').setMaxLevel(5)
    .setCooldownSeconds(20).setBaseManaCost(40).setManaCostPerLevel(5)
    .setBaseSpellPower(1).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.curse_seconds', 10 + 4 * lv), global.kenmaSpellInfo.line('ui.irons_spellbooks.radius', 12)])
    .onCast(ctx => {
      var s = global.kenmaStagnation, list = s.enemiesAround(ctx.entity, 12), i
      for (i = 0; i < list.length; i++) {
        s.addEffect(list[i], 'minecraft:glowing', 200, 0)
        s.addEffect(list[i], 'l2complements:curse', 200 + 80 * ctx.spellLevel, 0)
      }
    })

  event.create('kenma:cursed_orb')
    .setSchool('kenma:stagnation').setCastType('instant').setMinRarity('rare').setMaxLevel(10)
    .setCooldownSeconds(15).setBaseManaCost(50).setManaCostPerLevel(5)
    .setBaseSpellPower(1).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.rot_per_second', 1 + 0.5 * (lv - 1)), global.kenmaSpellInfo.line('ui.irons_spellbooks.max_victims', 1 + Math.ceil(lv / 3)), global.kenmaSpellInfo.line('ui.irons_spellbooks.radius', 10)])
    .onCast(ctx => {
      var s = global.kenmaStagnation, list = s.enemiesAround(ctx.entity, 10), i
      // 対象の数の制限: 1 + レベル÷3（切り上げ）
      var max = 1 + Math.ceil(ctx.spellLevel / 3)
      for (i = 0; i < list.length && i < max; i++) s.addEffect(list[i], 'kenma:stagnant_rot', 120, ctx.spellLevel - 1)
    })

  event.create('kenma:cursed_heart')
    .setSchool('kenma:stagnation').setCastType('instant').setMinRarity('uncommon').setMaxLevel(5)
    .setCooldownSeconds(30).setBaseManaCost(20).setManaCostPerLevel(5)
    .setBaseSpellPower(4).setSpellPowerPerLevel(2).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.irons_spellbooks.absorption', 4 + 2 * lv), global.kenmaSpellInfo.line('ui.kenma.self_damage', 4)])
    .onCast(ctx => {
      var caster = ctx.entity
      // 代償: 自分に魔法ダメージ4。そのあと、一時体力を 4 + 2 × レベル 得る。
      caster.attack(caster.damageSources().magic(), 4)
      if (caster.isAlive()) caster.setAbsorptionAmount(caster.getAbsorptionAmount() + 4 + 2 * ctx.spellLevel)
    })

  event.create('kenma:chain_curse')
    .setSchool('kenma:stagnation').setCastType('instant').setMinRarity('rare').setMaxLevel(10)
    .setCooldownSeconds(10).setBaseManaCost(40).setManaCostPerLevel(5)
    .setBaseSpellPower(5).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.true_damage', 4 + lv), global.kenmaSpellInfo.line('ui.kenma.chain_targets', 3 + Math.floor(lv / 3)), global.kenmaSpellInfo.line('ui.irons_spellbooks.distance', 16)])
    .onCast(ctx => {
      var s = global.kenmaStagnation, caster = ctx.entity, target = s.aimedTarget(caster, 16)
      var hit = [], hitIds = [], jumps = 2 + Math.floor(ctx.spellLevel / 3), list, i, next, d, best
      while (target && hit.length <= jumps) {
        s.trueDamage(target, 4 + ctx.spellLevel, caster)
        hit.push(target)
        hitIds.push(target.getId())
        // 次の相手: 今の相手から6ブロック以内で、まだ当てていない、いちばん近い敵
        list = s.enemiesAround(caster, 24)
        next = null
        best = 36
        for (i = 0; i < list.length; i++) {
          if (hitIds.indexOf(list[i].getId()) >= 0) continue
          d = target.distanceToSqr(list[i])
          if (d <= best) {
            best = d
            next = list[i]
          }
        }
        target = next
      }
    })
})
