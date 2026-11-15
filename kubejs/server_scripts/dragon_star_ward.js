// priority: 0

// 竜星避け（Skyfall の Skyfall Protector）のレシピ（#120。2026-11-16、利用者と決定）。
// 動画の画面のレシピに合わせる。上の真ん中は Skyfall の Stardust（テクスチャで一致を確かめた）。
// 下の真ん中の水色のブロックは、画面からダイヤモンドブロックと判断した（推測）。
// もとのレシピ（Skyfall 3.0.0。上の真ん中がアメジストの欠片、下の真ん中が Stardust）は消す。
// 日本語の名前は client_scripts/dragon_star_ward.js。

ServerEvents.recipes(event => {
  event.remove({ id: 'skyfall:skyfall_protector_recipe' })
  event.shaped('skyfall:skyfall_protector', [
    'GSG',
    'CDC',
  ], {
    G: 'minecraft:gold_ingot',
    S: 'skyfall:stardust',
    C: 'minecraft:copper_block',
    D: 'minecraft:diamond_block',
  }).id('kenma:dragon_star_ward')
})
