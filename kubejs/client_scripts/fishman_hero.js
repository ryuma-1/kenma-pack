// priority: 0

// 魚人の英雄（#56）の名前。Cataclysm のリヴァイアサンの名前を変える（ボスバーの名前も変わる）。
// 行動と撃破報酬は server_scripts/fishman_hero.js。

ClientEvents.lang('ja_jp', event => {
  event.add('cataclysm', 'entity.cataclysm.the_leviathan', '魚人の英雄')
})

ClientEvents.lang('en_us', event => {
  event.add('cataclysm', 'entity.cataclysm.the_leviathan', 'Fishman Hero')
})
