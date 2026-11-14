// priority: 0

// 砂塵の魔術師と、自作の砂塵の魔法（#61）の名前と説明。魔法の登録は startup_scripts/sand_magic.js。
// 砂塵の魔術師は Cataclysm の Ancient Remnant の名前を変えたもの（ボスバーの名前も変わる）。撃破報酬は server_scripts/sand_mage.js。

ClientEvents.lang('ja_jp', event => {
  event.add('cataclysm', 'entity.cataclysm.ancient_remnant', '砂塵の魔術師')
  event.add('kenma', 'spell.kenma.primal_curse', 'プライマルカース')
  event.add('kenma', 'spell.kenma.primal_curse.guide', 'しばらくの間、自分のあらゆる攻撃に、防御や加護を貫く確定ダメージを上乗せする。手数の多い攻撃ほど強い。')
  event.add('kenma', 'effect.kenma.primal_curse', '原初の呪い')
  event.add('kenma', 'death.attack.kenma.primal_curse', '%1$sは砂塵に還った')
  event.add('kenma', 'death.attack.kenma.primal_curse.player', '%1$sは%2$sの原初の呪いで砂塵に還った')
})

ClientEvents.lang('en_us', event => {
  event.add('cataclysm', 'entity.cataclysm.ancient_remnant', 'Sand Mage')
  event.add('kenma', 'spell.kenma.primal_curse', 'Primal Curse')
  event.add('kenma', 'spell.kenma.primal_curse.guide', 'For a while, every attack you make deals extra true damage that pierces all defenses. Stronger with rapid attacks.')
  event.add('kenma', 'effect.kenma.primal_curse', 'Primal Curse')
  event.add('kenma', 'death.attack.kenma.primal_curse', '%1$s returned to dust')
  event.add('kenma', 'death.attack.kenma.primal_curse.player', '%1$s returned to dust by the primal curse of %2$s')
})
