// priority: 0

// Hostility Orb を受け取ったときの知らせ（#124）。配る処理は server_scripts/danger.js の giveOrbs。

ClientEvents.lang('ja_jp', event => {
  event.add('kenma', 'message.kenma.hostility_orb', '危険度が上がり、Hostility Orb を %s 個受け取った（使うと、周りでレベルの付いた敵が湧かなくなる）')
})

ClientEvents.lang('en_us', event => {
  event.add('kenma', 'message.kenma.hostility_orb', 'The danger has risen. You received %s Hostility Orb(s). Use one to stop leveled mobs from spawning nearby.')
})
