// priority: 0

// 終盤（#8）の名前: 退魔の法の系統、始祖の竜、退魔の巨像、退魔の剣士、最後の魔王、異界の鍵、退魔の剣。
// 作中の名前は Pixiv 百科事典（「剣魔の世界を統べる」）から。英語名は仮。
//
// 退魔の法は、Iron's Spells のエンダー系の表示名を変えたもの（2026-11-14、利用者と決定。startup_scripts/exorcism.js）。
// 作中の退魔の法の9つと呪文の対応（どれも既存のエンダー系の呪文。名前は MOD のもとの訳のまま）:
//   ヴォイドルーン = Cataclysm Spellbooks の Conjure: Void Rune、エコーストライク = Echoing Strikes、
//   カウンタースペル = Counterspell、グラビティプル = Cataclysm Spellbooks の Gravitational Pull、
//   ドラゴンブレス = Dragon's Breath、ポータル = Portal、マジックアロウ = Magic Arrow、マジックミサイル = Magic Missile、
//   リコール = Recall
//
// 始祖の竜（エンダードラゴン）と退魔の巨像（Cataclysm の Ender Guardian）は、言語ファイルで名前を変える（ボスバーの名前も変わる）。
// 退魔の剣士（Iron's Spells の The Dead King）は、拠点で呼び出したものにだけ名前を付ける（server_scripts/structure_bases.js）。
// 最後の魔王（Call from the Depths の Deep darkest spawn）は、第1形態と第2形態の2つのモブの名前を変える。

ClientEvents.lang('ja_jp', event => {
  event.add('irons_spellbooks', 'school.irons_spellbooks.ender', '退魔の法')
  event.add('irons_spellbooks', 'attribute.irons_spellbooks.ender_spell_power', '退魔の法の力')
  event.add('irons_spellbooks', 'attribute.irons_spellbooks.ender_magic_resist', '退魔の法の耐性')
  event.add('minecraft', 'entity.minecraft.ender_dragon', '始祖の竜')
  event.add('cataclysm', 'entity.cataclysm.ender_guardian', '退魔の巨像')
  event.add('kenma', 'entity.kenma.exorcism_swordsman', '退魔の剣士')
  event.add('callfromthedepth_', 'entity.callfromthedepth_.deepdarkestspawn', '最後の魔王')
  event.add('callfromthedepth_', 'entity.callfromthedepth_.deepdarkestspwansecondphase', '最後の魔王')
  event.add('callfromthedepth_', 'item.callfromthedepth_.depth', '異界の鍵')
  event.add('kenma', 'item.kenma.exorcism_sword', '退魔の剣')
  event.add('kenma', 'item.kenma.exorcism_sword.description', '§7§o退魔の法が2つ込められた剣。手に持つと退魔の法の威力が上がる')
  event.add('kenma', 'message.kenma.demon_king_defeated', '最後の魔王が討たれた。王位は、ついに簒奪された')
  event.add('kenma', 'title.kenma.demon_king_defeated', '魔王討伐')
})

ClientEvents.lang('en_us', event => {
  event.add('irons_spellbooks', 'school.irons_spellbooks.ender', 'Exorcism')
  event.add('irons_spellbooks', 'attribute.irons_spellbooks.ender_spell_power', 'Exorcism Spell Power')
  event.add('irons_spellbooks', 'attribute.irons_spellbooks.ender_magic_resist', 'Exorcism Magic Resistance')
  event.add('minecraft', 'entity.minecraft.ender_dragon', 'Progenitor Dragon')
  event.add('cataclysm', 'entity.cataclysm.ender_guardian', 'Exorcist Colossus')
  event.add('kenma', 'entity.kenma.exorcism_swordsman', 'Exorcist Swordsman')
  event.add('callfromthedepth_', 'entity.callfromthedepth_.deepdarkestspawn', 'The Last Demon King')
  event.add('callfromthedepth_', 'entity.callfromthedepth_.deepdarkestspwansecondphase', 'The Last Demon King')
  event.add('callfromthedepth_', 'item.callfromthedepth_.depth', 'Key to the Otherworld')
  event.add('kenma', 'item.kenma.exorcism_sword', 'Exorcist Sword')
  event.add('kenma', 'item.kenma.exorcism_sword.description', '§7§oA sword holding two exorcism spells. Raises exorcism spell power while held.')
  event.add('kenma', 'message.kenma.demon_king_defeated', 'The Last Demon King has fallen. The throne has finally been usurped.')
  event.add('kenma', 'title.kenma.demon_king_defeated', 'Demon King Defeated')
})
