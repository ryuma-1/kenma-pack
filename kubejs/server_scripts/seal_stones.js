// priority: 0

// 封印石: End Remastered の眼を封印石にする（#24）。
// 動画（Pixiv 百科事典）では、封印石は12個で、継承者を倒すと手に入る。宝箱からは出ない。
// 継承者を倒すと、その封印石を落とす（ルートテーブルは kubejs/data/kenma/loot_tables/entities/）。
// 今あるのは大地の魔術師（大地の封印石 = witch_eye）だけ。ほかはコマンドでしか出せない。
//
// End Remastered の眼は16種類あり、ポータルを開くには違う眼が12個要る。
// 12種類を封印石にし（名前とテクスチャは client_scripts/seal_stones.js と kubejs/assets/endrem/）、
// 残りの4種類（クリプティック・イビル・エキゾティック・アンデッド）は使わない。
//
// 入手を止めているところ:
//   宝箱とモブ（16か所）: config/openloader/data/kenma/data/endrem/loot_tables/ で空にする
//   村人との取引（イビル）とエンチャント（クリプティック）: config/endrem.toml で切る
//   レシピ（3つ）: ここで消す
//
// 溶岩で消えず爆発で消えるのは、End Remastered の眼がもともと耐火（fireResistant）だから。ここでは何もしない。

ServerEvents.recipes(event => {
  event.remove({ id: 'endrem:exotic_eye' })
  event.remove({ id: 'endrem:undead_eye' })
  event.remove({ id: 'endrem:witch_eye' })
})
