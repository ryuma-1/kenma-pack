// priority: 0

// 淀みの剣士（#53）。ボスは Cataclysm のアプトルガングル（cataclysm:aptrgangr）を使う
// （2026-11-12、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。
// 戦い方は Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。ボスバーは server_scripts/boss_bar.js、魂は server_scripts/boss_souls.js。
// 拠点はジャングルのピラミッド（server_scripts/structure_bases.js）。そこで呼び出したアプトルガングルだけが淀みの剣士で、
// 名前（entity.kenma.stagnation_swordsman）と目印のタグ kenma_heir が付く。
// Cataclysm の Frosted Prison にもとからいるアプトルガングルは、名前も報酬ももとのまま（1つの拠点にだけ出す。2026-11-13、利用者と決定）。

// 倒されたら、淀みの封印石（endrem:rogue_eye）1個と、次の10から、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
//   淀みの魔法8つと、作中にはないが淀みらしい既存の呪文2つ（PeyroScythe の Death Smoke と Cradle of The Chaos。
//   死の煙で侵す、淀んだ沼を広げる。2026-11-12、利用者と決定）。
// レベルはルーンで上げる想定（#51）。
const STAGNATION_SWORDSMAN_SCROLL_SPELLS = [
  ['irons_spellbooks:acid_orb', 1], ['kenma:cursed_scatter', 1], ['kenma:cursed_chain', 1], ['kenma:cursed_lung', 1],
  ['kenma:cursed_eye', 1], ['kenma:cursed_orb', 1], ['kenma:cursed_heart', 1], ['kenma:chain_curse', 1],
  // 作中にはない、淀みらしい呪文
  ['peyroscythe:death_smoke', 1], ['peyroscythe:chaos_cradle', 1],
]

EntityEvents.death('cataclysm:aptrgangr', event => {
  if (!event.entity.tags.contains('kenma_heir')) return
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:rogue_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, STAGNATION_SWORDSMAN_SCROLL_SPELLS, 2, 3)
})
