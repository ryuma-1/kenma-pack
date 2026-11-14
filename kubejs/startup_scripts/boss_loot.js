// priority: 10

// 継承者のボスが倒されたときに、呪文の巻物を落とす共通の部品（#7、#53）。
// 候補の呪文から、ランダムに何枚か（同じものは出ない）を落とす。重ならないように選ぶのは
// ルートテーブルではできないので、ここで作る。封印石はルートテーブル（kubejs/data/kenma/loot_tables/entities/）で落とす。
// 使い方（server_scripts）:
//   EntityEvents.death('kenma:<ボス>', event => global.kenmaBossLoot.dropScrolls(event.entity, 候補, 2, 3))
//   候補は [呪文の ID, レベル] の配列。

global.kenmaBossLoot = {
  // min〜max 枚（どちらも含む）を落とす。何度も呼ばれる関数なので var で書く（boss_bar.js の注意を参照）。
  dropScrolls(entity, spells, min, max) {
    var list = spells.slice(), count = min + Math.floor(Math.random() * (max - min + 1)), i, j, tmp
    for (i = list.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      tmp = list[i]; list[i] = list[j]; list[j] = tmp
    }
    for (i = 0; i < count && i < list.length; i++) {
      // バニラの spawnAtLocation は、どの版を呼ぶか Rhino が決められないので、KubeJS の popItem を使う。
      entity.block.popItem(Item.of('irons_spellbooks:scroll',
        `{ISB_Spells:{data:[{id:"${list[i][0]}",index:0,level:${list[i][1]},locked:1b}],maxSpells:1,mustEquip:0b,spellWheel:0b}}`))
    }
  },
}
