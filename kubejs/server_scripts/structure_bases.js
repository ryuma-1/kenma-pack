// priority: 0

// 構造物を拠点にして、ボスを呼び出す仕組み（2026-11-12、利用者と決定）。
// もとの構造物のファイルは書き換えず、プレイヤーが構造物の範囲（部品の範囲）に入ったら、
// その構造物ごとに1回だけ、近くの足場のある場所にボスを呼び出す。
// 呼び出した構造物は、サーバーの永続データに、次元と構造物の起点のチャンクで記録する。
// 呼び出したボスには、目印のタグ kenma_heir を付ける（KENMA_HEIR_TAG）。
//
// 継承者のボスは、1つの拠点にだけ出るようにする（2026-11-13、利用者と決定）。
// ボスのモブが拠点以外の構造物にももとからいる場合（アプトルガングルは Frosted Prison、Wadjet は Cursed Pyramid、
// 氷魔術師は Mountain Tower など）は、
// 言語ファイルでモブの名前を変えず、ここで呼び出したものにだけ name の名前を付ける。
// 撃破報酬・魂・ボスバーも、目印のタグの付いたものにだけ付ける（各ボスの server_scripts と boss_souls.js、boss_bar.js）。
//
// 拠点を足すときは、KENMA_STRUCTURE_BASES に1行足す。
//   structure: 構造物の ID、boss: 呼び出すモブの ID、data: 記録に使う永続データの名前、sound: 現れたときの音、particle: 粒子、
//   name: 呼び出したものに付ける名前の翻訳キー（なくてもよい。名前は client_scripts で付ける）、
//   spawnAt: 呼び出す場所。なければプレイヤーの近く。'lowest_piece' なら、構造物のいちばん低い部品の中（中心に近い床）、
//   spawnPiece: spawnAt が 'lowest_piece' のとき、名前にこの文字列を含む部品だけから選ぶ、
//   nbt: 呼び出すときにボスに足す NBT（なくてもよい）
const KENMA_STRUCTURE_BASES = [
  // 大地の魔術師（#7）: Feur Extension Jungle の大きなジャングルの木（45×48×40）
  { structure: 'feur_extension_jungle:tree_giant', boss: 'kenma:earth_mage', data: 'kenmaEarthMageBases',
    sound: 'minecraft:block.grass.break', particle: 'minecraft:happy_villager' },
  // 星降りの聖職者（#54）: Iron's Spells の Mountain Tower（山の上の塔。2026-11-13、利用者がゲームの中で選んだ）
  //   はじめは Cataclysm の Cursed Pyramid にもとからいる Wadjet を使っていたが、同じピラミッドの Ancient Remnant を
  //   砂塵の魔術師（#61）にするので、ここで呼び出す形に変えた。塔にもとからいる3体の氷魔術師は、ただの敵（継承者ではない）。
  { structure: 'irons_spellbooks:mountain_tower', boss: 'cataclysm:wadjet', data: 'kenmaAstralPriestBases',
    sound: 'minecraft:block.beacon.power_select', particle: 'minecraft:end_rod', name: 'entity.kenma.astral_priest' },
  // 氷の魔術師（#58）: バニラのイグルー（Remastered Structure が、雪と青い氷の城（25×26×25）に作り替えている。
  //   2026-11-13、利用者がゲームの中で選んだ）。はじめは Mountain Tower にもとからいる3体の氷魔術師を使っていた。
  { structure: 'minecraft:igloo', boss: 'irons_spellbooks:cryomancer', data: 'kenmaIceMageBases',
    sound: 'minecraft:entity.player.hurt_freeze', particle: 'minecraft:snowflake', name: 'entity.kenma.ice_mage' },
  // 淀みの剣士（#53）: Feur Extension Jungle のジャングルのピラミッド（約66×48×66）
  { structure: 'feur_extension_jungle:pyramid', boss: 'cataclysm:aptrgangr', data: 'kenmaStagnationSwordsmanBases',
    sound: 'minecraft:entity.wither.ambient', particle: 'minecraft:witch', name: 'entity.kenma.stagnation_swordsman' },
  // 召喚の魔術師（#57）: IDAS の古代の鉱山（山の斜面に入り口がある鉱山。作中の「鉱山」。2026-11-13、利用者と決定）
  //   鉱山の最下部の大きな広間（hall1〜hall4 の4つの部品で1つの広間）の中央に呼び出す（2026-11-13、利用者と決定）。
  //   プレイヤーが入り口に来た時点で、広間に呼び出しておく。
  //   ボスは Cataclysm のハービンジャー（2026-11-13、利用者と決定。アーキヴォーカーから変更）。呼び出した直後は停止しているので、
  //   起動した状態（Is_Act）で呼び出す。
  { structure: 'idas:ancient_mines', boss: 'cataclysm:the_harbinger', data: 'kenmaSummonerMageBases', nbt: { Is_Act: true },
    sound: 'minecraft:entity.evoker.prepare_summon', particle: 'minecraft:enchant', name: 'entity.kenma.summoner_mage',
    spawnAt: 'lowest_piece', spawnPiece: 'ancient_mines_hall' },
  // 竜狩りの末裔（#62）: Nordic Structures の巨大なバイキングの砦（雪の平原。作中の「北の集落」「雪原の戦い」。2026-11-13、利用者と決定）
  { structure: 'nordic_structures:giant_vikingfort', boss: 'cataclysm:scylla', data: 'kenmaDragonSlayerBases',
    sound: 'minecraft:entity.lightning_bolt.thunder', particle: 'minecraft:electric_spark', name: 'entity.kenma.dragon_slayer' },
  // 帝国近衛騎士（#63）: Cavernous（OpenLoader のデータパック）の地下の城塞 The Citadel（洞窟のバイオーム the_undergrowth にだけ出る。
  //   作中の「禁足地」。利用者がゲームの中で選んだ。2026-11-13、利用者と決定）
  { structure: 'cavernous:the_citadel', boss: 'cataclysm:maledictus', data: 'kenmaImperialGuardBases',
    sound: 'minecraft:entity.ravager.roar', particle: 'minecraft:soul_fire_flame', name: 'entity.kenma.imperial_guard' },
]

const KENMA_HEIR_TAG = 'kenma_heir'
global.kenmaHeirTag = KENMA_HEIR_TAG

const StructureBasesRegistries = Java.loadClass('net.minecraft.core.registries.Registries')
const StructureBasesResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

global.kenmaStructureBases = {
  // pos がその構造物の範囲の中なら、その構造物の StructureStart を返す。なければ null。
  // 何度も呼ばれる関数なので var で書く（startup_scripts/boss_bar.js の注意を参照）。
  findStart(level, pos, structureId) {
    var structure, start
    structure = level.registryAccess().registryOrThrow(StructureBasesRegistries.STRUCTURE)
      .get(new StructureBasesResourceLocation(structureId))
    if (structure == null) return null
    // getStructureWithPieceAt は引数の型の違う版がいくつもあるが、Structure を渡せば Rhino がその版を選ぶ。
    // 型を書いて呼ぶ形（'name(型)'）は、バニラのクラスでは名前の変換が効かないので使えない。
    start = level.structureManager().getStructureWithPieceAt(pos, structure)
    return start != null && start.isValid() ? start : null
  },

  // 足元が固く、2ブロック分の空きがある場所を、center の近くから探す。見つからなければ center。
  findSpawnPos(level, center) {
    var r, dx, dz, dy, p
    for (r = 3; r <= 8; r++) {
      for (dx = -r; dx <= r; dx++) {
        for (dz = -r; dz <= r; dz++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue
          for (dy = -3; dy <= 3; dy++) {
            p = center.offset(dx, dy, dz)
            if (level.getBlockState(p.below()).isSolid() && level.getBlockState(p).isAir() && level.getBlockState(p.above()).isAir()) return p
          }
        }
      }
    }
    return center
  },

  // 構造物の部品のうち、名前に pieceName を含むもの（pieceName がなければすべて）の中から、範囲の下端がいちばん低い部品を選ぶ。
  // 同じ高さの部品がいくつも並んでいれば（古代の鉱山の最下部の広間は hall1〜hall4 の4つで1つの広間）、それらをまとめた範囲を使う。
  // その範囲の中心に近い順に、下の段から、足元が固く2ブロック分の空きがある場所を探す。見つからなければ null。
  findPieceSpawn(level, start, pieceName) {
    // getPieces() は Java の不変リストで、Rhino から size や get を呼べないので、ArrayList に写してから使う。
    var pieces = new (Java.loadClass('java.util.ArrayList'))(start.getPieces()), boxes = [], minY = null
    var i, pc, box, x0, x1, z0, z1, y0, y1, y, x, z, cx, cz, r, rMax, p, BlockPos
    for (i = 0; i < pieces.size(); i++) {
      pc = pieces.get(i)
      // 部品の名前は、ジグソーの部品なら getElement() の文字列（例: Single[Left[idas:ancient_mines/ancient_mines_hall1]]）に入っている。
      if (pieceName && String(pc.getElement ? pc.getElement() : pc).indexOf(pieceName) < 0) continue
      box = pc.getBoundingBox()
      boxes.push(box)
      if (minY == null || box.minY() < minY) minY = box.minY()
    }
    if (minY == null) return null
    x0 = null
    for (i = 0; i < boxes.length; i++) {
      box = boxes[i]
      if (box.minY() !== minY) continue
      if (x0 == null) { x0 = box.minX(); x1 = box.maxX(); z0 = box.minZ(); z1 = box.maxZ(); y1 = box.maxY() }
      x0 = Math.min(x0, box.minX()); x1 = Math.max(x1, box.maxX())
      z0 = Math.min(z0, box.minZ()); z1 = Math.max(z1, box.maxZ()); y1 = Math.max(y1, box.maxY())
    }
    y0 = minY
    BlockPos = Java.loadClass('net.minecraft.core.BlockPos')
    cx = Math.floor((x0 + x1) / 2)
    cz = Math.floor((z0 + z1) / 2)
    rMax = Math.max(x1 - x0, z1 - z0)
    for (r = 0; r <= rMax; r++) {
      for (y = y0 + 1; y <= y1 - 1; y++) {
        for (x = cx - r; x <= cx + r; x++) {
          for (z = cz - r; z <= cz + r; z++) {
            if (Math.abs(x - cx) !== r && Math.abs(z - cz) !== r) continue
            if (x < x0 || x > x1 || z < z0 || z > z1) continue
            p = new BlockPos(x, y, z)
            if (level.getBlockState(p.below()).isSolid() && level.getBlockState(p).isAir() && level.getBlockState(p.above()).isAir()) return p
          }
        }
      }
    }
    return null
  },

  // プレイヤーがその拠点の構造物の範囲にいて、その構造物でまだ呼び出していなければ、ボスを呼び出す。呼び出したら true。
  check(server, level, pos, base) {
    var start, key, data, boss, spawn
    start = this.findStart(level, pos, base.structure)
    if (start == null) return false
    // KubeJS では level.dimension は関数ではなく、次元の ID（ResourceLocation）を返す値になっている。
    key = String(level.dimension) + '@' + start.getChunkPos().toLong()
    data = server.persistentData.getCompound(base.data)
    if (data.getBoolean(key)) return false
    spawn = null
    if (base.spawnAt === 'lowest_piece') spawn = this.findPieceSpawn(level, start, base.spawnPiece)
    if (spawn == null) spawn = this.findSpawnPos(level, pos)
    boss = level.createEntity(base.boss)
    boss.setPosition(spawn.x + 0.5, spawn.y, spawn.z + 0.5)
    boss.setPersistenceRequired()
    boss.addTag(KENMA_HEIR_TAG)
    if (base.name) boss.setCustomName(Text.translate(base.name))
    if (base.nbt) boss.mergeNbt(base.nbt)
    boss.spawn()
    level.playSound(null, spawn.x, spawn.y, spawn.z, base.sound, 'hostile', 2.0, 0.6)
    level.spawnParticles(base.particle, true, spawn.x + 0.5, spawn.y + 1, spawn.z + 0.5, 1, 1, 1, 30, 0.1)
    data.putBoolean(key, true)
    server.persistentData.put(base.data, data)
    return true
  },
}

// 1秒ごとに、各プレイヤーの位置を見る。
PlayerEvents.tick(event => {
  var player = event.player, i
  if (player.age % 20 !== 0 || player.isSpectator()) return
  for (i = 0; i < KENMA_STRUCTURE_BASES.length; i++) {
    global.kenmaStructureBases.check(event.server, player.level, player.blockPosition(), KENMA_STRUCTURE_BASES[i])
  }
})
