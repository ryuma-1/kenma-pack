// priority: 0

// 聖の魔法（#54、星降りの聖職者）。作中の聖の魔法は9つ（Pixiv 百科事典）。
// Iron's Spells と PeyroScythe の呪文との対応（2026-11-12、利用者と決定）:
//   ウィスプ = irons_spellbooks:wisp、ディバイン・スマイト = irons_spellbooks:divine_smite、
//   ヒール = irons_spellbooks:heal、ホーリーランス = peyroscythe:holy_lance、
//   ホーリーレイ = peyroscythe:nero_holy_ray（クールダウン 0。defaultconfigs/irons_spellbooks-server.toml）、
//   エンジェルウィング = irons_spellbooks:angel_wing、ガイドボルト = irons_spellbooks:guiding_bolt、
//   サンクティファイ = kenma:sanctify（ここで作る）、グレートヒール = irons_spellbooks:greater_heal
// 名前と説明は client_scripts/astral_priest.js、アイコンは tools/textures/sanctify_icon.py で描く。
// 登録なので、変えたらサーバーの再起動が要る。

StartupEvents.registry('irons_spellbooks:spells', event => {
  // サンクティファイ: 自分にかかっている悪い効果だけを消し、短い再生（5秒 + 1秒 × レベル）を付ける。
  event.create('kenma:sanctify')
    .setSchool('irons_spellbooks:holy').setCastType('instant').setMinRarity('uncommon').setMaxLevel(5)
    .setCooldownSeconds(20).setBaseManaCost(40).setManaCostPerLevel(5)
    .setBaseSpellPower(5).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.regeneration_seconds', 5 + lv)])
    .onCast(ctx => {
      // 何度も唱えられるので var で書く（boss_bar.js の注意を参照）。
      var caster = ctx.entity, effects = caster.getActiveEffects().toArray(), i, effect
      for (i = 0; i < effects.length; i++) {
        effect = effects[i].getEffect()
        if (effect.getCategory().name() === 'HARMFUL') caster.removeEffect(effect)
      }
      caster.potionEffects.add('minecraft:regeneration', 100 + 20 * ctx.spellLevel, 0)
    })
})
