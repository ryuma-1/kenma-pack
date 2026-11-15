// priority: 0

// 動画の魔導書と、その材料の名前（startup_scripts/spellbooks.js）。
// 作中の名前は動画のツールチップと利用者のメモから。英語名は仮。

// ID: [日本語, 英語]
const KENMA_SPELLBOOK_NAMES = {
  novice_mage_soul: ['初級魔術師の魂', 'Novice Mage Soul'],
  intermediate_mage_soul: ['中級魔術師の魂', 'Intermediate Mage Soul'],
  advanced_mage_soul: ['上級魔術師の魂', 'Advanced Mage Soul'],
  special_mage_soul: ['特級魔術師の魂', 'Special Grade Mage Soul'],
  progenitor_dragon_tear: ['始祖竜の涙', 'Progenitor Dragon Tear'],
  fourth_grade_spell_book: ['第四等級の魔導書', 'Fourth Grade Spell Book'],
  third_grade_spell_book: ['第三等級の魔導書', 'Third Grade Spell Book'],
  second_grade_spell_book: ['第二等級の魔導書', 'Second Grade Spell Book'],
  first_grade_spell_book: ['第一等級の魔導書', 'First Grade Spell Book'],
  exorcism_spell_book: ['退魔の魔導書', 'Exorcism Spell Book'],
}

// 能力の名前。Iron's Spells の日本語（「聖の呪文の力」など）に合わせる。退魔の法の力は client_scripts/exorcism.js。
const KENMA_ATTRIBUTE_NAMES = {
  stagnation_spell_power: ['淀みの呪文の力', 'Stagnation Spell Power'],
}

ClientEvents.lang('ja_jp', event => {
  Object.keys(KENMA_SPELLBOOK_NAMES).forEach(id => event.add('kenma', `item.kenma.${id}`, KENMA_SPELLBOOK_NAMES[id][0]))
  Object.keys(KENMA_ATTRIBUTE_NAMES).forEach(id => event.add('kenma', `attribute.kenma.${id}`, KENMA_ATTRIBUTE_NAMES[id][0]))
})

ClientEvents.lang('en_us', event => {
  Object.keys(KENMA_SPELLBOOK_NAMES).forEach(id => event.add('kenma', `item.kenma.${id}`, KENMA_SPELLBOOK_NAMES[id][1]))
  Object.keys(KENMA_ATTRIBUTE_NAMES).forEach(id => event.add('kenma', `attribute.kenma.${id}`, KENMA_ATTRIBUTE_NAMES[id][1]))
})
