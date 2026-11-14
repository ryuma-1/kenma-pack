// priority: 0

// 英雄の防具一式: Fantasy Armor の Hero セット（fantasy_armor:hero_*）を、教国騎士の防具にする（#25）。
// 名前は client_scripts/hero_armor.js で「教国騎士の〜」にする。
//
// レシピ（Ep.31 の動画）: 作業台で、聖鉄を普通の防具の形に並べ、空いた所にネザライトの防具を置く。
// 元のレシピ（鍛冶台で、ネザライトの防具＋月の結晶、テンプレートに鉄インゴット）は消す。
//
// 効果（Ep.31 の動画のツールチップ）は Attributizer で付ける:
//   config/openloader/data/kenma/data/kenma/attributizer/armor/hero.json
// 各部位に、聖の魔法の力 +5%、魔力の最大値 +10、防具強度 4、防御力（ヘルム 6、チェストプレート 14、
// レギンス 10、ブーツ 6）。ノックバック耐性はネザライトと同じなので変えない。

const HOLY_IRON = 'deepwaters:fopal'

// 部位: [形, ネザライトの防具]。H が聖鉄、A がネザライトの防具。
// ヘルムは動画の画面のとおり。ほかの部位も、普通の防具の形で空いている所のうち、上の方に置く。
const HERO_RECIPES = {
  helmet: [['HHH', 'HAH'], 'minecraft:netherite_helmet'],
  chestplate: [['HAH', 'HHH', 'HHH'], 'minecraft:netherite_chestplate'],
  leggings: [['HHH', 'HAH', 'H H'], 'minecraft:netherite_leggings'],
  boots: [['HAH', 'H H'], 'minecraft:netherite_boots'],
}

ServerEvents.recipes(event => {
  for (const [part, [pattern, netherite]] of Object.entries(HERO_RECIPES)) {
    event.remove({ id: `fantasy_armor:hero_${part}` })
    event.shaped(`fantasy_armor:hero_${part}`, pattern, { H: HOLY_IRON, A: netherite })
      .id(`kenma:hero_${part}`)
  }
})
