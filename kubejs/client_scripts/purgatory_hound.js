// priority: 0

// 煉獄の猟犬（#60）の名前。Cataclysm のネザライトの怪物の名前を変える（ボスバーの名前も変わる）。
// 撃破報酬は server_scripts/purgatory_hound.js。

ClientEvents.lang('ja_jp', event => {
  event.add('cataclysm', 'entity.cataclysm.netherite_monstrosity', '煉獄の猟犬')
})

ClientEvents.lang('en_us', event => {
  event.add('cataclysm', 'entity.cataclysm.netherite_monstrosity', 'Purgatory Hound')
})
