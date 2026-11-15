// priority: 0

// 魚人の英雄（#56、第三等級の継承者）。Cataclysm のリヴァイアサン（cataclysm:the_leviathan）を使う（2026-11-12、利用者と決定）。
// 戦い方は Cataclysm のまま（水の外では無敵なので、水中で戦う）。体力と攻撃の倍率は等級で決める（grades.js）。名前は client_scripts/fishman_hero.js で変える。
//
// 作中の深海の魔法（Pixiv 百科事典）は5つ。どれも Cataclysm Spellbooks の深淵（Abyssal）系統の呪文:
//   アビサルプレデター = abyssal_predator、タイダルティア = abyssal_slash（Tidal Tear）、
//   アビサルテンタクル = tidal_grab（Tentacle Laceration）、アビサルビーム = void_beam（Abyssal Beam）、
//   アビサルブラスト = abyssal_blast
//
// 倒されたら、リヴァイアサンがもともと落とす物（Cataclysm のルートテーブル）はそのままにして、
// 水の封印石（endrem:guardian_eye）1個と、次の8つからランダムに2〜3枚の巻物（レベル1、同じものは出ない）を足す。
//   深海の魔法5つと、作中にはないが深海らしい既存の呪文3つ（Depth Charge、Dimensional Rift、
//   Unfolding Coruscation（深淵の火の玉））。深海の生き物を呼ぶ呪文は、召喚の候補なので入れない。
// レベルはルーンで上げる想定（#51）。
const FISHMAN_HERO_SCROLL_SPELLS = [
  ['cataclysm_spellbooks:abyssal_predator', 1], ['cataclysm_spellbooks:abyssal_slash', 1],
  ['cataclysm_spellbooks:tidal_grab', 1], ['cataclysm_spellbooks:void_beam', 1], ['cataclysm_spellbooks:abyssal_blast', 1],
  // 作中にはない、深海らしい呪文
  ['cataclysm_spellbooks:depth_charge', 1], ['cataclysm_spellbooks:dimensional_rift', 1],
  ['cataclysm_spellbooks:abyss_fireball', 1],
]

// どのボスの報酬にも入っていなかった呪文から、深淵の呪文（#98。2026-11-15、利用者と決定）。
// 上の一覧の2〜3枚とは別に、ここから1枚を落とす（混ぜると、作中の呪文が出にくくなるため）。
const FISHMAN_HERO_EXTRA_SCROLL_SPELLS = [
  ['cataclysm_spellbooks:conjure_clawdian', 1], ['cataclysm_spellbooks:conjure_coral_golem', 1],
  ['cataclysm_spellbooks:conjure_coralssus', 1], ['irons_spellbooks:abyssal_shroud', 1],
]

EntityEvents.death('cataclysm:the_leviathan', event => {
  // 封印石は、もとのルートテーブルを書き換えずに足すため、ここで落とす。
  event.entity.block.popItem(Item.of('endrem:guardian_eye'))
  global.kenmaBossLoot.dropScrolls(event.entity, FISHMAN_HERO_SCROLL_SPELLS, 2, 3)
  global.kenmaBossLoot.dropScrolls(event.entity, FISHMAN_HERO_EXTRA_SCROLL_SPELLS, 1, 1)
})
