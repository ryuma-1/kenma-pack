// priority: 0

// 自作のルーン（#51）の名前と、ルーンで巻物のレベルを上げられることの説明。
// ルーンの登録は startup_scripts/runes.js、レシピは server_scripts/rune_upgrade.js。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'item.kenma.stagnation_rune', '淀みのルーン')
  event.add('kenma', 'item.kenma.eldritch_rune', '異界のルーン')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'item.kenma.stagnation_rune', 'Stagnation Rune')
  event.add('kenma', 'item.kenma.eldritch_rune', 'Eldritch Rune')
})

// 系統のルーン（server_scripts/rune_upgrade.js の KENMA_SCHOOL_RUNES と同じもの）に、使い方を足す。
const KENMA_UPGRADE_RUNES = [
  'irons_spellbooks:fire_rune', 'irons_spellbooks:ice_rune', 'irons_spellbooks:lightning_rune',
  'irons_spellbooks:holy_rune', 'irons_spellbooks:ender_rune', 'irons_spellbooks:blood_rune',
  'irons_spellbooks:evocation_rune', 'irons_spellbooks:nature_rune', 'kenma:eldritch_rune',
  'cataclysm_spellbooks:abyssal_rune', 'cataclysm_spellbooks:technomancy_rune', 'kenma:stagnation_rune',
]

ItemEvents.tooltip(event => {
  event.add(KENMA_UPGRADE_RUNES, [
    Text.gray('同じ系統の巻物と作業台で合わせると、呪文のレベルが1つ上がる。'),
    Text.gray('上げた後のレベルと同じ数のルーンを、1マスに重ねて置く。'),
  ])
})
