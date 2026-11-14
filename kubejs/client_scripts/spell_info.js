// priority: 0

// 自作の呪文の説明に出す、レベルに応じた値の行の言葉（startup_scripts/spell_info.js）。
// Iron's Spells のもとの言葉にないものだけ、ここで足す。

const KENMA_SPELL_INFO_JA = {
  'ui.kenma.duration_seconds': '効果時間：%s 秒',
  'ui.kenma.duration_minutes': '効果時間：%s 分',
  'ui.kenma.true_damage': '確定ダメージ：%s',
  'ui.kenma.extra_true_damage': '攻撃ごとに確定ダメージ：+%s',
  'ui.kenma.curse_seconds': '呪い（回復阻害）：%s 秒',
  'ui.kenma.self_curse_seconds': '代償：自分に呪い %s 秒',
  'ui.kenma.bind_seconds': '束縛：%s 秒',
  'ui.kenma.rot_per_second': '淀みの侵食：毎秒 %s の確定ダメージ（6 秒）',
  'ui.kenma.chain_targets': '連鎖：最大 %s 体',
  'ui.kenma.self_damage': '代償：自分に魔法ダメージ %s',
  'ui.kenma.regeneration_seconds': '再生：%s 秒',
}

const KENMA_SPELL_INFO_EN = {
  'ui.kenma.duration_seconds': '%s s Duration',
  'ui.kenma.duration_minutes': '%s min Duration',
  'ui.kenma.true_damage': '%s True Damage',
  'ui.kenma.extra_true_damage': '+%s True Damage per Hit',
  'ui.kenma.curse_seconds': '%s s Curse (No Healing)',
  'ui.kenma.self_curse_seconds': 'Drawback: %s s Curse on Self',
  'ui.kenma.bind_seconds': '%s s Bind',
  'ui.kenma.rot_per_second': 'Stagnant Rot: %s True Damage per Second (6 s)',
  'ui.kenma.chain_targets': 'Chains up to %s Targets',
  'ui.kenma.self_damage': 'Drawback: %s Magic Damage to Self',
  'ui.kenma.regeneration_seconds': '%s s Regeneration',
}

ClientEvents.lang('ja_jp', event => {
  Object.keys(KENMA_SPELL_INFO_JA).forEach(k => event.add('kenma', k, KENMA_SPELL_INFO_JA[k]))
})

ClientEvents.lang('en_us', event => {
  Object.keys(KENMA_SPELL_INFO_EN).forEach(k => event.add('kenma', k, KENMA_SPELL_INFO_EN[k]))
})
