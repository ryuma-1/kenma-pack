// priority: 0

// 帝国騎士・王国騎士・剣魔の防具の材料（#43）。
// 作中ではどれもボスを倒したときの報酬。ボスが決まる（#6）までは手に入らない（コマンドでは出せる）。
// 名前は client_scripts/armor_sets.js、テクスチャは kubejs/assets/kenma/textures/item/（tools/textures/armor_materials.py で描く）。

const ARMOR_MATERIALS = [
  'black_iron', // 黒鉄（帝国・剣魔）
  'demihuman_hide', // 亜人の皮（帝国）
  'fishfolk_scale', // 魚人の鱗（帝国）
  'dragon_scale', // 竜の鱗（王国）
  'ancient_dragon_scale', // 古竜の鱗（王国・剣魔）
  'beastfolk_fur', // 獣人の毛皮（王国）
  'dragon_steel', // 竜鉄（剣魔）
]

StartupEvents.registry('item', event => {
  for (const id of ARMOR_MATERIALS) event.create(`kenma:${id}`)
})
