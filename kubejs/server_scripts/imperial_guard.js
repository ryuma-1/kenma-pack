// priority: 0

// 帝国近衛騎士（#63）。ボスは Cataclysm のマレディクタス（cataclysm:maledictus）を使う
// （2026-11-13、利用者と決定。ボスは自作せず、既存の MOD のものを使う方針）。斧と矛を使い、作中の「斧術と魔法の機動戦」に合う。
// 戦い方は Cataclysm のまま。体力と攻撃の倍率は等級で決める（grades.js）。ボスバーは Cataclysm のもの（第1・第2形態で2本）、
// 魂は server_scripts/boss_souls.js。
// 拠点は Cavernous の地下の城塞 The Citadel（作中の「禁足地」）。そこで呼び出したマレディクタスだけが帝国近衛騎士で、
// 名前（entity.kenma.imperial_guard）と目印のタグ kenma_heir が付く（server_scripts/structure_bases.js）。
// Cataclysm の Frosted Prison の墓石から呼び出すマレディクタスは、名前も報酬ももとのまま（1つの拠点にだけ出す）。
//
// 作中の殺人の魔法（Pixiv 百科事典）は7つ。呪文との対応（2026-11-13、利用者と決定）:
//   ブラッドイーター = irons_spellbooks:devour（噛みついて15%回復、倒すと最大体力が上がる）、
//   ブラッドインパクト = cataclysm_spellbooks:hemorrhaging_impact（血の槍のあと血の針で追撃）、
//   ブラッドスラッシュ = irons_spellbooks:blood_slash、ブラッドピック = irons_spellbooks:acupuncture、
//   ブラッドステップ = irons_spellbooks:blood_step、ブラッドニードル = irons_spellbooks:blood_needles、
//   ハートストップ = irons_spellbooks:heartstop

// 倒されたら、殺人の封印石（endrem:wither_eye）1個と、次の14から、ランダムに2〜3枚の巻物（レベル1、同じものは出ない）を落とす。
//   作中の殺人の魔法7つと、マレディクタスの技4つ（氷の魔術師のときに、こちらに回すことにしたもの）、
//   血系統の3つ（2026-11-13、利用者と決定）。
// レベルはルーンで上げる想定（#51）。
const IMPERIAL_GUARD_SCROLL_SPELLS = [
  ['irons_spellbooks:devour', 1], ['cataclysm_spellbooks:hemorrhaging_impact', 1], ['irons_spellbooks:blood_slash', 1],
  ['irons_spellbooks:acupuncture', 1], ['irons_spellbooks:blood_step', 1], ['irons_spellbooks:blood_needles', 1],
  ['irons_spellbooks:heartstop', 1],
  // マレディクタスの技（Cataclysm Spellbooks。氷の系統）。Phantasmal Blade は砂塵の魔術師の報酬にも入っている（作中のファントムブレード）
  ['cataclysm_spellbooks:phantasmal_blade', 1], ['cataclysm_spellbooks:malevolent_battlefield', 1],
  ['cataclysm_spellbooks:cursed_rush', 1], ['cataclysm_spellbooks:forgone_rage', 1],
  // 作中にはない、血系統の呪文
  ['irons_spellbooks:raise_dead', 1], ['cataclysm_spellbooks:quick_strike', 1], ['cataclysm_spellbooks:final_rend', 1],
]

EntityEvents.death('cataclysm:maledictus', event => {
  if (!event.entity.tags.contains('kenma_heir')) return
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:wither_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, IMPERIAL_GUARD_SCROLL_SPELLS, 2, 3)
})
