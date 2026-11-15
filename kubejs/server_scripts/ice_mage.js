// priority: 0

// 氷の魔術師（#58）。ボスは Iron's Spells の氷魔術師（irons_spellbooks:cryomancer）を使う
// （2026-11-12、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。
// 戦い方は Iron's Spells のまま。体力と攻撃の倍率は等級で決める（grades.js）。名前は client_scripts/ice_mage.js、ボスバーは server_scripts/boss_bar.js、
// 魂は server_scripts/boss_souls.js。
// 拠点はバニラのイグルー（Remastered Structure の雪と青い氷の城。2026-11-13、利用者がゲームの中で選んだ）。
// そこで呼び出した1体だけが氷の魔術師で、名前（entity.kenma.ice_mage）と目印のタグ kenma_heir が付く（server_scripts/structure_bases.js）。
// はじめの拠点だった Mountain Tower の3体の氷魔術師は、星降りの聖職者の拠点になったので、名前も報酬ももとのまま（ただの敵）。
//
// 作中の氷の魔法（Pixiv 百科事典）は10。呪文との対応（2026-11-12、利用者と決定）:
//   アイスレイン = peyroscythe:icy_comet_rain、ブリザードブレス = irons_spellbooks:cone_of_cold、
//   フロストウェーブ = irons_spellbooks:frostwave、フロストブレイク = peyroscythe:frost_hell（武器で叩く氷の衝撃波）、
//   フロストレイ = irons_spellbooks:ray_of_frost、アイスブロック = irons_spellbooks:ice_block、
//   フロストステップ = irons_spellbooks:frost_step、アイシクル = irons_spellbooks:icicle、
//   グレイシアフォール = peyroscythe:glacier、クライオピアサー = cataclysm_spellbooks:cryopiercer
// どれも既存の呪文なので、自作の呪文はない。

// 倒されたら、氷の封印石（endrem:cold_eye）1個と、次の12から、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
//   作中の氷の魔法10と、作中にはないが氷らしい既存の呪文2つ（2026-11-12、利用者と決定）。
//   マレディクタスの技（Phantasmal Blade など）は、帝国近衛騎士（マレディクタス）の候補にするので入れない。
//   PeyroScythe の The Frozen World と Ice Tomb は入れない。Iron's Spells 3.4.0.4 にない音やアニメーション
//   （SoundRegistry.ICE_SPIKE_EMERGE、SpellAnimations.SELF_CAST_TWO_HANDS）を使っていて、
//   The Frozen World を唱えるとサーバーが落ちた（2026-11-12、NoSuchFieldError）。
// レベルはルーンで上げる想定（#51）。
const ICE_MAGE_SCROLL_SPELLS = [
  ['peyroscythe:icy_comet_rain', 1], ['irons_spellbooks:cone_of_cold', 1], ['irons_spellbooks:frostwave', 1],
  ['peyroscythe:frost_hell', 1], ['irons_spellbooks:ray_of_frost', 1], ['irons_spellbooks:ice_block', 1],
  ['irons_spellbooks:frost_step', 1], ['irons_spellbooks:icicle', 1], ['peyroscythe:glacier', 1],
  ['cataclysm_spellbooks:cryopiercer', 1],
  // 作中にはない、氷らしい呪文
  ['irons_spellbooks:summon_polar_bear', 1], ['cataclysm_spellbooks:conjure_thralls', 1],
]

EntityEvents.death('irons_spellbooks:cryomancer', event => {
  if (!event.entity.tags.contains('kenma_heir')) return
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:cold_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, ICE_MAGE_SCROLL_SPELLS, 2, 3)
})
