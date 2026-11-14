// priority: 0

// 淀みの剣士と淀みの魔法（#53）の名前と説明。魔法の登録は startup_scripts/stagnation_magic.js。
// 淀みの剣士は、拠点で呼び出した Cataclysm のアプトルガングルに付ける名前（server_scripts/structure_bases.js）。
// もとのアプトルガングルの名前は変えない（Frosted Prison にいるものは淀みの剣士ではない）。
// 呪文の名前は作中の名前（Pixiv 百科事典）。説明は作中の説明をもとに書いた。

const KENMA_STAGNATION_JA = {
  'spell.kenma.cursed_scatter': 'カースドスキャター',
  'spell.kenma.cursed_scatter.guide': '周りの敵に、防御を貫く確定ダメージを与える。代償として、自分も一定時間回復できなくなる。',
  'spell.kenma.cursed_chain': 'カースドチェイン',
  'spell.kenma.cursed_chain.guide': '周りの敵を、数の制限なく束縛する。自分と相手は、少しのあいだ回復できなくなる。',
  'spell.kenma.cursed_lung': 'カースドラング',
  'spell.kenma.cursed_lung.guide': '瘴気への耐性を得る。地下や上空の薄い空気でも息が続く。',
  'spell.kenma.cursed_eye': 'カースドアイ',
  'spell.kenma.cursed_eye.guide': '周りの敵を光らせ、長いあいだ回復できなくする。',
  'spell.kenma.cursed_orb': 'カースドオーブ',
  'spell.kenma.cursed_orb.guide': '近くの敵を淀みで侵し、続けて確定ダメージを与える。対象の数には限りがある。',
  'spell.kenma.cursed_heart': 'カースドハート',
  'spell.kenma.cursed_heart.guide': '自分に魔法ダメージを与え、その代わりに一時的な体力を得る。',
  'spell.kenma.chain_curse': 'チェインカース',
  'spell.kenma.chain_curse.guide': '狙った敵に確定ダメージを与え、近くの敵へ連鎖させる。連鎖する数には限りがある。',
  'effect.kenma.miasma_resistance': '瘴気耐性',
  'effect.kenma.stagnant_rot': '淀みの侵食',
  'death.attack.kenma.stagnation': '%1$sは淀みに呑まれた',
  'death.attack.kenma.stagnation.player': '%1$sは%2$sの淀みに呑まれた',
}

const KENMA_STAGNATION_EN = {
  'spell.kenma.cursed_scatter': 'Cursed Scatter',
  'spell.kenma.cursed_scatter.guide': 'Deal true damage that pierces all defenses to nearby enemies. In exchange, you cannot heal for a while.',
  'spell.kenma.cursed_chain': 'Cursed Chain',
  'spell.kenma.cursed_chain.guide': 'Bind every nearby enemy, with no limit on targets. You and your targets cannot heal for a short time.',
  'spell.kenma.cursed_lung': 'Cursed Lung',
  'spell.kenma.cursed_lung.guide': 'Gain resistance to miasma. You can breathe in the thin air deep underground and high in the sky.',
  'spell.kenma.cursed_eye': 'Cursed Eye',
  'spell.kenma.cursed_eye.guide': 'Make nearby enemies glow and prevent them from healing for a long time.',
  'spell.kenma.cursed_orb': 'Cursed Orb',
  'spell.kenma.cursed_orb.guide': 'Corrode nearby enemies with stagnation, dealing true damage over time. The number of targets is limited.',
  'spell.kenma.cursed_heart': 'Cursed Heart',
  'spell.kenma.cursed_heart.guide': 'Deal magic damage to yourself to gain temporary health.',
  'spell.kenma.chain_curse': 'Chain Curse',
  'spell.kenma.chain_curse.guide': 'Deal true damage to the target, chaining to nearby enemies. The number of chains is limited.',
  'effect.kenma.miasma_resistance': 'Miasma Resistance',
  'effect.kenma.stagnant_rot': 'Stagnant Rot',
  'death.attack.kenma.stagnation': '%1$s was swallowed by stagnation',
  'death.attack.kenma.stagnation.player': '%1$s was swallowed by the stagnation of %2$s',
}

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'entity.kenma.stagnation_swordsman', '淀みの剣士')
  Object.keys(KENMA_STAGNATION_JA).forEach(key => event.add('kenma', key, KENMA_STAGNATION_JA[key]))
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'entity.kenma.stagnation_swordsman', 'Stagnant Swordsman')
  Object.keys(KENMA_STAGNATION_EN).forEach(key => event.add('kenma', key, KENMA_STAGNATION_EN[key]))
})
