// priority: 0

// 本物のトーテム（#128）の名前と説明。仕組みは server_scripts/true_totem.js。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'item.kenma.true_totem', '本物のトーテム')
  event.add('kenma', 'item.kenma.true_totem.description', '装備の枠（チャーム）に着けると、死を防ぎ、その場所に戻れるワープ石をくれる。壊れないが、防いだあと1分は効かない')
  event.add('kenma', 'message.kenma.true_totem', '本物のトーテムが死を防いだ（%s 秒は効かない）。この場所に戻れるワープ石を受け取った')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'item.kenma.true_totem', 'True Totem')
  event.add('kenma', 'item.kenma.true_totem.description', 'Wear it in the charm slot to cheat death and get a warp stone back to that spot. It never breaks, but rests for 1 minute after use.')
  event.add('kenma', 'message.kenma.true_totem', 'The True Totem saved you from death (inactive for %s seconds). You received a warp stone back to this spot.')
})

ItemEvents.tooltip(event => {
  event.add('kenma:true_totem', Text.translate('item.kenma.true_totem.description').gray())
})
