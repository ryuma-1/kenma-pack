// priority: 0

// 動画の魔導書のレシピ。本と材料の登録は startup_scripts/spellbooks.js。2026-11-12、利用者と決定。
//
// 第四等級と退魔の魔導書は、作業台で一から作る（動画の作業台の画面）:
//   左の列に鉄インゴット・ネザライトインゴット・鉄インゴット、真ん中に魂（退魔の魔導書は始祖竜の涙）、残りは紙5枚。
// 第三〜第一等級は、1つ下の等級の魔導書に魂を足して上げる（動画の第三等級の画面は、本と中級魔術師の魂の2つだけ。
// 第二等級と第一等級は動画にないので、同じ形にした）。書き込んである呪文は、新しい本に引き継ぐ。

const KENMA_SPELLBOOK_CRAFTED = {
  fourth_grade_spell_book: 'kenma:novice_mage_soul',
  exorcism_spell_book: 'kenma:progenitor_dragon_tear',
}

// [上げた先の本, もとの本, 魂, 上げた先のスロットの数（startup_scripts/spellbooks.js と同じ）]
const KENMA_SPELLBOOK_UPGRADES = [
  ['third_grade_spell_book', 'fourth_grade_spell_book', 'kenma:intermediate_mage_soul', 8],
  ['second_grade_spell_book', 'third_grade_spell_book', 'kenma:advanced_mage_soul', 10],
  ['first_grade_spell_book', 'second_grade_spell_book', 'kenma:special_mage_soul', 12],
]

ServerEvents.recipes(event => {
  Object.keys(KENMA_SPELLBOOK_CRAFTED).forEach(book => {
    event.shaped(`kenma:${book}`, ['IPP', 'NSP', 'IPP'], {
      I: 'minecraft:iron_ingot',
      N: 'minecraft:netherite_ingot',
      S: KENMA_SPELLBOOK_CRAFTED[book],
      P: 'minecraft:paper',
    }).id(`kenma:${book}`)
  })

  KENMA_SPELLBOOK_UPGRADES.forEach(upgrade => {
    event.shapeless(`kenma:${upgrade[0]}`, [`kenma:${upgrade[1]}`, upgrade[2]])
      .modifyResult((grid, result) => kenmaCarryOverSpells(grid.find(`kenma:${upgrade[1]}`), result, upgrade[3]))
      .id(`kenma:${upgrade[0]}`)
  })
})

// もとの本の NBT（書き込んだ呪文 ISB_Spells など）を新しい本に写し、呪文の枠の数だけ新しい本に合わせる。
// 何度も呼ばれる関数なので var で書く（startup_scripts/boss_bar.js の注意を参照）。
function kenmaCarryOverSpells(oldBook, result, slots) {
  // hasTag / getTag は Rhino から呼べない（KubeJS の同名の関数とぶつかる）ので、KubeJS の nbt を使う。
  var tag
  if (oldBook == null || oldBook.isEmpty() || oldBook.nbt == null) return result
  tag = oldBook.nbt.copy()
  if (tag.contains('ISB_Spells')) tag.getCompound('ISB_Spells').putInt('maxSpells', slots)
  result.nbt = tag
  return result
}

// 魔導書の枠（Curios の spellbook）に入れられるようにする。
ServerEvents.tags('item', event => {
  ;['fourth_grade_spell_book', 'third_grade_spell_book', 'second_grade_spell_book', 'first_grade_spell_book', 'exorcism_spell_book']
    .forEach(book => event.add('curios:spellbook', `kenma:${book}`))
})
