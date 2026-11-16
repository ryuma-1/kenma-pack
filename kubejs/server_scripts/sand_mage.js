// priority: 0

// 砂塵の魔術師（#61）。ボスは Cataclysm の Ancient Remnant（cataclysm:ancient_remnant）を使う
// （2026-11-13、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。
// 拠点は、もとからいる Cataclysm の Cursed Pyramid（砂漠）。半竜の乙女（イグニス）と同じく、どの Ancient Remnant も砂塵の魔術師で、
// 目印のタグは使わない。同じピラミッドの Wadjet は、星降りの聖職者ではない（星降りの聖職者は Mountain Tower で呼び出す）。
// 戦い方、ボスバーは Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。名前は client_scripts/sand_mage.js、魂は server_scripts/boss_souls.js。
// 作中の砂塵の魔法と呪文の対応は startup_scripts/sand_magic.js。

// 倒されたら、砂塵の封印石（endrem:old_eye）1個と、次の10から、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
//   作中の砂塵の魔法5つと、作中にはないが砂塵の魔術師らしい Cataclysm Spellbooks の呪文5つ（2026-11-13、利用者と決定）。
//   ファントムブレード（phantasmal_blade）は、帝国近衛騎士の報酬にも入っている（両方に入れる、利用者と決定）。
//   Thoth's Witness は、ファラオの魔術師の防具（Cataclysm Spellbooks）を4部位そろえて着ていないと唱えられない。
// レベルはルーンで上げる想定（#51）。
const SAND_MAGE_SCROLL_SPELLS = [
  ['cataclysm_spellbooks:sandstorm', 1], ['peyroscythe:made_in_heaven', 1], ['cataclysm_spellbooks:desert_winds', 1],
  ['cataclysm_spellbooks:phantasmal_blade', 1], ['kenma:primal_curse', 1],
  // 作中にはない、砂塵の魔術師らしい呪文
  ['cataclysm_spellbooks:monolith_crash', 1], ['cataclysm_spellbooks:thoths_witness', 1],
  ['cataclysm_spellbooks:pharaohs_wrath', 1], ['cataclysm_spellbooks:conjure_koboldiator', 1],
  ['cataclysm_spellbooks:summon_koboleton', 1],
]

// どのボスの報酬にも入っていなかった呪文から、幻と、砂塵の魔術師らしい呪文（#98。2026-11-15、利用者と決定）。
// 上の一覧の2〜3枚とは別に、ここから1枚を落とす（混ぜると、作中の呪文が出にくくなるため）。
const SAND_MAGE_EXTRA_SCROLL_SPELLS = [
  ['peyroscythe:made_in_heaven_real', 1], ['peyroscythe:illusion_crazy', 1], ['peyroscythe:illusion_fear', 1],
  ['cataclysm_spellbooks:pilfer', 1],
]

EntityEvents.death('cataclysm:ancient_remnant', event => {
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:old_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, SAND_MAGE_SCROLL_SPELLS, 2, 3)
  global.kenmaBossLoot.dropScrolls(event.entity, SAND_MAGE_EXTRA_SCROLL_SPELLS, 1, 1)
  // 本物のトーテム（#128。2026-11-16、利用者と決定）。倒すたびに1個。仕組みは server_scripts/true_totem.js。
  event.entity.block.popItem(Item.of('kenma:true_totem'))
})
