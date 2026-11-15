// priority: 0

// 召喚の魔術師（#57）。ボスは Cataclysm のハービンジャー（cataclysm:the_harbinger）を使う
// （2026-11-13、利用者と決定。はじめは Iron's Spells のアーキヴォーカーにしていたが、Cataclysm のボスを積極的に使う方針にして変えた）。
// 作中の召喚の魔術師は「占領地の強制労働施設を管理していた帝国魔術師」。ハービンジャーは古代の工場の機械のボスで、施設の管理者に合う。
// 戦い方は Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。ボスバーは Cataclysm のもの、魂は server_scripts/boss_souls.js。
// 拠点は IDAS の古代の鉱山（作中の「鉱山」）の最下部の大きな広間（server_scripts/structure_bases.js）。そこで呼び出したハービンジャーだけが
// 召喚の魔術師で、名前（entity.kenma.summoner_mage）と目印のタグ kenma_heir が付く。
// Cataclysm の Ancient Factory にもとからいるハービンジャーは、名前も報酬ももとのまま（1つの拠点にだけ出す）。
//
// 作中の召喚の魔法（Pixiv 百科事典）は5つ。どれも Iron's Spells の召喚系統の呪文（2026-11-12、利用者と決定）:
//   アローボレー = irons_spellbooks:arrow_volley、スペクトルハンマー = irons_spellbooks:spectral_hammer、
//   ファングストライク = irons_spellbooks:fang_strike、突風 = irons_spellbooks:gust、
//   マジックシールド = irons_spellbooks:shield

// 倒されたら、召喚の封印石（endrem:magical_eye）1個と、次の5つから、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
// 巻物の候補は作中の5つだけ（作中にない呪文は足さない。利用者と決定）。レベルはルーンで上げる想定（#51）。
const SUMMONER_MAGE_SCROLL_SPELLS = [
  ['irons_spellbooks:arrow_volley', 1], ['irons_spellbooks:spectral_hammer', 1], ['irons_spellbooks:fang_strike', 1],
  ['irons_spellbooks:gust', 1], ['irons_spellbooks:shield', 1],
]

// どのボスの報酬にも入っていなかった呪文から、テクノマンシー（Harbinger は機械のボス）と、呼び出す・喚起の呪文（#98。2026-11-15、利用者と決定）。
// 上の一覧の2〜3枚とは別に、ここから1枚を落とす（混ぜると、作中の呪文が出にくくなるため）。
const SUMMONER_MAGE_EXTRA_SCROLL_SPELLS = [
  ['cataclysm_spellbooks:aerial_assault', 1], ['cataclysm_spellbooks:atomic_laser', 1],
  ['cataclysm_spellbooks:construct_prowler', 1], ['cataclysm_spellbooks:construct_watchers', 1],
  ['cataclysm_spellbooks:dos_swarm', 1], ['cataclysm_spellbooks:emp_blast', 1],
  ['cataclysm_spellbooks:intrusion_prevention_system', 1], ['cataclysm_spellbooks:ddos', 1],
  ['cataclysm_spellbooks:disabling_swipe', 1], ['cataclysm_spellbooks:flash_bang', 1],
  ['cataclysm_spellbooks:gear_shift', 1], ['cataclysm_spellbooks:hardware_update', 1],
  ['cataclysm_spellbooks:laserbolt', 1], ['cataclysm_spellbooks:lock_on', 1],
  ['cataclysm_spellbooks:missile_launch', 1], ['cataclysm_spellbooks:overcharged', 1],
  ['cataclysm_spellbooks:reboot', 1], ['cataclysm_spellbooks:rewire', 1], ['cataclysm_spellbooks:shutdown', 1],
  ['cataclysm_spellbooks:software_update', 1], ['cataclysm_spellbooks:surveillance_drone', 1],
  ['cataclysm_spellbooks:parting_shot', 1], ['irons_spellbooks:summon_vex', 1], ['irons_spellbooks:summon_horse', 1],
  ['irons_spellbooks:fang_ward', 1], ['irons_spellbooks:wololo', 1], ['irons_spellbooks:chain_creeper', 1],
  ['irons_spellbooks:lob_creeper', 1],
]

EntityEvents.death('cataclysm:the_harbinger', event => {
  if (!event.entity.tags.contains('kenma_heir')) return
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:magical_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, SUMMONER_MAGE_SCROLL_SPELLS, 2, 3)
  global.kenmaBossLoot.dropScrolls(event.entity, SUMMONER_MAGE_EXTRA_SCROLL_SPELLS, 1, 1)
})
