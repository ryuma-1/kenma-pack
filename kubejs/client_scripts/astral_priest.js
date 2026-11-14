// priority: 0

// 星降りの聖職者と、自作の聖の魔法（#54）の名前と説明。魔法の登録は startup_scripts/holy_magic.js。
// 星降りの聖職者の名前は、拠点（Mountain Tower）で呼び出した Cataclysm の Wadjet に付ける（server_scripts/structure_bases.js）。
// もとの Wadjet の名前は変えない（Cursed Pyramid にもとからいるものは星降りの聖職者ではない）。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'entity.kenma.astral_priest', '星降りの聖職者')
  event.add('kenma', 'spell.kenma.sanctify', 'サンクティファイ')
  event.add('kenma', 'spell.kenma.sanctify.guide', '自分にかかった悪い効果だけを浄化し、少しのあいだ体力を再生させる。')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'entity.kenma.astral_priest', 'Astral Priest')
  event.add('kenma', 'spell.kenma.sanctify', 'Sanctify')
  event.add('kenma', 'spell.kenma.sanctify.guide', 'Cleanse only the harmful effects on yourself and regenerate health for a short time.')
})
