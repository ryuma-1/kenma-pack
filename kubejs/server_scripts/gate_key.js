// priority: 0

// ゲート鍵: Elliemore's Deep Waters のゲートを開く鍵（deepwaters:endlesscaves、Deep waters key）のレシピを変える（#23）。
// 元のレシピ（deepwaters:hovaport。粘土2・砂2・深層岩の丸石1）は消し、Ep.30 の動画に映るレシピにする。
// 縦一列に、上から海洋の心・ネザライトインゴット・ネザライトインゴット。
// テクスチャは kubejs/assets/deepwaters/textures/item/deepwaters_key.png で差し替える。

ServerEvents.recipes(event => {
  event.remove({ id: 'deepwaters:hovaport' })

  event.shaped('deepwaters:endlesscaves', [
    'H',
    'N',
    'N',
  ], {
    H: 'minecraft:heart_of_the_sea',
    N: 'minecraft:netherite_ingot',
  }).id('kenma:gate_key')
})
