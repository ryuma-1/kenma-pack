// priority: 0

// 氷の魔術師（#58）の名前。拠点（イグルー）で呼び出した Iron's Spells の氷魔術師に付ける（server_scripts/structure_bases.js）。
// もとの氷魔術師の名前は変えない（Mountain Tower などにもとからいるものは氷の魔術師ではない）。
// 撃破報酬は server_scripts/ice_mage.js。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'entity.kenma.ice_mage', '氷の魔術師')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'entity.kenma.ice_mage', 'Ice Mage')
})
