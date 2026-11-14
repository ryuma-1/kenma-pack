// priority: 0

// 半竜の乙女（#55）の名前。Cataclysm のイグニスの名前を変える（ボスバーの名前も変わる）。
// 撃破報酬は server_scripts/dragon_maiden.js。

ClientEvents.lang('ja_jp', event => {
  event.add('cataclysm', 'entity.cataclysm.ignis', '半竜の乙女')
})

ClientEvents.lang('en_us', event => {
  event.add('cataclysm', 'entity.cataclysm.ignis', 'Half-Dragon Maiden')
})
