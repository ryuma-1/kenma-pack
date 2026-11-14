// priority: 0

// 帝国騎士・王国騎士・剣魔の防具と、その材料の名前（#43）。日本語名は Ep.38〜51 の動画のとおり。英語名は仮。
// 防具は Fantasy Armor のセットを改変する: 帝国騎士 = golden_horns、王国騎士 = dragonslayer、剣魔 = eclipse_soldier。
// レシピは server_scripts/armor_sets.js、【加護】の処理は startup_scripts/blessing.js にある。

const ARMOR_SET_NAMES = {
  golden_horns: ['帝国騎士の', 'Imperial Knight '],
  dragonslayer: ['王国騎士の', 'Royal Knight '],
  eclipse_soldier: ['剣魔の', 'Kenma '],
}

const ARMOR_PART_NAMES = {
  helmet: ['ヘルム', 'Helm'],
  chestplate: ['チェストプレート', 'Chestplate'],
  leggings: ['レギンス', 'Leggings'],
  boots: ['ブーツ', 'Boots'],
}

const MATERIAL_NAMES = {
  black_iron: ['黒鉄', 'Black Iron'],
  demihuman_hide: ['亜人の皮', 'Demihuman Hide'],
  fishfolk_scale: ['魚人の鱗', 'Fishfolk Scale'],
  dragon_scale: ['竜の鱗', 'Dragon Scale'],
  ancient_dragon_scale: ['古竜の鱗', 'Ancient Dragon Scale'],
  beastfolk_fur: ['獣人の毛皮', 'Beastfolk Fur'],
  dragon_steel: ['竜鉄', 'Dragon Steel'],
}

// 部位ごとの【加護】の割合。startup_scripts/blessing.js と同じ値にする。
const BLESSING_TOOLTIPS = {
  dragonslayer: '+15%',
  eclipse_soldier: '+20%',
}

// KubeJS の JavaScript（Rhino）では繰り返しの中の const が1回しか作られず、
// 中で作った関数も最後の値を見てしまうので、forEach で書く。
function addNames(event, lang) {
  Object.keys(ARMOR_SET_NAMES).forEach(set => {
    Object.keys(ARMOR_PART_NAMES).forEach(part => {
      event.add('fantasy_armor', `item.fantasy_armor.${set}_${part}`, ARMOR_SET_NAMES[set][lang] + ARMOR_PART_NAMES[part][lang])
    })
  })
  Object.keys(MATERIAL_NAMES).forEach(id => event.add('kenma', `item.kenma.${id}`, MATERIAL_NAMES[id][lang]))
}

ClientEvents.lang('ja_jp', event => {
  addNames(event, 0)
  event.add('kenma', 'kenma.tooltip.blessing', '装備中 %s の【加護】状態を付与')
})

ClientEvents.lang('en_us', event => {
  addNames(event, 1)
  event.add('kenma', 'kenma.tooltip.blessing', 'While worn: %s Blessing')
})

// 名前のすぐ下（動画と同じ位置）に【加護】の行を出す。
ItemEvents.tooltip(event => {
  Object.keys(BLESSING_TOOLTIPS).forEach(set => {
    const value = BLESSING_TOOLTIPS[set]
    Object.keys(ARMOR_PART_NAMES).forEach(part => {
      event.addAdvanced(`fantasy_armor:${set}_${part}`, (item, advanced, text) => {
        text.add(1, Text.translate('kenma.tooltip.blessing', Text.blue(value)))
      })
    })
  })
})
