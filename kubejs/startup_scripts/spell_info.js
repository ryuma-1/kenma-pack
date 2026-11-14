// priority: 10

// 自作の呪文の説明（巻物や魔導書のツールチップ）に、レベルに応じた値の行を出すための部品（2026-11-14、利用者と決定）。
// 各呪文の setUniqueInfo（irons_spells_js）から、global.kenmaSpellInfo.line(...) で行を作る。
// Iron's Spells のもとの言葉（ui.irons_spellbooks.damage など）があるものはそれを使い、ないものは ui.kenma.* を足す
// （言葉は client_scripts/spell_info.js）。
// 値は呪文の処理（onCast）の式と同じにする。式を変えたら、説明の値も直す。

global.kenmaSpellInfo = {
  // 小数は1桁まで（例: 2.5）。整数はそのまま。
  num(n) {
    return String(Math.round(n * 10) / 10)
  },

  // 説明の1行。key は翻訳キー、値は %s（%d）に入る。
  line(key, value) {
    return Text.translate(key, this.num(value))
  },
}
