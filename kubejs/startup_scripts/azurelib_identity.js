// priority: 0

// Cataclysm Spellbooks の杖・防具を AzureLib の「ID を持つアイテム」に登録する（#70）。
//
// AzureLib 3.0.9 で描くアイテムは、スタックの NBT の az_id（UUID）で動きの状態を覚える。
// az_id のないスタックを描くと、AzIdentifiableItemStackAnimatorCache.add が
// getUUID("az_id") を確かめずに読み、NullPointerException でクライアントが落ちる。
// クリエイティブ画面の、呪文を入れた杖（NBT が ISB_Spells だけ）がこれにあたる。
//
// AzIdentityRegistry に登録したアイテムは、AzureLib のミックスインが ItemStack を作るたびに
// az_id を付ける。Cataclysm Spellbooks 1.2.5 はこの登録をしていないので、ここで代わりにする。
// AzureLib 3.1 以降は直っているが、パッケージ名が変わり Cataclysm Spellbooks 1.2.5 が動かないので上げない。
//
// 対象は、Cataclysm Spellbooks が AzItemRendererRegistry・AzArmorRendererRegistry に渡すアイテムすべて
// （jar の CataclysmSpellbooks$ClientModEvents.onClientSetup から写した）。どれも重ならない（最大1個）ので、
// スタックごとに az_id が違っても困らない。
//
// 残る穴: /give などで NBT を丸ごと差し替えたスタックは az_id を失い、同じように落ちることがある。

const AzureIdentityRegistry = Java.loadClass('mod.azure.azurelib.rewrite.animation.cache.AzIdentityRegistry')

const AZURE_IDENTITY_ITEMS = [
  // 杖・魔導書・籠手・刀（AzItemRendererRegistry）
  'codex_of_malice_spell_book', 'disc_driver', 'spirit_sunderer', 'gauntlet_of_power', 'gauntlet_of_gattling',
  'the_nightstalker', 'the_berserker', 'the_combuster', 'burst_sheath', 'murasama_blade',
  // 防具（AzArmorRendererRegistry）
  'ignis_helmet', 'ignis_chestplate', 'ignis_chestplate_elytra', 'ignis_leggings', 'ignis_boots',
  'abyssal_warlock_helmet', 'abyssal_warlock_mask', 'abyssal_warlock_chestplate', 'abyssal_warlock_leggings', 'abyssal_warlock_boots',
  'cursium_mage_circlet', 'cursium_mage_chestplate', 'cursium_mage_elytra', 'cursium_mage_skirt', 'cursium_mage_boots',
  'pharaoh_helmet', 'pharaoh_chestplate', 'pharaoh_leggings', 'pharaoh_greaves',
  'bloom_stone_hat', 'bloom_stone_chestplate', 'bloom_stone_skirt', 'bloom_stone_greaves',
  'monstrous_wizard_hat',
  'engineer_hood', 'engineer_suit', 'engineer_leggings', 'engineer_boots',
  'excelsius_speed_visors', 'excelsius_speed_chestplate', 'excelsius_power_visors', 'excelsius_power_chestplate',
  'excelsius_resist_visors', 'excelsius_resist_chestplate', 'excelsius_leggings', 'excelsius_greaves',
].map(name => `cataclysm_spellbooks:${name}`)

StartupEvents.postInit(event => {
  let registered = 0
  AZURE_IDENTITY_ITEMS.forEach(id => {
    const item = Item.of(id).item
    if (item == null || Item.of(id).isEmpty()) {
      console.warn(`[azurelib_identity] アイテムが見つからない: ${id}`)
      return
    }
    AzureIdentityRegistry.register(item, [])
    registered++
  })
  console.info(`[azurelib_identity] AzureLib の ID 登録: ${registered}/${AZURE_IDENTITY_ITEMS.length}`)
})
