// priority: 0

// 召喚の魔術師（#57）の名前。拠点で呼び出した Cataclysm のハービンジャーに付ける（server_scripts/structure_bases.js）。
// もとのハービンジャーの名前は変えない（Ancient Factory にいるものは召喚の魔術師ではない）。
// 撃破報酬は server_scripts/summoner_mage.js。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'entity.kenma.summoner_mage', '召喚の魔術師')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'entity.kenma.summoner_mage', 'Summoner Mage')
})
