// priority: 0

// ボスバー（#47）。部品は startup_scripts/boss_bar.js。
//
// 既存の MOD のモブで、もとのボスバーがない継承者には、ここでボスバーを付ける（10 tick ごとに見回る）。
// [モブの ID, 色, 目印のタグ（そのタグの付いたモブだけ。null ならそのモブすべて）]
// Cataclysm のイグニスやリヴァイアサンのように、もとからボスバーがあるものは入れない。
const KENMA_EXISTING_BOSS_BARS = [
  ['cataclysm:aptrgangr', 'purple', 'kenma_heir'], // 淀みの剣士（#53）。拠点で呼び出したものだけ
  ['cataclysm:wadjet', 'yellow', 'kenma_heir'], // 星降りの聖職者（#54）。拠点で呼び出したものだけ
  ['irons_spellbooks:cryomancer', 'blue', 'kenma_heir'], // 氷の魔術師（#58）。拠点で呼び出したものだけ
]

// 拠点で呼び出したボス（目印のタグ kenma_heir）で、もとの MOD のボスバーを持つもの（Cataclysm のスキュラなど）は、
// ボスバーの名前がモブを作ったときの名前のままで、あとから付けた名前（竜狩りの末裔など）にならない。
// そこで、ボスバーを入れている欄（Cataclysm は bossEvent、マレディクタスは bossEvent1 と bossEvent2）を Java のリフレクションで読み、
// 名前を付けた名前に合わせる。サーバーを再起動するとモブが作り直されて元に戻るので、見回りのたびに合わせる。
const KENMA_BOSS_EVENT_FIELDS = ['bossEvent', 'bossEvent1', 'bossEvent2', 'bossInfo']

function kenmaSyncBossBarName(entity) {
  var name = entity.customName, i, f, bar, cls
  if (name == null) return
  for (i = 0; i < KENMA_BOSS_EVENT_FIELDS.length; i++) {
    bar = null
    for (cls = entity.getClass(); cls != null && bar == null; cls = cls.getSuperclass()) {
      try {
        f = cls.getDeclaredField(KENMA_BOSS_EVENT_FIELDS[i])
        f.setAccessible(true)
        bar = f.get(entity)
      } catch (err) { bar = null }
    }
    if (bar != null && bar.getName && !bar.getName().equals(name)) bar.setName(name)
  }
}

ServerEvents.tick(event => {
  var tick = event.server.tickCount
  if (tick % 10 === 0) {
    event.server.entities.forEach(entity => {
      var type = entity.type, i, entry
      if (entity.tags.contains('kenma_heir') && entity.isAlive()) kenmaSyncBossBarName(entity)
      for (i = 0; i < KENMA_EXISTING_BOSS_BARS.length; i++) {
        entry = KENMA_EXISTING_BOSS_BARS[i]
        if (type != entry[0]) continue
        if (entry[2] && !entity.tags.contains(entry[2])) continue
        if (entity.isAlive()) global.kenmaBossBar.tick(entity, entry[1], true)
      }
    })
  }
  // モブが倒されたり、チャンクごと読み込まれなくなったりしたら、残ったボスバーを消す（1 秒ごと）。
  if (tick % 20 === 0) global.kenmaBossBar.cleanUp()
})
