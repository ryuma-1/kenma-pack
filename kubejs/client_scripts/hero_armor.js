// priority: 0

// 英雄の防具一式（#25）: Fantasy Armor の Hero セットを「教国騎士の〜」に改名する（Ep.31 の動画）。
// 日本語名は動画のツールチップのとおり。英語名は仮。
// レシピと効果は server_scripts/hero_armor.js にある。

const HERO_ARMOR_NAMES = {
  'item.fantasy_armor.hero_helmet': ['教国騎士のヘルム', 'Holy Kingdom Knight Helm'],
  'item.fantasy_armor.hero_chestplate': ['教国騎士のチェストプレート', 'Holy Kingdom Knight Chestplate'],
  'item.fantasy_armor.hero_leggings': ['教国騎士のレギンス', 'Holy Kingdom Knight Leggings'],
  'item.fantasy_armor.hero_boots': ['教国騎士のブーツ', 'Holy Kingdom Knight Boots'],
}

ClientEvents.lang('ja_jp', event => {
  for (const [key, names] of Object.entries(HERO_ARMOR_NAMES)) event.add('fantasy_armor', key, names[0])
})

ClientEvents.lang('en_us', event => {
  for (const [key, names] of Object.entries(HERO_ARMOR_NAMES)) event.add('fantasy_armor', key, names[1])
})
