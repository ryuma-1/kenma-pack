// priority: 0

// 大地の魔術師（#47、#7 の最初の継承者）。有料の SKOG THE TREE FOLK の代わりに、魔法を使うモブを自作する。
// 見た目: Iron's Spells の人型のモデル（場所を指定して読むだけ）に、自作のテクスチャとアニメーションを貼る。
//   テクスチャ: kubejs/assets/kenma/textures/entity/earth_mage.png（tools/textures/earth_mage.py で描く）
//   アニメーション: kubejs/assets/kenma/animations/entity/earth_mage.animation.json
// EntityJS のモブの描画には防具を描く仕組みがないので、ローブはテクスチャに描き込んである。
// 行動（使う呪文、狙う相手）は server_scripts/earth_mage.js。名前は client_scripts/earth_mage.js。
// 倒したときに落とす物: 大地の封印石はルートテーブル、大地の魔法8つからランダムに2〜3つの巻物は
//   server_scripts/earth_mage.js。レベルはルーンで上げる想定（#51）。
// 体力などの数値は仮。L2 Hostility が自作ボスにどう効くかを決めてから決める（#7、#4）。

StartupEvents.registry('entity_type', event => {
  event.create('kenma:earth_mage', 'irons_spells_js:spellcasting')
    .sized(0.6, 1.95)
    .modelResource(entity => 'irons_spellbooks:geo/abstract_casting_mob.geo.json')
    .textureResource(entity => 'kenma:textures/entity/earth_mage.png')
    .animationResource(entity => 'kenma:animations/entity/earth_mage.animation.json')
    // この関数は true / false を返す（true で再生を続ける）。thenLoop の結果（PlayState）を返すと、
    // クライアントが描画のたびに「Cannot convert CONTINUE to boolean」で落ちる。
    .addAnimationController('main', 4, e => {
      if (e.entity.isCasting()) e.thenLoop('cast')
      else if (e.isMoving()) e.thenLoop('walk')
      else e.thenLoop('idle')
      return true
    })
    // ボスバー（緑）。部品は startup_scripts/boss_bar.js。
    .tick(entity => global.kenmaBossBar.tick(entity, 'green'))
})

EntityJSEvents.attributes(event => {
  event.modify('kenma:earth_mage', attributes => {
    // 体力は、等級（第四）の値で上書きする（server_scripts/grades.js、kubejs/config/grades.json）。
    attributes.add('minecraft:generic.max_health', 100)
    attributes.add('minecraft:generic.movement_speed', 0.25)
    attributes.add('minecraft:generic.follow_range', 32)
    attributes.add('minecraft:generic.armor', 4)
  })
})
