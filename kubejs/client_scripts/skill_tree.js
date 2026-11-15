// priority: 0

// スキルツリー（#26）の名前。2026-11-15、利用者と決定。
// スキルツリーは、Irons Spellbooks Skill Tree が入れる Magic カテゴリを、中身を変えずにそのまま使う
// （作者の公式の MOD 一覧に入っている。ほかのカテゴリを作った跡はない。docs/skill-tree.md）。
// もとの名前は英語の文字そのもの（「+5% Mana Regen」など）なので、日本語にならない。
// そこで、kubejs/data/irons_spells_skill_tree/puffish_skills/categories/magic/ の definitions.json と
// category.json で、もとのファイルを上書きして、名前を訳のキーにした（ほかの値はもとのまま）。
// connections.json も上書きして、中心の隣の4つの「どちらか一方しか取れない」をなくした（docs/skill-tree.md）。
//   スキルの名前 = Iron's Spells の能力値の名前（attribute.irons_spellbooks.*）＋ 値。例:「マナ再生 +5%」
//   カテゴリの名前 = 下の skill_category.kenma.magic
// もとのファイルは unofficial_ironspells_v2_1.19.2_1.20.1_1.21.1.jar（パブリックドメイン）。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'skill_category.kenma.magic', '魔法')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'skill_category.kenma.magic', 'Magic')
})
