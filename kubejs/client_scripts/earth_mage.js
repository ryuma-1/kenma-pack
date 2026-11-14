// priority: 0

// 大地の魔術師（#47）と、自作の大地の魔法（#7）の名前。
// 登録は startup_scripts/earth_mage.js と startup_scripts/earth_magic.js。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'entity.kenma.earth_mage', '大地の魔術師')
  event.add('kenma', 'spell.kenma.earth_heal', 'アースヒール')
  event.add('kenma', 'spell.kenma.earth_heal.guide', '大地の力で、自分の体力を8回復する。')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'entity.kenma.earth_mage', 'Earth Mage')
  event.add('kenma', 'spell.kenma.earth_heal', 'Earth Heal')
  event.add('kenma', 'spell.kenma.earth_heal.guide', 'Draws on the power of the earth to restore 8 health to yourself.')
})
