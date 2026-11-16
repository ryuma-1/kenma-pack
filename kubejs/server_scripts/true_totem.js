// priority: 0

// 本物のトーテム（#128。2026-11-16、利用者と決定）。アイテムの登録は startup_scripts/true_totem.js。
// Curios の charm の枠に着けていると、死ぬはずのときに、不死のトーテムと同じことが起きる
// （体力1で踏みとどまり、効果をすべて消して、再生II 45秒・衝撃吸収II 5秒・火炎耐性 40秒）。
// 壊れない。防いだあと TRUE_TOTEM_COOLDOWN_SECONDS は効かない（待っている間は、アイテムに待ち時間の表示が出る）。
// 待ち時間の終わりはプレイヤーの persistentData に覚えるので、入り直しても縮まない。
// 手に不死のトーテムを持っていれば、バニラのトーテムが先に使われる（死ぬ前のバニラの処理で止まるため）。
// 奈落と /kill は、不死のトーテムと同じく防がない。
// 防いだとき、その場所を覚えた L2 Complements の壊れやすいワープ石（fragile_warp_stone）を1個渡す（2026-11-16、利用者と決定）。
// 右クリックで覚えた場所へ戻れる（次元が違っても戻れる）。1回使うと消える。夢のトーテムが渡すものと同じ。

const TRUE_TOTEM_ID = 'kenma:true_totem'
const TRUE_TOTEM_COOLDOWN_SECONDS = 60
const TRUE_TOTEM_UNTIL_KEY = 'kenma_true_totem_until'
const TrueTotemCuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')
const TrueTotemDamageTypeTags = Java.loadClass('net.minecraft.tags.DamageTypeTags')
const TrueTotemWarpStone = Java.loadClass('dev.xkmc.l2complements.content.item.misc.WarpStone')

ServerEvents.tags('item', event => {
  event.add('curios:charm', TRUE_TOTEM_ID)
})

global.kenmaTrueTotem = {
  // charm の枠などに着けていれば true。
  equipped(player) {
    var inv = TrueTotemCuriosApi.getCuriosInventory(player).resolve()
    if (!inv.isPresent()) return false
    return inv.get().findFirstCurio(Item.of(TRUE_TOTEM_ID).getItem()).isPresent()
  },

  // 今いる場所を覚えた、壊れやすいワープ石。
  warpStone(player) {
    var stone = Item.of('l2complements:fragile_warp_stone')
    TrueTotemWarpStone.setPos(stone, player.level, player.getX(), player.getY(), player.getZ())
    return stone
  },

  onDeath(event) {
    var player = event.entity, now, until, item
    if (event.source.is(TrueTotemDamageTypeTags.BYPASSES_INVULNERABILITY)) return
    if (!this.equipped(player)) return
    now = player.level.getGameTime()
    until = player.persistentData.getLong(TRUE_TOTEM_UNTIL_KEY)
    if (now < until) return
    event.cancel()
    player.persistentData.putLong(TRUE_TOTEM_UNTIL_KEY, now + TRUE_TOTEM_COOLDOWN_SECONDS * 20)
    item = Item.of(TRUE_TOTEM_ID).getItem()
    player.getCooldowns().addCooldown(item, TRUE_TOTEM_COOLDOWN_SECONDS * 20)
    player.setHealth(1)
    player.removeAllEffects()
    player.potionEffects.add('minecraft:regeneration', 900, 1)
    player.potionEffects.add('minecraft:absorption', 100, 1)
    player.potionEffects.add('minecraft:fire_resistance', 800, 0)
    // 35 は不死のトーテムが発動したときの合図（画面のトーテムの動きと音、粒子）。
    player.level.broadcastEntityEvent(player, 35)
    player.give(this.warpStone(player))
    player.tell(Text.translate('message.kenma.true_totem', String(TRUE_TOTEM_COOLDOWN_SECONDS)).gold())
    console.info(`true_totem: ${player.username} の死を防いだ`)
  },
}

EntityEvents.death('minecraft:player', event => {
  try {
    global.kenmaTrueTotem.onDeath(event)
  } catch (e) {
    console.error(`true_totem: ${e}`)
  }
})
