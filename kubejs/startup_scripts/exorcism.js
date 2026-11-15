// priority: 0

// 退魔の法（#8）と、始祖の竜の戦い方のうち、Forge のイベントでしか作れないもの。
// Forge のイベントは起動時スクリプトでしか登録できないので、ここに置く。変えたらゲームの再起動が要る。
//
// 退魔の法の系統は、Iron's Spells のエンダー系の表示名を変えたもの（2026-11-14、利用者と決定）。
// 作中の退魔の法の9つ（Pixiv 百科事典）は、すべて既存のエンダー系の呪文にある。名前は client_scripts/exorcism.js。
//
// 1. 退魔の法は、魔族に弱点の倍率がかかる（作中の「魔族の遺伝情報を破壊する」「魔族に対して弱点倍率がかかる」）。
//    魔族は、異界（Call from the Depths の次元）のモブ。エンダー系の呪文のダメージを、Call from the Depths のモブには2倍にする（倍率は仮）。
// 2. 始祖の竜（エンダードラゴン）は、残っているエンドクリスタル1個につき、受けるダメージを1割減らす
//    （作中の「クリスタルは一個につき始祖へのダメージを一割軽減する」。10個すべて残っていれば効かない）。
//    数えるのは柱の上のクリスタル（下の台が見えるもの）だけ。竜を呼び直すためにプレイヤーが置いたクリスタルは数えない。
//    作中の「壊すたびに魔力の上限を一割没収する」は入れない（2026-11-14、利用者と決定）。

const ExorcismEnderDragon = Java.loadClass('net.minecraft.world.entity.boss.enderdragon.EnderDragon')
const ExorcismEndCrystal = Java.loadClass('net.minecraft.world.entity.boss.enderdragon.EndCrystal')
const ExorcismAABB = Java.loadClass('net.minecraft.world.phys.AABB')

// 魔族（異界のモブ）の MOD の名前空間と、退魔の法の倍率。
const EXORCISM_DEMON_NAMESPACE = 'callfromthedepth_'
const EXORCISM_DEMON_MULTIPLIER = 2.0
// クリスタル1個あたりの軽減と、数える範囲（エンドの中央の島。柱は中心から 50 ブロックほどの円の上にある）。
const DRAGON_CRYSTAL_REDUCTION = 0.1
const DRAGON_CRYSTAL_RANGE = new ExorcismAABB(-96, -64, -96, 96, 320, 96)

global.kenmaExorcism = {
  // 何度も呼ばれる関数なので var で書く（boss_bar.js の注意を参照）。
  onSpellDamage(event) {
    var spell = event.getSpellDamageSource().spell(), target = event.getEntity()
    if (spell == null || target == null) return
    if (String(spell.getSchoolType().getId()) !== 'irons_spellbooks:ender') return
    if (String(target.getType().builtInRegistryHolder().key().location().getNamespace()) !== EXORCISM_DEMON_NAMESPACE) return
    event.setAmount(event.getAmount() * EXORCISM_DEMON_MULTIPLIER)
  },

  // 柱の上のクリスタルの数（多くても10）。
  pillarCrystals(level) {
    var list = level.getEntitiesOfClass(ExorcismEndCrystal, DRAGON_CRYSTAL_RANGE), n = 0, i
    for (i = 0; i < list.size(); i++) if (list.get(i).isAlive() && list.get(i).showsBottom()) n++
    return Math.min(n, 10)
  },

  onDragonDamage(event) {
    var dragon = event.getEntity(), n
    if (!(dragon instanceof ExorcismEnderDragon)) return
    n = this.pillarCrystals(dragon.level)
    if (n > 0) event.setAmount(event.getAmount() * Math.max(0, 1 - DRAGON_CRYSTAL_REDUCTION * n))
  },
}

// ここで例外が起きるとダメージが入らなくなるので、失敗したら何もしない（倍率なし）で通す（blessing.js と同じ）。
ForgeEvents.onEvent('io.redspace.ironsspellbooks.api.events.SpellDamageEvent', event => {
  try {
    global.kenmaExorcism.onSpellDamage(event)
  } catch (e) {
    console.error(`exorcism: ${e}`)
  }
})

ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingDamageEvent', event => {
  try {
    global.kenmaExorcism.onDragonDamage(event)
  } catch (e) {
    console.error(`exorcism dragon: ${e}`)
  }
})
