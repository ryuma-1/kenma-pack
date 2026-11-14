// priority: 0

// ルーンで巻物の呪文のレベルを上げる（#51。2026-11-14、利用者と決定）。
//   作業台で「巻物1枚」と「その呪文の系統のルーン」を合わせると、呪文のレベルが1つ上がる。
//   使うルーンは、上げた後のレベルと同じ数（レベル2にするのに2個、3にするのに3個…）。
//   作業台は9マスで、最大レベルが10の呪文もあるので、ルーンは1つのマスに重ねて置き、必要な数だけ減らす。
//   上限はその呪文の最大レベル（Iron's Spells の設定 MaxLevel）。
//   Iron's Spells のもとの上げ方（魔法の金床で巻物＋インク）も、そのまま使える。
//
// 系統とルーンの対応。淀みと異界のルーンは自作（startup_scripts/runes.js）。
// Iron's Spells の void の系統には呪文がないので入れない。
const KENMA_SCHOOL_RUNES = {
  'irons_spellbooks:fire': 'irons_spellbooks:fire_rune',
  'irons_spellbooks:ice': 'irons_spellbooks:ice_rune',
  'irons_spellbooks:lightning': 'irons_spellbooks:lightning_rune',
  'irons_spellbooks:holy': 'irons_spellbooks:holy_rune',
  'irons_spellbooks:ender': 'irons_spellbooks:ender_rune',
  'irons_spellbooks:blood': 'irons_spellbooks:blood_rune',
  'irons_spellbooks:evocation': 'irons_spellbooks:evocation_rune',
  'irons_spellbooks:nature': 'irons_spellbooks:nature_rune',
  'irons_spellbooks:eldritch': 'kenma:eldritch_rune',
  'cataclysm_spellbooks:abyssal': 'cataclysm_spellbooks:abyssal_rune',
  'cataclysm_spellbooks:technomancy': 'cataclysm_spellbooks:technomancy_rune',
  'kenma:stagnation': 'kenma:stagnation_rune',
}

const KenmaRuneSpellRegistry = Java.loadClass('io.redspace.ironsspellbooks.api.registry.SpellRegistry')

// 何度も呼ばれる関数なので var で書く（boss_bar.js の注意を参照）。
global.kenmaRuneUpgrade = {
  // 巻物の呪文を読む。読めなければ null。{ spell, level, school, maxLevel }
  readScroll(stack) {
    var nbt, data, entry, spell
    if (stack == null || stack.isEmpty() || String(stack.id) !== 'irons_spellbooks:scroll') return null
    nbt = stack.nbt
    if (nbt == null || !nbt.contains('ISB_Spells')) return null
    data = nbt.getCompound('ISB_Spells').getList('data', 10)
    if (data.size() < 1) return null
    entry = data.getCompound(0)
    // getSpell は文字列版と ResourceLocation 版があり、KubeJS はどちらの型にも変換できるので、Rhino がどちらを呼ぶか決められない。
    // Iron's Spells のクラス（名前の難読化がない）なので、型を書いて文字列版を呼ぶ。
    spell = KenmaRuneSpellRegistry['getSpell(java.lang.String)'](String(entry.getString('id')))
    if (spell == null || String(spell.getSpellId()) === 'irons_spellbooks:none') return null
    return { level: entry.getInt('level'), school: String(spell.getSchoolType().getId()), maxLevel: spell.getMaxLevel() }
  },

  // 作業台の中の巻物を探す。
  findScroll(inventory) {
    var i, stack
    for (i = 0; i < inventory.getContainerSize(); i++) {
      stack = inventory.getItem(i)
      if (!stack.isEmpty() && String(stack.id) === 'irons_spellbooks:scroll') return stack
    }
    return null
  },

  // 出来上がる巻物。上げられなければ空（作業台に何も出ない）。
  result(grid, rune, school) {
    var scroll = grid.find('irons_spellbooks:scroll'), runes = grid.find(rune), info, target, out
    info = this.readScroll(scroll)
    if (info == null || info.school !== school) return Item.empty
    target = info.level + 1
    if (target > info.maxLevel || runes.isEmpty() || runes.count < target) return Item.empty
    out = scroll.copy()
    out.count = 1
    out.nbt.getCompound('ISB_Spells').getList('data', 10).getCompound(0).putInt('level', target)
    return out
  },

  // ルーンのマスを減らす。作業台は、このあとでどのマスも1個ずつ減らすので、ここでは「必要な数 − 1」だけ減らしておく。
  consumeRunes(stack, index, inventory) {
    var info = this.readScroll(this.findScroll(inventory)), need, rest
    if (info == null) return Item.empty
    need = info.level + 1
    rest = stack.copy()
    rest.count = Math.max(1, stack.count - need + 1)
    inventory.setItem(index, rest)
    return Item.empty
  },
}

Ingredient.registerCustomIngredientAction('kenma_rune_upgrade', (stack, index, inventory) =>
  global.kenmaRuneUpgrade.consumeRunes(stack, index, inventory))

ServerEvents.recipes(event => {
  // 自作のルーン。Iron's Spells のルーンと同じく、空のルーン1個をその系統の触媒8個で囲む。
  //   淀みの触媒（kenma:stagnation_focus）は発酵したクモの目（kubejs/data/kenma/tags/items/）。
  event.shaped('kenma:stagnation_rune', ['FFF', 'FRF', 'FFF'], {
    F: '#kenma:stagnation_focus', R: 'irons_spellbooks:blank_rune',
  }).id('kenma:stagnation_rune')
  event.shaped('kenma:eldritch_rune', ['FFF', 'FRF', 'FFF'], {
    F: '#irons_spellbooks:eldritch_focus', R: 'irons_spellbooks:blank_rune',
  }).id('kenma:eldritch_rune')

  // 巻物＋ルーンで、呪文のレベルを上げる。系統ごとに1つのレシピ。
  Object.keys(KENMA_SCHOOL_RUNES).forEach(school => {
    const rune = KENMA_SCHOOL_RUNES[school]
    event.shapeless('irons_spellbooks:scroll', ['irons_spellbooks:scroll', rune])
      .modifyResult((grid, result) => global.kenmaRuneUpgrade.result(grid, rune, school))
      .customIngredientAction(rune, 'kenma_rune_upgrade')
      .id(`kenma:rune_upgrade/${school.replace(':', '/')}`)
  })
})
