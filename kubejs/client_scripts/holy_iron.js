// priority: 0

// 聖鉄: Elliemore's Deep Waters の flaming opal（deepwaters:fopal）を改名する（#5）。
// テクスチャは kubejs/assets/deepwaters/textures/ で差し替える。生成は config/openloader/data/kenma/ で変える。
// 注意: ファンサイトの日本語化リソースパックを入れると、そちらの訳が優先される（KubeJS のパックより上に積まれるため）。

const HOLY_IRON_NAMES = {
  'item.deepwaters.fopal': ['聖鉄', 'Holy iron'],
  'block.deepwaters.fopalorestone': ['聖鉄鉱石', 'Holy iron ore'],
  'block.deepwaters.fopaloredeepslate': ['深層岩の聖鉄鉱石', 'Deepslate holy iron ore'],
  'block.deepwaters.fopal_block': ['聖鉄ブロック', 'Block of holy iron'],
  'block.deepwaters.fopalcrystall': ['聖鉄の結晶', 'Holy iron crystal'],
  'block.deepwaters.fopalchandelier': ['聖鉄のシャンデリア', 'Holy iron chandelier'],
  'item.deepwaters.fopalsword': ['聖鉄の剣', 'Holy iron sword'],
  'item.deepwaters.fopalpick': ['聖鉄のツルハシ', 'Holy iron pickaxe'],
  'item.deepwaters.fopalaxe': ['聖鉄の斧', 'Holy iron axe'],
  'item.deepwaters.fopalshovel': ['聖鉄のシャベル', 'Holy iron shovel'],
  'item.deepwaters.fopalshield': ['聖鉄の盾', 'Holy iron shield'],
  'item.deepwaters.fopal_trident': ['聖鉄のトライデント', 'Holy iron trident'],
}

// 名前空間を必ず渡す。event.add(key, value) は minecraft の名前空間に入り、
// 同じ言語の中では名前空間の読み込み順で deepwaters の en_us.json に負けることがある。
ClientEvents.lang('ja_jp', event => {
  for (const [key, names] of Object.entries(HOLY_IRON_NAMES)) event.add('deepwaters', key, names[0])
})

ClientEvents.lang('en_us', event => {
  for (const [key, names] of Object.entries(HOLY_IRON_NAMES)) event.add('deepwaters', key, names[1])
})
