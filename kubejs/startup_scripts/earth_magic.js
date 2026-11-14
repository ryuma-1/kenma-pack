// priority: 0

// 大地の魔法のうち、Iron's Spells にないもの（#7）。
// 作中のアースヒールは「体力を8回復する。レベル10以外のスクロールが存在しない下位の回復魔法」（Pixiv 百科事典）。
// 自然系に回復の呪文はなく、聖系のヒールは最大レベルが8で合わないので、自然系の呪文として作る。
// 回復量はレベルによらず8（ハート4個）。巻物はレベル10でだけ落とす（server_scripts/earth_mage.js）。
// 名前は client_scripts/earth_mage.js、アイコンは kubejs/assets/kenma/textures/gui/spell_icons/earth_heal.png
// （tools/textures/earth_heal.py で描く）。
// 登録なので、変えたらサーバーの再起動が要る。

StartupEvents.registry('irons_spellbooks:spells', event => {
  event.create('kenma:earth_heal')
    .setSchool('irons_spellbooks:nature')
    .setCastType('instant')
    .setMinRarity('common')
    .setMaxLevel(10)
    .setCooldownSeconds(10)
    .setBaseManaCost(30)
    .setManaCostPerLevel(0)
    .setBaseSpellPower(8)
    .setSpellPowerPerLevel(0)
    .setCastTime(0)
    .setUniqueInfo((lv, entity) => [global.kenmaSpellInfo.line('ui.irons_spellbooks.healing', 8)])
    .onCast(ctx => {
      ctx.entity.heal(8)
    })
})
