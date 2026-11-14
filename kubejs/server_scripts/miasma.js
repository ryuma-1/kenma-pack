// priority: 0

// 瘴気耐性（#53）。作中の瘴気は、パックの Thin Air の薄い空気（地下と上空）のこと。
// 作中の設定: 先の戦争で死んだ人々の怨念の塊。低所と高所に漂い、耐性がなければ数秒で死ぬ。魂の松明やランタンでも防げる。
// Thin Air には状態効果で守る仕組みがないので、瘴気耐性（kenma:miasma_resistance）が付いている間は、
// 水の外にいれば息のゲージを満タンに保つ。水の中では、ふつうどおり息が減る。
// 効果はカースドラング（startup_scripts/stagnation_magic.js）で付く。

PlayerEvents.tick(event => {
  var player = event.player
  if (!player.hasEffect('kenma:miasma_resistance')) return
  if (player.isUnderWater()) return
  if (player.getAirSupply() < player.getMaxAirSupply()) player.setAirSupply(player.getMaxAirSupply())
})
