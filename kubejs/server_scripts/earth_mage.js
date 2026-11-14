// priority: 0

// 大地の魔術師（#47）の行動。登録と見た目は startup_scripts/earth_mage.js。
// 作中の大地の魔法（Pixiv 百科事典）は8つ。Iron's Spells の呪文との対応（2026-11-12、利用者と決定。#7）:
//   アースルート = root、ファイアフライ = firefly_swarm、アーススタンプ = earthquake、
//   アースヒール = kenma:earth_heal（自作。startup_scripts/earth_magic.js）、グラトニー = gluttony、
//   ブライト = blight、ポイズンスプラッシュ = poison_splash、ポイズンスプレー = poison_breath
// 魔術師が戦いで使うのは、このうち攻撃とデバフの6つ。回復とグラトニー（食べ物を魔力に変える）は、モブが使っても意味が薄いので使わない。

const EarthMageWizardAttackGoal = Java.loadClass('io.redspace.ironsspellbooks.entity.mobs.goals.WizardAttackGoal')
const EarthMageSpellRegistry = Java.loadClass('io.redspace.ironsspellbooks.api.registry.SpellRegistry')
const EarthMagePlayer = Java.loadClass('net.minecraft.world.entity.player.Player')

// getSpell は文字列版と ResourceLocation 版があり、型を書かないと Rhino が選べない（#45）。
const earthMageSpell = id => EarthMageSpellRegistry['getSpell(java.lang.String)'](id)

EntityJSEvents.addGoalSelectors('kenma:earth_mage', e => {
  e.floatSwim(0)
  // 攻撃・防御・移動・補助の呪文を、それぞれ配列で渡す。
  e.arbitraryGoal(2, entity => new EarthMageWizardAttackGoal(entity, 1.0, 40, 70).setSpells(
    [earthMageSpell('irons_spellbooks:root'), earthMageSpell('irons_spellbooks:firefly_swarm'),
      earthMageSpell('irons_spellbooks:earthquake'), earthMageSpell('irons_spellbooks:blight'),
      earthMageSpell('irons_spellbooks:poison_splash'), earthMageSpell('irons_spellbooks:poison_breath')],
    [],
    [],
    []))
  e.randomStroll(5, 0.8, 120, false)
  e.lookAtEntity(6, EarthMagePlayer, 12, 1, false)
})

// 倒されたら、次の13のうち、ランダムに2〜3つの巻物（同じものは出ない）を落とす（#7）。
//   作中の大地の魔法8つと、作中にはないが大地らしい既存の呪文5つ（2026-11-12、利用者と決定）。
//   淀みなどほかの継承者の魔法と重ならないものを選んだ（酸の唾液は淀み、砂や結晶の呪文は砂塵・結晶に回す）。
// レベルは1。ルーンで上げる想定（#51）。アースヒールだけは、作中に合わせてレベル10。封印石はルートテーブル（kubejs/data/kenma/loot_tables/entities/earth_mage.json）で落とす。
// 重ならないように選ぶのはルートテーブルではできないので、ここで作る。
// [呪文の ID, レベル]
const EARTH_MAGE_SCROLL_SPELLS = [
  ['irons_spellbooks:root', 1], ['irons_spellbooks:firefly_swarm', 1], ['irons_spellbooks:earthquake', 1],
  ['kenma:earth_heal', 10], ['irons_spellbooks:gluttony', 1], ['irons_spellbooks:blight', 1],
  ['irons_spellbooks:poison_splash', 1], ['irons_spellbooks:poison_breath', 1],
  // 作中にはない、大地らしい呪文
  ['irons_spellbooks:oakskin', 1], ['irons_spellbooks:stomp', 1], ['cataclysm_spellbooks:monolith_crash', 1],
  ['irons_spellbooks:poison_arrow', 1], ['irons_spellbooks:spider_aspect', 1],
]

EntityEvents.death('kenma:earth_mage', event => {
  // 何度も呼ばれる関数なので var で書く（boss_bar.js の注意を参照）。
  var spells = EARTH_MAGE_SCROLL_SPELLS.slice(), count = Math.random() < 0.5 ? 2 : 3, i, j, tmp
  for (i = spells.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    tmp = spells[i]; spells[i] = spells[j]; spells[j] = tmp
  }
  for (i = 0; i < count; i++) {
    // バニラの spawnAtLocation は、どの版を呼ぶか Rhino が決められない（引数の数を変えても同じ）ので、
    // KubeJS の popItem（そのブロックの位置にアイテムを落とす）を使う。
    event.entity.block.popItem(Item.of('irons_spellbooks:scroll',
      `{ISB_Spells:{data:[{id:"${spells[i][0]}",index:0,level:${spells[i][1]},locked:1b}],maxSpells:1,mustEquip:0b,spellWheel:0b}}`))
  }
})

// 狙う相手を決めるイベントは addGoals（addGoalTargets ではない。#45）。
EntityJSEvents.addGoals('kenma:earth_mage', e => {
  e.hurtByTarget(1, [], true, [])
  e.nearestAttackableTarget(2, EarthMagePlayer, 10, true, false, t => true)
})
