// priority: 0

// ボスが落とす、魔導書の材料（startup_scripts/spellbooks.js）。2026-11-12、利用者と決定。
//   第四等級のボス → 初級魔術師の魂、第三等級 → 中級魔術師の魂、第二等級 → 上級魔術師の魂、
//   第一等級 → 特級魔術師の魂、始祖竜（エンダードラゴン）→ 始祖竜の涙。1回倒すと1個。
// 等級は docs/progression.md の継承者とボスの表。ボスを決めたら、ここに1行足す。
// [モブの ID, 魂, 目印のタグ（そのタグの付いたモブだけ。null ならそのモブすべて）]

const KENMA_BOSS_SOULS = [
  // 第四等級
  ['kenma:earth_mage', 'kenma:novice_mage_soul', null], // 大地の魔術師
  ['cataclysm:aptrgangr', 'kenma:novice_mage_soul', 'kenma_heir'], // 淀みの剣士（拠点で呼び出したものだけ）
  ['cataclysm:wadjet', 'kenma:novice_mage_soul', 'kenma_heir'], // 星降りの聖職者（拠点で呼び出したものだけ）
  // 第三等級
  ['cataclysm:ignis', 'kenma:intermediate_mage_soul', null], // 半竜の乙女
  ['cataclysm:the_leviathan', 'kenma:intermediate_mage_soul', null], // 魚人の英雄
  ['cataclysm:the_harbinger', 'kenma:intermediate_mage_soul', 'kenma_heir'], // 召喚の魔術師（拠点で呼び出したものだけ）
  // 第二等級
  ['irons_spellbooks:cryomancer', 'kenma:advanced_mage_soul', 'kenma_heir'], // 氷の魔術師（拠点で呼び出したものだけ）
  ['power:energium_golem', 'kenma:advanced_mage_soul', null], // 獣人の墓守
  ['cataclysm:netherite_monstrosity', 'kenma:advanced_mage_soul', null], // 煉獄の猟犬
  // 第一等級
  ['cataclysm:ancient_remnant', 'kenma:special_mage_soul', null], // 砂塵の魔術師
  ['cataclysm:scylla', 'kenma:special_mage_soul', 'kenma_heir'], // 竜狩りの末裔（拠点で呼び出したものだけ）
  ['cataclysm:maledictus', 'kenma:special_mage_soul', 'kenma_heir'], // 帝国近衛騎士（拠点で呼び出したものだけ）
  // 始祖竜
  ['minecraft:ender_dragon', 'kenma:progenitor_dragon_tear', null],
]

KENMA_BOSS_SOULS.forEach(entry => {
  EntityEvents.death(entry[0], event => {
    if (entry[2] && !event.entity.tags.contains(entry[2])) return
    // バニラの spawnAtLocation は Rhino が呼び分けられないので、KubeJS の popItem を使う（boss_loot.js と同じ）。
    event.entity.block.popItem(Item.of(entry[1]))
  })
})
