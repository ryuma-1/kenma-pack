// priority: 0

// ボスの等級ごとの攻撃の倍率（#107）。Forge のイベントは起動時スクリプトでしか登録できないので、ここに置く。
// 倍率の計算は server_scripts/grades.js の global.kenmaGrades.damageMultiplier にある。
// そちらは /reload で読み直されるので、倍率の値（kubejs/config/grades.json）を変えても、ゲームの再起動は要らない。
// このファイルを変えたときだけ、再起動が要る。
//
// ボスが与えるダメージすべて（近接、飛び道具、魔法。ダメージの元がボスのもの）に掛ける。

// ここで例外が起きるとダメージが入らなくなるので、失敗したら何もしない（倍率なし）で通す（exorcism.js と同じ）。
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', event => {
  try {
    var grades = global.kenmaGrades, attacker, mul
    if (grades == null) return
    // ダメージの元のモブ（飛び道具や魔法なら撃ったモブ）。KubeJS の名前（DamageSource.getEntity は、このままでは呼べなかった）。
    attacker = event.getSource().actual
    if (attacker == null || attacker === event.getEntity()) return
    mul = grades.damageMultiplier(attacker)
    if (mul !== 1) event.setAmount(event.getAmount() * mul)
  } catch (e) {
    console.error(`grades: ${e}`)
  }
})
