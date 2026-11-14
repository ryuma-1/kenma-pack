// priority: 0

// 【加護】（#43）: 着ている防具の【加護】を足し合わせ、その割合だけダメージを減らす。
// 作中の仕組みは、エンチャント（ダメージ軽減など）とも術耐性とも別枠で、確定ダメージ以外を軽減する。
// そのため、防具・エンチャント・耐性で減らした後のダメージ（LivingDamageEvent）を、最後に (1 − 加護) 倍する。
//
// 確定ダメージ（減らさないダメージ）は、ダメージの種類のタグ kenma:true_damage にまとめる:
//   config/openloader/data/kenma/data/kenma/tags/damage_type/true_damage.json
// Forge のイベントは起動時スクリプトでしか登録できないので、ここに置く。変えたらゲームの再起動が要る。

// 部位ごとの【加護】の割合。client_scripts/armor_sets.js の表示と同じ値にする。
const BLESSING = {
  'fantasy_armor:dragonslayer_helmet': 0.15, // 王国騎士
  'fantasy_armor:dragonslayer_chestplate': 0.15,
  'fantasy_armor:dragonslayer_leggings': 0.15,
  'fantasy_armor:dragonslayer_boots': 0.15,
  'fantasy_armor:eclipse_soldier_helmet': 0.2, // 剣魔
  'fantasy_armor:eclipse_soldier_chestplate': 0.2,
  'fantasy_armor:eclipse_soldier_leggings': 0.2,
  'fantasy_armor:eclipse_soldier_boots': 0.2,
}

const $TagKey = Java.loadClass('net.minecraft.tags.TagKey')
const $Registries = Java.loadClass('net.minecraft.core.registries.Registries')
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
const TRUE_DAMAGE = $TagKey.create($Registries.DAMAGE_TYPE, new $ResourceLocation('kenma', 'true_damage'))

// 着ている防具の【加護】の合計。
// getItemBySlot を直接呼ぶと、モブによってはエラーになり、ダメージそのものが入らなくなる。
// KubeJS が用意している headArmorItem などを使う。
function totalBlessing(entity) {
  const worn = [entity.headArmorItem, entity.chestArmorItem, entity.legsArmorItem, entity.feetArmorItem]
  return worn.reduce((sum, item) => sum + (BLESSING[item.id] || 0), 0)
}

function applyBlessing(event) {
  if (event.source.is(TRUE_DAMAGE)) return
  let total = totalBlessing(event.entity)
  if (total > 0) event.setAmount(event.amount * Math.max(0, 1 - total))
}

// ここで例外が起きるとダメージが入らなくなるので、失敗したら何もしない（加護なし）で通す。
// 中で変数を宣言すると、Rhino が2回目の呼び出しで「二重の宣言」として失敗するので、処理は関数に分ける。
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingDamageEvent', event => {
  try {
    applyBlessing(event)
  } catch (e) {
    console.error(`blessing: ${e}`)
  }
})
