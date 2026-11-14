// priority: 0

// プライマルカース（#61、砂塵の魔法）の上乗せの処理。呪文と効果の登録は startup_scripts/sand_magic.js。
// 効果 kenma:primal_curse の付いた者が与えたダメージ（近接・弓・呪文のどれでも）1回ごとに、
// 相手に確定ダメージ（1 + 0.5 × 効果の強さ）を足す。ダメージの種類 kenma:primal_curse は、防具・エンチャント・耐性・盾・
// 無敵時間・【加護】を無視する。ダメージの量は仮の値（試して直す）。
//
// Forge の LivingHurtEvent（起動用スクリプト）で足そうとしたら、上乗せのダメージが入らなかった。
// KubeJS の EntityEvents.hurt（ダメージを受ける直前）から足すと入った（2026-11-13 にサーバーで確認）。

const PRIMAL_CURSE_KEY = Java.loadClass('net.minecraft.resources.ResourceKey').create(
  Java.loadClass('net.minecraft.core.registries.Registries').DAMAGE_TYPE,
  new (Java.loadClass('net.minecraft.resources.ResourceLocation'))('kenma', 'primal_curse'))

// 何度も呼ばれるので var で書く（boss_bar.js の注意を参照）。
function kenmaPrimalCurseOnHurt(event) {
  var source = event.source, attacker = source.actual, target = event.entity, instance
  // 足した確定ダメージそのものには、もう足さない。
  if (source.is(PRIMAL_CURSE_KEY) || attacker == null || !attacker.isLiving() || attacker.getId() === target.getId()) return
  instance = attacker.potionEffects.getActive('kenma:primal_curse')
  if (instance == null || event.damage <= 0) return
  // バニラの hurt は KubeJS からは attack という名前で呼ぶ。
  target.attack(target.damageSources().source(PRIMAL_CURSE_KEY, attacker), 1 + 0.5 * instance.getAmplifier())
}

// ここで例外が起きてもダメージ自体は止めない。失敗したら上乗せなしで通す。
EntityEvents.hurt(event => {
  try {
    kenmaPrimalCurseOnHurt(event)
  } catch (e) {
    console.error(`primal_curse: ${e}`)
  }
})
