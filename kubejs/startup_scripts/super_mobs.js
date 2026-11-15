// priority: 0

// スーパーゾンビ・スーパークリーパー（#116）。Forge のイベントは起動時スクリプトでしか登録できないので、ここに置く。
// 中身は server_scripts/super_mobs.js の global.kenmaSuperMobs.roll にある（/reload で読み直される）。
// このファイルを変えたときだけ、再起動が要る。
//
// モブが湧いて初期化されるとき（ワールドに入る前）に呼ばれる。湧き方が自然（NATURAL）のものだけを渡す。

ForgeEvents.onEvent('net.minecraftforge.event.entity.living.MobSpawnEvent$FinalizeSpawn', event => {
  try {
    var s = global.kenmaSuperMobs
    if (s == null || String(event.getSpawnType()) !== 'NATURAL') return
    s.roll(event.getEntity())
  } catch (e) {
    console.error(`super_mobs: ${e}`)
  }
})
