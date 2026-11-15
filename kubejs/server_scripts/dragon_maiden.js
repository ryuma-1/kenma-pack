// priority: 0

// 半竜の乙女（#55）。ボスは Cataclysm のイグニス（cataclysm:ignis）を使う
// （2026-11-12、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。
// 戦い方、ボスバーは Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。名前は client_scripts/dragon_maiden.js、魂は server_scripts/boss_souls.js。
//
// 作中の炎の魔法（Pixiv 百科事典）は6つ。呪文との対応（2026-11-12、利用者と決定）:
//   バーニングダッシュ = irons_spellbooks:burning_dash、ファイアエンブレイス = peyroscythe:sinfire_embrace、
//   ファイアブレス = irons_spellbooks:fire_breath、ブレイズストーム = irons_spellbooks:blaze_storm、
//   マグマボム = irons_spellbooks:magma_bomb、ヘルブレード = cataclysm_spellbooks:hellish_blade

// 倒されたら、炎の封印石（endrem:cursed_eye）1個と、次の17から、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
//   作中の炎の魔法6つと、作中にはないが炎らしい既存の呪文11（2026-11-12、利用者と決定）。
//   ほかの継承者に回すもの（Infernal Strike など Cataclysm の炎の大ボスの技に近いものは煉獄、
//   深淵の火の玉は深海、燃える骨は墓守か煉獄、呼び出し系は召喚）は入れない。
// レベルはルーンで上げる想定（#51）。
const DRAGON_MAIDEN_SCROLL_SPELLS = [
  ['irons_spellbooks:burning_dash', 1], ['peyroscythe:sinfire_embrace', 1], ['irons_spellbooks:fire_breath', 1],
  ['irons_spellbooks:blaze_storm', 1], ['irons_spellbooks:magma_bomb', 1], ['cataclysm_spellbooks:hellish_blade', 1],
  // 作中にはない、炎らしい呪文
  ['irons_spellbooks:firebolt', 1], ['irons_spellbooks:fireball', 1], ['irons_spellbooks:scorch', 1],
  ['irons_spellbooks:heat_surge', 1], ['irons_spellbooks:wall_of_fire', 1], ['irons_spellbooks:flaming_strike', 1],
  ['irons_spellbooks:flaming_barrage', 1], ['cataclysm_spellbooks:tectonic_tremble', 1],
  ['cataclysm_spellbooks:comet_shower', 1], ['cataclysm_spellbooks:meteor_spew', 1],
  ['cataclysm_spellbooks:incineration', 1],
]

EntityEvents.death('cataclysm:ignis', event => {
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:cursed_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, DRAGON_MAIDEN_SCROLL_SPELLS, 2, 3)
})
