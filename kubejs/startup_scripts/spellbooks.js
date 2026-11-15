// priority: 0

// 動画の魔導書（第四〜第一等級と退魔の魔導書）と、その材料（魔術師の魂と始祖竜の涙）。2026-11-12、利用者と決定。
//   魂は、その等級のボスが落とす。涙はエンダードラゴン（始祖竜）が落とす。落とす処理は server_scripts/boss_souls.js。
//   レシピは server_scripts/spellbooks.js、名前は client_scripts/spellbooks.js、
//   テクスチャは tools/textures/spellbooks.py で描く。
//
// 本は Iron's Spells の SimpleAttributeSpellBook をそのまま使う。irons_spells_js の spellbook の型は、
// どの本も等級がレジェンダリーの「固有の本」（UniqueSpellBook）になってしまうため使わない。
// createCustom で作るので、アイテムのモデル（assets/kenma/models/item/）は自分で置く。

const SpellbooksSimpleAttributeSpellBook = Java.loadClass('io.redspace.ironsspellbooks.item.spell_books.SimpleAttributeSpellBook')
const SpellbooksSpellRarity = Java.loadClass('io.redspace.ironsspellbooks.api.spells.SpellRarity')
const SpellbooksAttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
const SpellbooksOperation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')
const SpellbooksMultimap = Java.loadClass('com.google.common.collect.LinkedHashMultimap')
const SpellbooksForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
const SpellbooksResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

// 作品の系統の「魔法の力」。Iron's Spells の系統の力と同じ作り（もとの値 1、0〜10）。
//   淀み: 淀みの系統（startup_scripts/stagnation_magic.js）の威力に使う。
//   退魔の法は、Iron's Spells のエンダー系の表示名を変えたもの（startup_scripts/exorcism.js）なので、
//   力はエンダーの呪文の力（irons_spellbooks:ender_spell_power）を使う。自作の退魔の法の力は外した（2026-11-14、利用者と決定）。
const KENMA_SPELL_POWERS = ['kenma:stagnation_spell_power']

StartupEvents.registry('attribute', event => {
  KENMA_SPELL_POWERS.forEach(id => {
    event.create(id, 'irons_spells_js:spell').setDefaultValue(1.0).setMinimumValue(0.0).setMaximumValue(10.0)
  })
})

// 作った能力を、すべての生き物に付ける。Iron's Spells は自分の能力しか付けないので、ここで付ける。
// 付いていない生き物が淀みの呪文を唱えると、威力を読むところでエラーになる。
EntityJSEvents.attributes(event => {
  event.getAllTypes().forEach(type => {
    event.modify(type, helper => {
      KENMA_SPELL_POWERS.forEach(id => helper.add(id, 1.0))
    })
  })
})

// 魂（第四〜第一等級のボスが落とす）と、始祖竜の涙。落とす処理は server_scripts/boss_souls.js。
const KENMA_SOULS = ['novice_mage_soul', 'intermediate_mage_soul', 'advanced_mage_soul', 'special_mage_soul', 'progenitor_dragon_tear']

// 魔導書。数値は動画のツールチップのとおり。割合の能力は Iron's Spells の本と同じく MULTIPLY_BASE。
const KENMA_SPELLBOOKS = [
  { id: 'fourth_grade_spell_book', slots: 6, attributes: [] },
  {
    id: 'third_grade_spell_book', slots: 8, attributes: [
      ['kenma:stagnation_spell_power', 0.2, 'MULTIPLY_BASE'],
      ['irons_spellbooks:nature_spell_power', 0.2, 'MULTIPLY_BASE'], // 大地
      ['irons_spellbooks:holy_spell_power', 0.2, 'MULTIPLY_BASE'],
      ['irons_spellbooks:max_mana', 100, 'ADDITION'],
    ],
  },
  {
    id: 'second_grade_spell_book', slots: 10, attributes: [
      ['irons_spellbooks:max_mana', 200, 'ADDITION'],
      ['cataclysm_spellbooks:abyssal_spell_power', 0.2, 'MULTIPLY_BASE'], // 深海
      ['irons_spellbooks:fire_spell_power', 0.2, 'MULTIPLY_BASE'],
      ['irons_spellbooks:evocation_spell_power', 0.2, 'MULTIPLY_BASE'], // 召喚
    ],
  },
  {
    id: 'first_grade_spell_book', slots: 12, attributes: [
      ['irons_spellbooks:max_mana', 400, 'ADDITION'],
      ['irons_spellbooks:mana_regen', 0.2, 'MULTIPLY_BASE'],
      ['irons_spellbooks:spell_power', 0.2, 'MULTIPLY_BASE'],
    ],
  },
  {
    id: 'exorcism_spell_book', slots: 15, attributes: [
      ['irons_spellbooks:ender_spell_power', 0.5, 'MULTIPLY_BASE'], // 退魔の法
      ['irons_spellbooks:max_mana', 800, 'ADDITION'],
      ['irons_spellbooks:spell_power', 0.2, 'MULTIPLY_BASE'],
      ['irons_spellbooks:mana_regen', 2.0, 'MULTIPLY_BASE'],
    ],
  },
]

// 本を作る関数。アイテムの登録のときに呼ばれる（能力はそれより前に登録されている）。
function createKenmaSpellbook(book) {
  const modifiers = SpellbooksMultimap.create()
  book.attributes.forEach(a => {
    const attribute = SpellbooksForgeRegistries.ATTRIBUTES.getValue(new SpellbooksResourceLocation(a[0]))
    if (attribute == null) throw new Error(`魔導書 ${book.id}: 能力 ${a[0]} が見つからない`)
    modifiers.put(attribute, new SpellbooksAttributeModifier(`kenma ${book.id} ${a[0]}`, a[1], SpellbooksOperation[a[2]]))
  })
  // 等級（SpellRarity）は Iron's Spells が中でレジェンダリーに固定するので、何を渡しても同じ。
  // 名前の色は Iron's Spells のほかの本と同じ黄色（動画も黄色）。
  return new SpellbooksSimpleAttributeSpellBook(book.slots, SpellbooksSpellRarity.LEGENDARY, modifiers)
}

StartupEvents.registry('item', event => {
  KENMA_SOULS.forEach(id => event.create(`kenma:${id}`))
  KENMA_SPELLBOOKS.forEach(book => {
    event.createCustom(`kenma:${book.id}`, () => createKenmaSpellbook(book))
  })
})
