// priority: 0

// PeyroScythe の「凍結」の効果（peyroscythe:frozen）を、どの生き物にも付かないようにする（2026-11-13、利用者と決定。#77）。
//
// この効果は、付いた生き物が完全に凍ると（凍結時間が満ちると）氷の棺に閉じ込め、
// Iron's Spells 3.4.0.4 にない音（SoundRegistry.ICE_SPIKE_EMERGE）を鳴らす。そこで NoSuchFieldError になり、サーバーが落ちる。
// 氷の魔術師の報酬「アイスレイン」（peyroscythe:icy_comet_rain）の彗星は、当たるたびに凍結時間を 30 増やしてこの効果を付けるので、
// 何発か当てるとこの道に入る。
//
// 効果だけを止める。彗星のダメージと、粉雪と同じ凍え（凍結時間）はそのまま残る。なくなるのは、氷の棺に閉じ込める追加の効果だけ。
// The Frozen World（この効果を付けるもう1つの呪文）は defaultconfigs/irons_spellbooks-server.toml で無効にしてある。

const PeyroFrozenForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
const PeyroFrozenResult = Java.loadClass('net.minecraftforge.eventbus.api.Event$Result')

const PEYRO_FROZEN_EFFECT = 'peyroscythe:frozen'

function denyPeyroFrozen(event) {
  const key = PeyroFrozenForgeRegistries.MOB_EFFECTS.getKey(event.getEffectInstance().getEffect())
  if (key != null && String(key) === PEYRO_FROZEN_EFFECT) event.setResult(PeyroFrozenResult.DENY)
}

// 中で変数を宣言すると、Rhino が2回目の呼び出しで「二重の宣言」として失敗するので、処理は関数に分ける（blessing.js と同じ）。
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.MobEffectEvent$Applicable', event => {
  try {
    denyPeyroFrozen(event)
  } catch (e) {
    console.error(`peyroscythe_frozen: ${e}`)
  }
})
