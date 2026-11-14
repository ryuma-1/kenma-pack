// priority: 0

// 自作のルーン（#51）。ルーンで巻物の呪文のレベルを上げる仕組み（server_scripts/rune_upgrade.js）のために、
// ルーンのない系統の分を作る（2026-11-14、利用者と決定）。
//   淀みのルーン（kenma:stagnation_rune）: 自作の淀みの系統（startup_scripts/stagnation_magic.js）
//   異界のルーン（kenma:eldritch_rune）  : Iron's Spells の異界の系統（もとからルーンがない）
// 作り方は Iron's Spells のルーンと同じく、空のルーン1個をその系統の触媒8個で囲む（server_scripts/rune_upgrade.js）。
// 名前は client_scripts/runes.js、テクスチャは tools/textures/runes.py で描く。
// 登録なので、変えたらサーバーの再起動が要る。

StartupEvents.registry('item', event => {
  event.create('kenma:stagnation_rune')
  event.create('kenma:eldritch_rune')
})
