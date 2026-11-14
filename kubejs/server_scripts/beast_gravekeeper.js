// priority: 0

// 獣人の墓守（#59）。ボスは Keepers of the Stones II の Energium Golem（power:energium_golem）を使う
// （2026-11-13、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。
// 作中の獣人の墓守は「シンプルに殴るだけ」で「とてつもなく硬い」。Energium Golem は体力500・防具値16で、これに合う。
// 見た目はゴーレムで獣人ではない（獣人の見た目の Just in Nether の Bullkindar も考えたが、ネザーに自然にわくので使わない）。
// 強さと戦い方は Keepers of the Stones II のまま（強さは #4 でまとめて調整する）。
// 名前は client_scripts/beast_gravekeeper.js、魂は server_scripts/boss_souls.js、ボスバーは Keepers of the Stones II のもの。
// 拠点は Keepers of the Stones II の Energium Temple（Energium Golem がもとからいる神殿。砂漠と荒野）。
//
// 作中の結晶の魔法は、呪文ではなく「結晶」というアイテム（使うと2分間、魔装と魔剣が付き、魔法を2つ使える）。
// 結晶は server_scripts/crystal.js（#78）。巻物は落とさない。

// 倒されたら、結晶の封印石（endrem:lost_eye）1個と、獣人の毛皮（kenma:beastfolk_fur。王国騎士の防具の素材）6枚と、
// 結晶1個（9種類からランダム。2026-11-14、利用者と決定）を落とす。
// 毛皮の6枚は、王国騎士の防具1そろい（兜・胸当て・すね当てに2枚ずつ）の分。数は仮。
EntityEvents.death('power:energium_golem', event => {
  // 封印石と毛皮は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:lost_eye'))
  event.entity.block.popItem(Item.of('kenma:beastfolk_fur', 6))
  const crystals = global.kenmaCrystals
  event.entity.block.popItem(Item.of(crystals[Math.floor(Math.random() * crystals.length)][0]))
})
