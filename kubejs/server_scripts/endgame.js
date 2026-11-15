// priority: 0

// 終盤（#8）: 始祖の竜 → 退魔の巨像・退魔の剣士 → 最後の魔王。2026-11-14、利用者と決定。
// 作中の流れ（Pixiv 百科事典）: 12個の封印石でエンドの封印を解き、始祖の竜を倒して退魔の法を受け継ぐ。
// 退魔の法で、異界にいる最後の魔王を倒す。
//
// エンドの封印は End Remastered のポータル（違う封印石が12個要る）をそのまま使う（server_scripts/seal_stones.js）。
// 異界は Call from the Depths の次元（古代都市に入り口がある。作中の「異界は古代都市に入り口がある」）。
// 名前は client_scripts/exorcism.js、Forge のイベントで作るもの（退魔の法の魔族への倍率、クリスタルの軽減）は
// startup_scripts/exorcism.js。強さの数値は仮（#4 でまとめて調整する）。

// 作中の退魔の法の9つ（どれも既存のエンダー系の呪文）。
const EXORCISM_STORY_SPELLS = [
  ['cataclysm_spellbooks:void_rune', 1], ['irons_spellbooks:echoing_strikes', 1], ['irons_spellbooks:counterspell', 1],
  ['cataclysm_spellbooks:gravitation_pull', 1], ['irons_spellbooks:dragon_breath', 1], ['irons_spellbooks:portal', 1],
  ['irons_spellbooks:magic_arrow', 1], ['irons_spellbooks:magic_missile', 1], ['irons_spellbooks:recall', 1],
]
// 作中にはないが、退魔の法らしいエンダー系の呪文。Starfall は聖の継承者（星降りの聖職者）の報酬に入れてある。
const EXORCISM_EXTRA_SPELLS = [
  ['irons_spellbooks:teleport', 1], ['irons_spellbooks:evasion', 1], ['irons_spellbooks:black_hole', 1],
  ['irons_spellbooks:void_tentacles', 1], ['cataclysm_spellbooks:gravity_storm', 1], ['cataclysm_spellbooks:void_bulwark', 1],
]

// ---- 始祖の竜（エンダードラゴン） ----
// 作中の報酬: 退魔の法、始祖の涙（退魔の魔導書の材料）、異界の鍵ほか。
// 涙は server_scripts/boss_souls.js。ここでは、異界の鍵1個と、作中の退魔の法9つから3〜4枚の巻物を落とす。
// 異界の鍵は Call from the Depths の Depths key（異界に入る鍵）。作れないようにして、竜からだけ手に入るようにする。
// クリスタルによる軽減は startup_scripts/exorcism.js。
const PROGENITOR_DRAGON_HEALTH = 1000 // バニラは 200（仮の値）

EntityEvents.spawned('minecraft:ender_dragon', event => {
  var dragon = event.entity
  // 読み込み直したときは、もう上げてあるので何もしない（体力が戻らないように）。
  // setMaxHealth は KubeJS の関数（最大体力の基本値を変える）。
  if (dragon.getMaxHealth() >= PROGENITOR_DRAGON_HEALTH) return
  dragon.setMaxHealth(PROGENITOR_DRAGON_HEALTH)
  dragon.setHealth(PROGENITOR_DRAGON_HEALTH)
})

EntityEvents.death('minecraft:ender_dragon', event => {
  event.entity.block.popItem(Item.of('callfromthedepth_:depth'))
  global.kenmaBossLoot.dropScrolls(event.entity, EXORCISM_STORY_SPELLS, 3, 4)
})

ServerEvents.recipes(event => {
  event.remove({ id: 'callfromthedepth_:depthkeycraft' })
})

// ---- 退魔の巨像（Cataclysm の Ender Guardian） ----
// エンドの外側の島の Ruined Citadel で、Altar of Void から呼び出す（Cataclysm のまま）。
// 強さ、戦い方（テレポートと拳。jar の技の名前で確かめた）、ボスバー、落とし物は Cataclysm のまま。名前だけ変える。

// ---- 退魔の剣士（Iron's Spells の The Dead King） ----
// エンドの外側の島の Ruined Citadel（作中の「果ての荒野」）で呼び出す（server_scripts/structure_bases.js）。
// 呼び出したものにだけ、名前と目印のタグ kenma_heir が付く。ボスバーは Iron's Spells のもの（名前は boss_bar.js で合わせる）。
// 作中の報酬: 退魔の剣、退魔の法ほか。退魔の剣1本と、退魔の法15から2〜3枚の巻物を落とす。
// 退魔の剣は、作中では「マジックミサイル」と「ポータル」が込められ、手に持つと退魔の法の威力が 50% 上がる。
// ネザライトの剣に、名前、呪文2つ（固定）、退魔の法の力 +50%（メインハンド）を付けたもの。
// 攻撃力と攻撃速度は、能力を書くともとの値が消えるので、ネザライトの剣と同じ値（+7、−2.4）を一緒に書く（UUID もバニラと同じ）。
const EXORCISM_SWORD = Item.of('minecraft:netherite_sword', '{' +
  'display:{Name:\'{"translate":"item.kenma.exorcism_sword","italic":false,"color":"light_purple"}\',' +
  'Lore:[\'{"translate":"item.kenma.exorcism_sword.description"}\']},' +
  'AttributeModifiers:[' +
  '{AttributeName:"minecraft:generic.attack_damage",Name:"Weapon modifier",Amount:7.0d,Operation:0,Slot:"mainhand",UUID:[I;-885041709,1683771192,-1533567981,-1556236849]},' +
  '{AttributeName:"minecraft:generic.attack_speed",Name:"Weapon modifier",Amount:-2.4d,Operation:0,Slot:"mainhand",UUID:[I;-98353636,1098926181,-1340359474,-1752847197]},' +
  '{AttributeName:"irons_spellbooks:ender_spell_power",Name:"kenma exorcism sword",Amount:0.5d,Operation:1,Slot:"mainhand",UUID:[I;244349163,-1696114776,-1638935216,293100848]}],' +
  'ISB_Spells:{data:[{id:"irons_spellbooks:magic_missile",index:0,level:3,locked:1b},' +
  '{id:"irons_spellbooks:portal",index:1,level:1,locked:1b}],maxSpells:2,mustEquip:0b,spellWheel:1b}}')
global.kenmaExorcismSword = EXORCISM_SWORD

EntityEvents.death('irons_spellbooks:dead_king', event => {
  if (!event.entity.tags.contains('kenma_heir')) return
  event.entity.block.popItem(EXORCISM_SWORD.copy())
  global.kenmaBossLoot.dropScrolls(event.entity, EXORCISM_STORY_SPELLS.concat(EXORCISM_EXTRA_SPELLS), 2, 3)
})

// ---- 最後の魔王（Call from the Depths の Deep darkest spawn） ----
// 異界（Call from the Depths の次元）の神殿で、Abyss key を使って呼び出す（Call from the Depths のまま）。
// 第1形態（deepdarkestspawn）を倒すと第2形態（deepdarkestspwansecondphase。MOD の綴りのまま）になる。
// 強さ、戦い方、落とし物は Call from the Depths のまま。退魔の法（エンダー系の呪文）は2倍効く（startup_scripts/exorcism.js）。
// 第2形態を倒したら、全員に「魔王討伐」を知らせる（作中の「シリーズ完結」）。
EntityEvents.death('callfromthedepth_:deepdarkestspwansecondphase', event => {
  var server = event.server
  server.players.forEach(player => {
    player.tell(Text.translate('message.kenma.demon_king_defeated').gold())
  })
  server.runCommandSilent('title @a times 20 100 40')
  server.runCommandSilent('title @a title {"translate":"title.kenma.demon_king_defeated","color":"gold"}')
  server.runCommandSilent('execute as @a at @s run playsound minecraft:ui.toast.challenge_complete master @s ~ ~ ~ 1 1')
})
