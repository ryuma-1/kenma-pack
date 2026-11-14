// priority: 0

// 帝国近衛騎士（#63）の名前。拠点で呼び出した Cataclysm のマレディクタスに付ける（server_scripts/structure_bases.js）。
// もとのマレディクタスの名前は変えない（Frosted Prison の墓石から呼び出すものは帝国近衛騎士ではない）。
// 撃破報酬は server_scripts/imperial_guard.js。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'entity.kenma.imperial_guard', '帝国近衛騎士')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'entity.kenma.imperial_guard', 'Imperial Royal Guard')
})
