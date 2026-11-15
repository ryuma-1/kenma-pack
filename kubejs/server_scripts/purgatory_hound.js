// priority: 0

// 煉獄の猟犬（#60）。ボスは Cataclysm のネザライトの怪物（cataclysm:netherite_monstrosity）を使う
// （2026-11-13、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。
// 作中の煉獄の猟犬は、淀みと瘴気で変異した煉獄の魔術師の元飼い犬（元のモブは有料の Cerberus）。
// パックに猟犬の見た目のボスがいないので、「煉獄」に合うネザーの溶岩の怪物を使う。見た目は犬ではない。
// 戦い方は Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。
// 名前は client_scripts/purgatory_hound.js、魂は server_scripts/boss_souls.js、ボスバーは Cataclysm のもの。
// 拠点は Cataclysm の Soul Black Smith（ネザーの魂の鍛冶場。ネザライトの怪物がもとからいて、ほかの場所にはいない）。
//
// 作中の煉獄の魔法は失伝していて、呪文がない。巻物は落とさない。
// 作中のほかの報酬（猟犬の呪い、猟犬の腕輪、耐炎の指輪、炎のオーブ）は、パックに当たるアイテムがないので付けない。

// 倒されたら、煉獄の封印石（endrem:nether_eye）1個を落とす。
EntityEvents.death('cataclysm:netherite_monstrosity', event => {
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:nether_eye'))
})
