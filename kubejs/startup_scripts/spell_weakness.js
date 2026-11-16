// priority: 0

// ボスの呪文の系統の弱点と耐性（#127。2026-11-16、利用者と決定）。
// 継承者ごとに、自分の魔法と反対の系統を弱点（2倍）、自分の系統を耐性（半分）にする。
// どのボスがどの系統かと倍率は kubejs/config/grades.json（bosses の weakTo、resists と spellWeakness）。
// 倍率を決めるのは server_scripts/grades.js の spellMultiplier（/reload で変えられる）。
// Forge のイベントは起動時スクリプトでしか登録できないので、ここに置く。変えたらゲームの再起動が要る。

ForgeEvents.onEvent('io.redspace.ironsspellbooks.api.events.SpellDamageEvent', event => {
  // ここで例外が起きてもダメージは入るように、失敗したら倍率なしで通す（exorcism.js と同じ）。
  try {
    var g = global.kenmaGrades, spell, target, m
    if (g == null) return
    spell = event.getSpellDamageSource().spell()
    target = event.getEntity()
    if (spell == null || target == null) return
    m = g.spellMultiplier(target, String(spell.getSchoolType().getId()))
    if (m !== 1) event.setAmount(event.getAmount() * m)
  } catch (e) {
    console.error(`spell_weakness: ${e}`)
  }
})
