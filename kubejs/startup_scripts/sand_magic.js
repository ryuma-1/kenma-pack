// priority: 0

// 砂塵の魔法（#61、砂塵の魔術師）。作中の砂塵の魔法は5つ（Pixiv 百科事典）。
// 呪文との対応（2026-11-13、利用者と決定）:
//   サンドストーム   = cataclysm_spellbooks:sandstorm
//   タイムルーラー   = peyroscythe:made_in_heaven（作中でも元の名前は「メイド・イン・ヘブン」）
//   デザートウインド = cataclysm_spellbooks:desert_winds
//   ファントムブレード = cataclysm_spellbooks:phantasmal_blade（帝国近衛騎士の報酬にも入っている）
//   プライマルカース = kenma:primal_curse（ここで作る）
//
// プライマルカース: 作中では「あらゆる攻撃に、術耐性や加護を貫く確定ダメージを上乗せする」魔法。
//   唱えると、しばらく自分に効果 kenma:primal_curse が付く。効果のあいだ、自分が与えたダメージ（近接・弓・呪文のどれでも）
//   1回ごとに、相手に確定ダメージ（1 + 0.5 × 効果の強さ）を足す。一発は小さいが、手数の多い攻撃ほど強くなる。
//   確定ダメージはダメージの種類 kenma:primal_curse（kubejs/data/kenma/damage_type/）。防具・エンチャント・耐性・盾を無視し、
//   無敵時間も無視する（タグ bypasses_*、bypasses_cooldown）。【加護】も無視する（タグ kenma:true_damage）。
//   上乗せの処理は server_scripts/primal_curse.js（KubeJS の EntityEvents.hurt）。Forge の LivingHurtEvent では、
//   上乗せのダメージが入らなかった（2026-11-13 にサーバーで確認）。
//   効果の長さ、ダメージ、マナ、クールダウンは仮の値（試して直す）。
// 名前と説明は client_scripts/sand_mage.js、アイコンは tools/textures/primal_curse_icon.py で描く。
// 登録なので、変えたらサーバーの再起動が要る。

StartupEvents.registry('mob_effect', event => {
  event.create('kenma:primal_curse')
    .beneficial()
    .color(0xc9a86a)
})

StartupEvents.registry('irons_spellbooks:spells', event => {
  // プライマルカース: 自分に効果を付ける（20秒 + 5秒 × レベル、強さはレベル − 1）。
  event.create('kenma:primal_curse')
    .setSchool('irons_spellbooks:nature').setCastType('instant').setMinRarity('rare').setMaxLevel(5)
    .setCooldownSeconds(60).setBaseManaCost(50).setManaCostPerLevel(10)
    .setBaseSpellPower(1).setSpellPowerPerLevel(1).setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.kenma.duration_seconds', 20 + 5 * lv), global.kenmaSpellInfo.line('ui.kenma.extra_true_damage', 1 + 0.5 * (lv - 1))])
    .onCast(ctx => {
      ctx.entity.potionEffects.add('kenma:primal_curse', 20 * (20 + 5 * ctx.spellLevel), ctx.spellLevel - 1)
    })
})
