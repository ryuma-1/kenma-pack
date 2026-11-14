// priority: 0

// 獣人の墓守（#59）の名前。Keepers of the Stones II の Energium Golem の名前を変える（ボスバーの名前も変わる）。
// 撃破報酬は server_scripts/beast_gravekeeper.js。

ClientEvents.lang('ja_jp', event => {
  event.add('power', 'entity.power.energium_golem', '獣人の墓守')
})

ClientEvents.lang('en_us', event => {
  event.add('power', 'entity.power.energium_golem', 'Beastfolk Gravekeeper')
})
