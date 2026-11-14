// priority: 0

// 結晶の魔法（#78）。作中の「結晶」は、Keepers of the Stones II の属性の石を使う（2026-11-14、利用者と決定）。
// 作中の結晶は、ほかの魔法を保存して再現するもの。継承者の魔法8種類と、墓守自身の結晶の魔法の、9種類の石を使う。
//
// MOD のもとの動き（jar のプログラムで確かめた）:
// - 石を使うと、石は手から消え、効果「〜の主」が付き、その属性の防具（魔装）と武器（魔剣）が付く
// - 効果が切れるか消されると、防具と武器が消え、クールダウン付きの石が手元に戻る（クールダウンはもとの 300 秒のまま）
// - 効果が付いたまま死ぬと、生き返ったときに石が戻る（作中の「死んでも結晶が手元に戻る」）
// - 効果を消された後の石はただの持ち物なので、死ぬと落ちる（作中の「剥がされると戻らない」）
// ここで足すもの: 効果の時間を2分にする、魔剣に呪文を2つ入れる、獣人の墓守が結晶を落とす（server_scripts/beast_gravekeeper.js）。
// 魔装の数値は config/openloader/data/kenma/data/kenma/attributizer/armor/crystals.json、名前は client_scripts/crystal.js。

// 結晶ごとの [石, 魔剣, 呪文1, 呪文2]。呪文は、その継承者の巻物の候補から、攻撃1つと移動・補助1つを選んだ（仮）。
// 結晶の結晶は、結晶の魔法に当たる呪文がないので、Magic Missile と Shield にした（仮）。
global.kenmaCrystals = [
  ['power:fire_stone', 'power:fire_sword', 'irons_spellbooks:blaze_storm', 'irons_spellbooks:burning_dash'], // 炎
  ['power:ice_stone', 'power:ice_spear', 'irons_spellbooks:icicle', 'irons_spellbooks:frost_step'], // 氷
  ['power:earth_stone', 'power:earth_hammer', 'irons_spellbooks:root', 'irons_spellbooks:poison_breath'], // 大地
  ['power:water_stone', 'power:water_katana', 'cataclysm_spellbooks:abyssal_blast', 'cataclysm_spellbooks:tidal_grab'], // 深海
  ['power:lightning_stone', 'power:lightning_falchion', 'irons_spellbooks:chain_lightning', 'irons_spellbooks:ascension'], // 竜狩り
  ['power:blood_stone', 'power:blood_sickle', 'irons_spellbooks:blood_slash', 'irons_spellbooks:blood_step'], // 殺人
  ['power:light_stone', 'power:light_sword', 'irons_spellbooks:guiding_bolt', 'irons_spellbooks:heal'], // 聖
  ['power:sand_stone', 'power:sand_saber', 'cataclysm_spellbooks:sandstorm', 'cataclysm_spellbooks:desert_winds'], // 砂塵
  ['power:crystal_stone', 'power:crystal_knife', 'irons_spellbooks:magic_missile', 'irons_spellbooks:shield'], // 結晶
]

// 魔剣に入れる呪文のレベル（仮。強さは #4 でまとめて調整する）。
const CRYSTAL_SPELL_LEVEL = 3
// 効果の時間（秒）。作中は2分。
const CRYSTAL_DURATION_SECONDS = 120

const $TagParser = Java.loadClass('net.minecraft.nbt.TagParser')

const CRYSTAL_WEAPON_SPELLS = {}
global.kenmaCrystals.forEach(c => { CRYSTAL_WEAPON_SPELLS[c[1]] = [c[2], c[3]] })

// 効果の時間は、プレイヤーごとの値（もとは 600 秒）で、MOD のコマンドでしか変わらない。
// ログインしたときと生き返ったときに、2分にそろえる。
function setCrystalDuration(player) {
  player.server.runCommandSilent(`pw master_effect_duration set ${player.username} ${CRYSTAL_DURATION_SECONDS}`)
}
PlayerEvents.loggedIn(event => setCrystalDuration(event.player))
PlayerEvents.respawned(event => setCrystalDuration(event.player))

// 魔剣は石を使ったときに MOD が新しく作って持たせるので、手に持った魔剣にまだ呪文がなければ入れる。
// 呪文は固定（locked）にして、秘術の金床で外せないようにする。spellWheel:1b で、手に持つと呪文の輪から唱えられる。
function crystalSpellsTag(spells) {
  return $TagParser.parseTag(`{data:[{id:"${spells[0]}",index:0,level:${CRYSTAL_SPELL_LEVEL},locked:1b},` +
    `{id:"${spells[1]}",index:1,level:${CRYSTAL_SPELL_LEVEL},locked:1b}],maxSpells:2,mustEquip:0b,spellWheel:1b}`)
}

PlayerEvents.tick(event => {
  const player = event.player
  if (player.age % 10 != 0) return
  const item = player.mainHandItem
  const spells = CRYSTAL_WEAPON_SPELLS[item.id]
  if (!spells) return
  const tag = item.getOrCreateTag()
  if (tag.contains('ISB_Spells')) return
  tag.put('ISB_Spells', crystalSpellsTag(spells))
})
