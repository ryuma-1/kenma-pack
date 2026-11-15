// priority: 0

// 竜狩りの末裔（#62）。ボスは Cataclysm のスキュラ（cataclysm:scylla）を使う
// （2026-11-13、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。雷の槍と雷雨を使う。
// 戦い方は Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。ボスバーは Cataclysm のもの、魂は server_scripts/boss_souls.js。
// 拠点は Nordic Structures の巨大なバイキングの砦（雪の平原。作中の「北の集落」）。そこで呼び出したスキュラだけが
// 竜狩りの末裔で、名前（entity.kenma.dragon_slayer）と目印のタグ kenma_heir が付く（server_scripts/structure_bases.js）。
// Cataclysm の Acropolis（暖かい海の上空）にもとからいるスキュラは、名前も報酬ももとのまま（1つの拠点にだけ出す）。
//
// 作中の竜狩りの魔法（Pixiv 百科事典）は7つ。どれも Iron's Spells の雷系統の呪文（2026-11-13、利用者と決定）:
//   サンダーストーム = irons_spellbooks:thunderstorm、チェインライトニング = irons_spellbooks:chain_lightning、
//   ライトニングウェーブ = irons_spellbooks:shockwave（作中は前方に放つが、こちらは周りに広がる衝撃波）、
//   エレクトロ = irons_spellbooks:electrocute、ライトニングボール = irons_spellbooks:ball_lightning、
//   アセンション = irons_spellbooks:ascension、ライトニングフォース = irons_spellbooks:charge

// 倒されたら、竜狩りの封印石（endrem:black_eye）1個と、次の10から、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
//   作中の竜狩りの魔法7つと、作中にはないが雷らしい既存の呪文3つ（2026-11-13、利用者と決定）。
// レベルはルーンで上げる想定（#51）。
const DRAGON_SLAYER_SCROLL_SPELLS = [
  ['irons_spellbooks:thunderstorm', 1], ['irons_spellbooks:chain_lightning', 1], ['irons_spellbooks:shockwave', 1],
  ['irons_spellbooks:electrocute', 1], ['irons_spellbooks:ball_lightning', 1], ['irons_spellbooks:ascension', 1],
  ['irons_spellbooks:charge', 1],
  // 作中にはない、雷らしい呪文
  ['irons_spellbooks:lightning_bolt', 1], ['irons_spellbooks:lightning_lance', 1], ['irons_spellbooks:thunder_step', 1],
]

EntityEvents.death('cataclysm:scylla', event => {
  if (!event.entity.tags.contains('kenma_heir')) return
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:black_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, DRAGON_SLAYER_SCROLL_SPELLS, 2, 3)
})
