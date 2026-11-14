// priority: 0

// 竜狩りの末裔（#62）の名前。拠点で呼び出した Cataclysm のスキュラに付ける（server_scripts/structure_bases.js）。
// もとのスキュラの名前は変えない（Acropolis にいるものは竜狩りの末裔ではない）。
// 撃破報酬は server_scripts/dragon_slayer.js。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'entity.kenma.dragon_slayer', '竜狩りの末裔')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'entity.kenma.dragon_slayer', 'Dragon Slayer Descendant')
})
