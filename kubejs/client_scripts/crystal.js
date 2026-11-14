// priority: 0

// 結晶の魔法（#78）の名前。Keepers of the Stones II の属性の石を「〜の結晶」、その効果を「〜の結晶」、
// 防具を「〜の魔装」、武器を「〜の魔剣」にする。作中に結晶ごとの名前はないので、どれも仮。英語名も仮。
// 仕組みは server_scripts/crystal.js。

// 属性: [石の日本語名の頭, 英語名の頭, 魔剣のアイテム]
const CRYSTAL_NAMES = {
  fire: ['炎', 'Fire', 'fire_sword'],
  ice: ['氷', 'Ice', 'ice_spear'],
  earth: ['大地', 'Earth', 'earth_hammer'],
  water: ['深海', 'Abyssal', 'water_katana'],
  lightning: ['竜狩り', 'Dragon Slayer', 'lightning_falchion'],
  blood: ['殺人', 'Slaughter', 'blood_sickle'],
  light: ['聖', 'Holy', 'light_sword'],
  sand: ['砂塵', 'Sand', 'sand_saber'],
  crystal: ['結晶', 'Crystal', 'crystal_knife'],
}

const CRYSTAL_ARMOR_PARTS = {
  helmet: ['ヘルム', 'Helm'],
  chestplate: ['チェストプレート', 'Chestplate'],
  leggings: ['レギンス', 'Leggings'],
  boots: ['ブーツ', 'Boots'],
}

// KubeJS の JavaScript（Rhino）では繰り返しの中の const が1回しか作られないので、forEach で書く。
function addCrystalNames(event, lang) {
  Object.keys(CRYSTAL_NAMES).forEach(element => {
    const names = CRYSTAL_NAMES[element]
    const ja = lang == 'ja_jp'
    const head = ja ? names[0] : names[1]
    event.add('power', `item.power.${element}_stone`, ja ? `${head}の結晶` : `${head} Crystal`)
    event.add('power', `effect.power.${element}_master`, ja ? `${head}の結晶` : `${head} Crystal`)
    event.add('power', `item.power.${names[2]}`, ja ? `${head}の魔剣` : `${head} Magic Sword`)
    Object.keys(CRYSTAL_ARMOR_PARTS).forEach(part => {
      const partName = CRYSTAL_ARMOR_PARTS[part]
      event.add('power', `item.power.${element}_armor_${part}`,
        ja ? `${head}の魔装の${partName[0]}` : `${head} Magic Armor ${partName[1]}`)
    })
  })
}

ClientEvents.lang('ja_jp', event => addCrystalNames(event, 'ja_jp'))
ClientEvents.lang('en_us', event => addCrystalNames(event, 'en_us'))
