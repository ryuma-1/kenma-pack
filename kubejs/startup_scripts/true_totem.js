// priority: 0

// 本物のトーテム（#128。2026-11-16、利用者と決定）。砂塵の魔術師が倒されるたびに1個落とす。
// Curios の charm の枠に着けておくと、不死のトーテムと同じく死を防ぐ。壊れず、防いだあと1分は効かない。
// 死を防ぐ処理と charm の枠のタグは server_scripts/true_totem.js、名前と説明は client_scripts/true_totem.js。
// 見た目は不死のトーテムのテクスチャ（バニラのものを参照するだけで、写しは置かない）に、エンチャントの光を付けたもの。
// 登録なので、変えたらサーバーの再起動が要る。

StartupEvents.registry('item', event => {
  event.create('kenma:true_totem')
    .maxStackSize(1)
    .texture('minecraft:item/totem_of_undying')
    .glow(true)
    .rarity('epic')
    .fireResistant(true)
})
