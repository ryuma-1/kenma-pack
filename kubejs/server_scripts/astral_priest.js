// priority: 0

// 星降りの聖職者（#54）。ボスは Cataclysm の古の魔術槍士の骸（cataclysm:wadjet）を使う
// （2026-11-12、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針。聖職者らしい見た目でなくてよいので、
// 魔法を使い、第四等級に合う強さのものを選んだ）。
// 戦い方は Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。名前は client_scripts/astral_priest.js、ボスバーは server_scripts/boss_bar.js、
// 魂は server_scripts/boss_souls.js。
// 拠点は Iron's Spells の Mountain Tower（2026-11-13、利用者がゲームの中で選んだ）。
// そこで呼び出した Wadjet だけが星降りの聖職者で、名前（entity.kenma.astral_priest）と目印のタグ kenma_heir が付く
// （server_scripts/structure_bases.js）。Cataclysm の Cursed Pyramid にもとからいる Wadjet は、名前も報酬ももとのまま。
// （はじめは Cursed Pyramid の Wadjet をそのまま使っていたが、同じピラミッドの Ancient Remnant を砂塵の魔術師にするので変えた）
// 作中の聖の魔法と呪文の対応は startup_scripts/holy_magic.js。

// 倒されたら、聖の封印石（endrem:corrupted_eye）1個と、次の17から、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
//   聖の魔法9つと、作中にはないが聖らしい既存の呪文8つ（2026-11-12、利用者と決定）。
//   スターフォールはエンダー系だが、星を降らせるので「星降り」に入れる。
// レベルはルーンで上げる想定（#51）。
const ASTRAL_PRIEST_SCROLL_SPELLS = [
  ['irons_spellbooks:wisp', 1], ['irons_spellbooks:divine_smite', 1], ['irons_spellbooks:heal', 1],
  ['peyroscythe:holy_lance', 1], ['peyroscythe:nero_holy_ray', 1], ['irons_spellbooks:angel_wing', 1],
  ['irons_spellbooks:guiding_bolt', 1], ['kenma:sanctify', 1], ['irons_spellbooks:greater_heal', 1],
  // 作中にはない、聖らしい呪文
  ['irons_spellbooks:starfall', 1], ['irons_spellbooks:sunbeam', 1], ['irons_spellbooks:healing_circle', 1],
  ['irons_spellbooks:blessing_of_life', 1], ['irons_spellbooks:fortify', 1], ['irons_spellbooks:haste', 1],
  ['irons_spellbooks:cloud_of_regeneration', 1], ['peyroscythe:holy_bell', 1],
]

EntityEvents.death('cataclysm:wadjet', event => {
  if (!event.entity.tags.contains('kenma_heir')) return
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:corrupted_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, ASTRAL_PRIEST_SCROLL_SPELLS, 2, 3)
})
