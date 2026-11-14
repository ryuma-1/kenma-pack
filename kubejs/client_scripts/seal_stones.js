// priority: 0

// 封印石（#24）: End Remastered の眼12種類を、12個の封印石に改名する。
// 封印石の名前は Pixiv 百科事典（「剣魔の世界を統べる」）の12個。
// どの眼をどの封印石にするかは動画には無いので、入手先と継承者の設定が近いものを仮に組み合わせた。
// 入手を止める処理は server_scripts/seal_stones.js にある。
// テクスチャは kubejs/assets/endrem/textures/（tools/textures/seal_stones.py で描く）。

// 眼の ID: [魔法の名前（日本語）, 英語]
const SEAL_STONES = {
  witch_eye: ['大地', 'Earth'],
  rogue_eye: ['淀み', 'Stagnation'],
  corrupted_eye: ['聖', 'Holy'],
  cursed_eye: ['炎', 'Fire'],
  guardian_eye: ['水', 'Water'],
  magical_eye: ['召喚', 'Summoning'],
  cold_eye: ['氷', 'Ice'],
  lost_eye: ['結晶', 'Crystal'],
  nether_eye: ['煉獄', 'Purgatory'],
  old_eye: ['砂塵', 'Sand'],
  black_eye: ['竜狩り', 'Dragon Slaying'],
  wither_eye: ['殺人', 'Slaughter'],
}

// KubeJS の JavaScript（Rhino）では、繰り返しの中の const が1回しか作られず、
// 12個とも最初の名前になってしまうので、関数に分けて forEach で呼ぶ。
function addSealStoneJa(event, eye) {
  const magic = SEAL_STONES[eye][0]
  event.add('endrem', `item.endrem.${eye}`, `${magic}の封印石`)
  event.add('endrem', `item.endrem.${eye}.description`, `§7§o${magic}の魔法を封じた石。エンドの封印を解く鍵の一つ`)
  event.add('endrem', `advancements.main.${eye}.description`, `${magic}の封印石を手に入れる`)
}

function addSealStoneEn(event, eye) {
  const magic = SEAL_STONES[eye][1]
  event.add('endrem', `item.endrem.${eye}`, `Seal Stone of ${magic}`)
  event.add('endrem', `item.endrem.${eye}.description`, `§7§oA stone that seals the magic of ${magic.toLowerCase()}. One of the keys to the End.`)
  event.add('endrem', `advancements.main.${eye}.description`, `Obtain the Seal Stone of ${magic}`)
}

ClientEvents.lang('ja_jp', event => {
  Object.keys(SEAL_STONES).forEach(eye => addSealStoneJa(event, eye))
  event.add('endrem', 'advancements.main.root.description', '初めて封印石を手に入れる')
  event.add('endrem', 'block.endrem.custom_eye.place', 'この封印石ははめ込み済みだ')
  event.add('endrem', 'block.endrem.custom_eye.frame_has_eye', 'このフレームには既に封印石がはめ込まれている')
  event.add('endrem', 'block.endrem.ender_eye.warning', 'この眼は使えない')
})

ClientEvents.lang('en_us', event => {
  Object.keys(SEAL_STONES).forEach(eye => addSealStoneEn(event, eye))
  event.add('endrem', 'advancements.main.root.description', 'Obtain your first seal stone')
})

// 入手できない眼と、その材料を JEI に出さない。
JEIEvents.hideItems(event => {
  event.hide('endrem:cryptic_eye')
  event.hide('endrem:evil_eye')
  event.hide('endrem:exotic_eye')
  event.hide('endrem:undead_eye')
  event.hide('endrem:undead_soul')
  event.hide('endrem:witch_pupil')
})
