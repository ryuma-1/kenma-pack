// priority: 0

// 帝国騎士・王国騎士・剣魔の防具（#43）のレシピ。Ep.38〜51 の動画の画面のとおり。
// 防具は Fantasy Armor のセットを改変する: 帝国騎士 = golden_horns、王国騎士 = dragonslayer、剣魔 = eclipse_soldier。
// 一つ前の系統の同じ部位（帝国は教国騎士 = hero）を、材料で囲んで作る。元の鍛冶台のレシピは消す。
// 剣魔のブーツのレシピだけは動画に映っていないので、ほかの系統のヘルムとブーツの決まりから推測した（#43）。
//
// 名前と【加護】の表示は client_scripts/armor_sets.js、【加護】の処理は startup_scripts/blessing.js、
// 効果は config/openloader/data/kenma/data/kenma/attributizer/armor/armor_sets.json。

// 記号: A = 一つ前の系統の同じ部位
const ARMOR_SET_RECIPES = [
  {
    set: 'golden_horns', // 帝国騎士
    from: 'hero',
    keys: { K: 'kenma:black_iron', S: 'kenma:fishfolk_scale', H: 'kenma:demihuman_hide' },
    patterns: {
      helmet: ['KSK', 'HAH'],
      chestplate: ['HAH', 'KSK', 'KKK'],
      leggings: ['KSK', 'KAK', 'H H'],
      boots: ['S S', 'KAK'],
    },
  },
  {
    set: 'dragonslayer', // 王国騎士
    from: 'golden_horns',
    keys: { D: 'kenma:dragon_scale', O: 'kenma:ancient_dragon_scale', F: 'kenma:beastfolk_fur' },
    patterns: {
      helmet: ['DOD', 'FAF'],
      chestplate: ['FAF', 'DOD', 'DDD'],
      leggings: ['DOD', 'DAD', 'F F'],
      boots: ['O O', 'DAD'],
    },
  },
  {
    set: 'eclipse_soldier', // 剣魔
    from: 'dragonslayer',
    keys: { O: 'kenma:ancient_dragon_scale', K: 'kenma:black_iron', T: 'kenma:dragon_steel' },
    patterns: {
      helmet: ['OKO', 'TAT'],
      chestplate: ['TAT', 'OKO', 'OOO'],
      leggings: ['OKO', 'OAO', 'T T'],
      boots: ['K K', 'OAO'], // 推測
    },
  },
]

// レシピの記号の表を毎回新しく作る。
// KubeJS の JavaScript（Rhino）では、繰り返しの中の const が1回しか作られず、同じ表が使い回されるため。
// 形に出てこない記号を表に入れると、そのレシピは読み込みに失敗するので、使う記号だけを入れる。
function recipeKeys(recipe, part) {
  const used = recipe.patterns[part].join('')
  const result = { A: `fantasy_armor:${recipe.from}_${part}` }
  Object.keys(recipe.keys).filter(k => used.indexOf(k) >= 0).forEach(k => { result[k] = recipe.keys[k] })
  return result
}

function addArmorSetRecipe(event, recipe, part) {
  const output = `fantasy_armor:${recipe.set}_${part}`
  event.remove({ id: output })
  event.shaped(output, recipe.patterns[part], recipeKeys(recipe, part)).id(`kenma:${recipe.set}_${part}`)
}

ServerEvents.recipes(event => {
  ARMOR_SET_RECIPES.forEach(recipe => {
    Object.keys(recipe.patterns).forEach(part => addArmorSetRecipe(event, recipe, part))
  })
})
