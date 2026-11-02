/* Pocket Shop – private/offline shopping list. No network APIs, no libraries. */
(() => {
'use strict';
const STORE = {
  super: {label:'スーパー', emoji:'🥬'},
  drug: {label:'ドラッグストア', emoji:'🧴'},
  conbini: {label:'コンビニ', emoji:'🏪'},
  home: {label:'ホームセンター', emoji:'🛠️'},
  hundred: {label:'100円ショップ', emoji:'🧺'},
  online: {label:'ネット通販', emoji:'📦'},
  other: {label:'その他', emoji:'🛍️'}
};
const CATEGORY = {
  fresh: {label:'野菜・果物', emoji:'🥕'},
  food: {label:'食品・飲料', emoji:'🥛'},
  beauty: {label:'美容・スキンケア', emoji:'🧴'},
  hygiene: {label:'衛生・ヘルスケア', emoji:'🪥'},
  household: {label:'日用品・掃除', emoji:'🧽'},
  clothes: {label:'衣類・雑貨', emoji:'👕'},
  hobby: {label:'文具・その他', emoji:'✏️'}
};
const CATALOG = [
  ['banana','super','fresh',['バナナ','ばなな']],
  ['apple','super','fresh',['りんご','リンゴ','林檎']],
  ['carrot','super','fresh',['にんじん','ニンジン','人参','大根','だいこん','きゅうり','レタス','キャベツ','じゃがいも','玉ねぎ','たまねぎ']],
  ['tomato','super','fresh',['トマト','とまと','ミニトマト']],
  ['milk','super','food',['牛乳','ミルク','豆乳','飲むヨーグルト']],
  ['eggs','super','food',['卵','たまご','玉子']],
  ['bread','super','food',['パン','食パン','クロワッサン','ベーグル']],
  ['rice','super','food',['お米','米','ご飯','ごはん','白米']],
  ['noodles','super','food',['パスタ','うどん','そば','蕎麦','ラーメン','そうめん','麺','カップヌードル']],
  ['fish','super','food',['魚','鮭','サーモン','まぐろ','刺身','さば','サバ']],
  ['meat','super','food',['お肉','肉','鶏肉','豚肉','牛肉','ハム','ベーコン','ウインナー']],
  ['water','super','food',['水','ミネラルウォーター','炭酸水','お茶','麦茶','ジュース']],
  ['coffee','super','food',['コーヒー','珈琲','紅茶','緑茶']],
  ['snack','super','food',['お菓子','おかし','ポテチ','ポテトチップス','チョコ','スナック','クッキー','せんべい']],
  ['icecream','super','food',['アイス','アイスクリーム']],
  ['tofu','super','food',['豆腐','納豆','こんにゃく']],
  ['oil','super','food',['サラダ油','オリーブオイル','ごま油','調味料','醤油','しょうゆ','塩','砂糖','みりん','ケチャップ','マヨネーズ']],
  ['lotion','drug','beauty',['化粧水','乳液','美容液','保湿クリーム','フェイスクリーム','フェイスパック','クレンジング','乳液','メイク落とし','リップクリーム']],
  ['sunscreen','drug','beauty',['日焼け止め','UVクリーム','UVケア']],
  ['shampoo','drug','beauty',['シャンプー','コンディショナー','トリートメント','ヘアオイル']],
  ['toothpaste','drug','hygiene',['歯磨き粉','歯みがき粉','ハミガキ']],
  ['toothbrush','drug','hygiene',['歯ブラシ','歯ぶらし','フロス','デンタルフロス']],
  ['soap','drug','hygiene',['ボディソープ','石けん','石鹸','洗顔','ハンドソープ']],
  ['medicine','drug','hygiene',['薬','風邪薬','目薬','絆創膏','ばんそうこう','マスク','サプリ','頭痛薬']],
  ['tissue','drug','household',['ティッシュ','ティシュー','ウエットティッシュ','ウェットティッシュ','キッチンペーパー']],
  ['toiletpaper','drug','household',['トイレットペーパー','トイペ']],
  ['detergent','drug','household',['洗濯洗剤','食器洗剤','洗剤','柔軟剤','漂白剤','消臭剤','掃除用洗剤','バスマジックリン','洗濯用洗剤']],
  ['bag','drug','household',['ゴミ袋','ごみ袋','ポリ袋','ジップロック','保存袋']],
  ['battery','home','household',['電池','乾電池','単三','単四','充電池']],
  ['pen','hundred','hobby',['ノート','ペン','ボールペン','付箋','文房具','消しゴム','鉛筆']],
  ['clothing','other','clothes',['服','シャツ','靴下','下着','タオル','パジャマ','Tシャツ']],
  ['pet','home','household',['ペットフード','猫砂','ドッグフード','キャットフード']],
  ['flower','home','hobby',['花','観葉植物','鉢植え']]
];
const root = document.querySelector('#app');
const INITIAL = () => ({version:1,items:[],history:[],favorites:[],preferences:{},groupMode:'all',view:'list',historyMode:'recent',theme:'system',order:0});
const ui = { modal:null, toast:null, undo:null, storageWarning:false };
let state = INITIAL();
let db = null;
let toastTimeout;
let saveQueue = Promise.resolve();
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = s => String(s||'').trim().toLocaleLowerCase('ja').replace(/[\s\u3000]/g,'');
const safeInt = (num, min, max, fallback) => Number.isFinite(+num) ? Math.max(min,Math.min(max,Math.trunc(+num))) : fallback;
const uniqueId = () => (globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
const stamp = t => t ? new Intl.DateTimeFormat('ja-JP',{month:'numeric',day:'numeric'}).format(new Date(t)) : '';
const options = (obj, selected) => Object.entries(obj).map(([value,v])=>`<option value="${value}" ${value===selected?'selected':''}>${v.label}</option>`).join('');
const icon = (type, n=21) => {
  const shapes = {
    plus:'<path d="M12 5v14M5 12h14"/>',
    check:'<path d="m5 12 5 5L20 7"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    gear:'<path d="M10 2h4l.8 2.6 2.2 1 2.5-1.1 2.8 3-1.3 2.4.8 2.3 2.3.9v4l-2.6.8-1 2.2 1.1 2.5-3 2.8-2.4-1.3-2.3.8-.9 2.3h-4l-.8-2.6-2.2-1-2.5 1.1-2.8-3 1.3-2.4-.8-2.3L1 14v-4l2.6-.8 1-2.2-1.1-2.5 3-2.8 2.4 1.3z" transform="translate(1 1) scale(.85)"/><circle cx="12" cy="12" r="3"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    star:'<path d="m12 2 3.1 6.5 7.2 1-5.2 5 1.3 7.1-6.4-3.4-6.4 3.4 1.3-7.1-5.2-5 7.2-1z"/>',
    add:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8m-4-4h8"/>',
    x:'<path d="M18 6 6 18M6 6l12 12"/>',
    upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v4h16v-4"/>',
    download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    up:'<path d="m6 15 6-6 6 6"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    trash:'<path d="M4 7h16M10 4h4m-8 3 1 14h10l1-14M10 10v7m4-7v7"/>',
    settings:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    sparkle:'<path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3z"/>',
    arrow:'<path d="m9 18 6-6-6-6"/>',
    bag:'<path d="M4 8h16l-1 13H5L4 8ZM9 9V6a3 3 0 0 1 6 0v3"/>'
  };
  return `<svg aria-hidden="true" width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${shapes[type]||shapes.bag}</svg>`;
};
function infer(name){
  const norm=normalize(name);
  const candidates=CATALOG.flatMap(row=>row[3].filter(w=>norm.includes(normalize(w))).map(w=>({row,length:normalize(w).length})));
  candidates.sort((a,b)=>b.length-a.length);
  const matching=candidates[0]?.row;
  const preference=state.preferences[norm];
  return {
    illustration:preference?.illustration || matching?.[0] || 'generic',
    store:preference?.store || matching?.[1] || 'other',
    category:preference?.category || matching?.[2] || 'hobby'
  };
}
function parseInput(value){
  let name = String(value||'').trim();
  let quantity=1,unit='個';
  const m=name.match(/^(.*?)\s*(?:[×xX*]\s*(\d{1,3})|\s+(\d{1,3})\s*(個|本|袋|箱|枚|セット|パック|束|缶|瓶))$/);
  if(m && m[1].trim()){name=m[1].trim();quantity=safeInt(m[2]||m[3],1,999,1);unit=m[4]||'個';}
  return {name:name.slice(0,80),quantity,unit};
}
function sanitizeEntry(x){
  if(!x || typeof x !== 'object')return null;
  const name=String(x.name||'').trim().slice(0,80);
  if(!name)return null;
  const guess=infer(name);
  const store = Object.hasOwn(STORE,x.store)?x.store:guess.store;
  const category = Object.hasOwn(CATEGORY,x.category)?x.category:guess.category;
  const illustration = PocketArt.keys.includes(x.illustration)?x.illustration:guess.illustration;
  return { id:typeof x.id==='string'?x.id:uniqueId(), name, quantity:safeInt(x.quantity,1,999,1),unit:String(x.unit||'個').slice(0,8),store,category,illustration,createdAt:Number(x.createdAt)||Date.now(),completedAt:Number(x.completedAt)||null, order:Number.isFinite(+x.order)?+x.order:0 };
}
function cleanState(obj){
  if(!obj||typeof obj!=='object'||!Array.isArray(obj.items)||!Array.isArray(obj.history)) throw new Error('バックアップ形式が正しくありません');
  const cleaned=INITIAL();
  cleaned.preferences={};
  if(obj.preferences && typeof obj.preferences==='object' && !Array.isArray(obj.preferences)){
    for(const [name, pref] of Object.entries(obj.preferences).slice(0,3000)){
      if(!pref||typeof pref!=='object')continue;
      cleaned.preferences[normalize(name).slice(0,80)]={
        store:Object.hasOwn(STORE,pref.store)?pref.store:'other',
        category:Object.hasOwn(CATEGORY,pref.category)?pref.category:'hobby',
        illustration:PocketArt.keys.includes(pref.illustration)?pref.illustration:'generic'
      };
    }
  }
  cleaned.items=obj.items.slice(0,5000).map(sanitizeEntry).filter(Boolean).map(x=>({...x,completedAt:null}));
  cleaned.history=obj.history.slice(0,10000).map(sanitizeEntry).filter(Boolean);
  cleaned.favorites=Array.isArray(obj.favorites)?[...new Set(obj.favorites.filter(x=>typeof x==='string').map(normalize))].slice(0,3000):[];
  cleaned.groupMode=['all','store','category'].includes(obj.groupMode)?obj.groupMode:'all';
  cleaned.historyMode=['recent','favorites'].includes(obj.historyMode)?obj.historyMode:'recent';
  cleaned.theme=['light','dark','system'].includes(obj.theme)?obj.theme:'system';
  cleaned.view=['list','history','settings'].includes(obj.view)?obj.view:'list';
  cleaned.order=Math.max(safeInt(obj.order,0,100000000,0),...cleaned.items.map(x=>x.order),0);
  return cleaned;
}
async function openDB(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('IndexedDB unavailable'));return;}
    const request=indexedDB.open('pocket-shop-v1',1);
    request.onupgradeneeded=()=>{const database=request.result;if(!database.objectStoreNames.contains('data'))database.createObjectStore('data');};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('Database blocked'));
  });
}
async function readDB(){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('data','readonly');const req=tx.objectStore('data').get('state');
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function writeDB(data){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('data','readwrite');tx.objectStore('data').put(data,'state');
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
}
async function save(data){
  try{
    if(db)await writeDB(data);
    else localStorage.setItem('pocket-shop-state',JSON.stringify(data));
  }catch(e){
    try{localStorage.setItem('pocket-shop-state',JSON.stringify(data));}
    catch(_) {ui.storageWarning=true;render();}
    console.warn('Save fallback:',e);
  }
}
function commit(){
  applyTheme(); render();
  const snapshot=JSON.parse(JSON.stringify(state));
  saveQueue=saveQueue.catch(()=>{}).then(()=>save(snapshot));
}
function applyTheme(){
  const dark=state.theme==='dark'||(state.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme=dark?'dark':'light';
}
function activeItems(){return [...state.items].sort((a,b)=>a.order-b.order||a.createdAt-b.createdAt);}
function itemHtml(item){
  const isFav=state.favorites.includes(normalize(item.name));
  return `<article class="item" data-testid="shopping-item" data-name="${esc(item.name)}">
      ${PocketArt.render(item.illustration)}
      <div class="item-content"><div class="item-name">${esc(item.name)}${item.quantity>1?`<span class="qty-badge">${item.quantity}${esc(item.unit)}</span>`:''}</div>
      <div class="item-meta">${esc(STORE[item.store].label)} <span aria-hidden="true">·</span> ${esc(CATEGORY[item.category].label)}</div></div>
      <div class="item-actions"><button class="icon-btn fav-btn ${isFav?'active':''}" data-action="favorite" data-name="${esc(item.name)}" aria-label="${isFav?'お気に入りを解除':'お気に入りに追加'}: ${esc(item.name)}">${icon('star',18)}</button>
      <button class="icon-btn" data-action="edit" data-id="${esc(item.id)}" aria-label="${esc(item.name)}の詳細と編集">${icon('more',21)}</button>
      <button class="check-btn" data-action="complete" data-id="${esc(item.id)}" aria-label="${esc(item.name)}を購入済みにする">${icon('check',22)}</button></div>
    </article>`;
}
function groupedList(){
  const all=activeItems();
  if(state.groupMode==='all')return `<div class="items">${all.map(itemHtml).join('')}</div>`;
  const pairs=state.groupMode==='store'?STORE:CATEGORY;
  const key=state.groupMode==='store'?'store':'category';
  return Object.entries(pairs).map(([id, config])=>{
    const rows=all.filter(x=>x[key]===id);
    if(!rows.length)return '';
    return `<div class="group-head"><span class="group-symbol">${config.emoji}</span>${config.label}<span class="group-counter">${rows.length}件</span></div><div class="items group-items">${rows.map(itemHtml).join('')}</div>`;
  }).join('');
}
function emptyBox(emoji,title,details){return `<div class="empty"><span class="empty-icon">${emoji}</span><strong>${title}</strong><p>${details}</p></div>`;}
function listView(){
  const list=activeItems();
  const quick=['バナナ','牛乳','卵','化粧水','歯磨き粉','ティッシュ','食パン'].filter(n=>!list.some(i=>normalize(i.name)===normalize(n))).slice(0,5);
  return `<div class="add-card">
    <div class="section-top"><span class="section-label">🛒 買うものを追加</span><span class="section-note">例：バナナ ×2</span></div>
    <form class="add-form" id="add-form"><input class="add-input" id="item-input" maxlength="100" enterkeyhint="done" autocomplete="off" placeholder="何を買う？" aria-label="買うものを入力" required><button class="plus-btn" type="submit" aria-label="買うものを追加">${icon('plus',26)}</button></form>
    ${quick.length?`<div class="quick-add" aria-label="ワンタップで追加">${quick.map(n=>`<button class="quick-btn" type="button" data-action="quick" data-name="${esc(n)}"><span>${CATALOG.find(row=>row[3].includes(n))?.[0]==='banana'?'🍌':CATALOG.find(row=>row[3].includes(n))?.[0]==='milk'?'🥛':'✦'}</span>${esc(n)}</button>`).join('')}</div>`:''}
  </div>
  <div class="section-head"><h2>買い物リスト</h2><span class="subcaption">${list.length}点の買いもの</span></div>
  <div class="segmented" role="group" aria-label="リストの表示方法">
    ${[['all','すべて'],['store','お店別'],['category','ジャンル別']].map(([id,label])=>`<button type="button" class="seg-btn ${state.groupMode===id?'active':''}" data-action="group" data-value="${id}" aria-pressed="${state.groupMode===id}">${label}</button>`).join('')}
  </div>
  ${list.length?groupedList():emptyBox('✨','買い物リストは空っぽ！','上から商品を追加すると、<br>イラスト付きでここに並びます。')}`;
}
function historyCard(x,source){
  const active=state.items.some(item=>normalize(item.name)===normalize(x.name));
  return `<article class="item history-item">
    ${PocketArt.render(x.illustration,'small')}<div class="item-content"><div class="item-name">${esc(x.name)}</div><div class="item-meta">${esc(STORE[x.store].label)} ${source==='recent'?`· ${stamp(x.completedAt)}`:''}</div></div>
    <button class="readd-btn" data-action="readd" data-source="${source}" data-id="${esc(x.id)}" ${active?'disabled':''} aria-label="${esc(x.name)}をリストに追加">${active?'追加済み':`${icon('plus',14)} 追加`}</button>
  </article>`;
}
function historyView(){
  let listing=[];
  if(state.historyMode==='recent') listing=[...state.history].sort((a,b)=>b.completedAt-a.completedAt).slice(0,150);
  else {
    for(const name of state.favorites){
      const match=state.items.find(x=>normalize(x.name)===name)||[...state.history].reverse().find(x=>normalize(x.name)===name);
      if(match)listing.push(match);
    }
  }
  return `<div class="section-head"><h2>いつもの買い物</h2><span class="subcaption">サッと再追加</span></div>
    <div class="history-tabs"><button class="pill-tab ${state.historyMode==='recent'?'active':''}" data-action="history-mode" data-value="recent">購入履歴 (${state.history.length})</button><button class="pill-tab ${state.historyMode==='favorites'?'active':''}" data-action="history-mode" data-value="favorites">★ お気に入り (${state.favorites.length})</button></div>
    ${listing.length?`<div class="items">${listing.map(x=>historyCard(x,state.historyMode)).join('')}</div>`:emptyBox(state.historyMode==='recent'?'🧺':'⭐',state.historyMode==='recent'?'購入履歴はまだありません':'お気に入りはまだありません',state.historyMode==='recent'?'買い物をチェックすると<br>ここからいつでも再追加できます。':'商品の★を押すと<br>ここによく買うものが並びます。')}`;
}
function settingsView(){
  return `<div class="section-head"><h2>設定とバックアップ</h2><span class="subcaption">自分だけの買い物帳</span></div>
    <section class="settings-block"><h3>📱 ホーム画面に追加</h3><p>iPhoneのSafariから追加すると、アプリのように単独で開けます。初回読み込み後はオフラインでも使えます。</p><button class="button secondary" data-action="install">追加手順を見る ${icon('arrow',16)}</button></section>
    <section class="settings-block"><h3>💾 バックアップ</h3><p>データはこの端末の中に保存。端末変更やSafariデータ削除に備えて、ときどきバックアップしてください。</p><div class="settings-row"><button class="button secondary" data-action="export">${icon('download',17)} 保存する</button><button class="button outline" data-action="import">${icon('upload',17)} 復元する</button><input id="import-file" type="file" accept=".json,application/json" hidden></div></section>
    <section class="settings-block"><h3>🎨 外観</h3><p>気分に合わせてテーマを変更できます。</p><select class="settings-select" data-setting="theme" aria-label="テーマ"><option value="system" ${state.theme==='system'?'selected':''}>端末に合わせる</option><option value="light" ${state.theme==='light'?'selected':''}>ライト</option><option value="dark" ${state.theme==='dark'?'selected':''}>ダーク</option></select></section>
    <section class="settings-block"><h3>🗑 購入履歴を整理</h3><p>現在のリストとお気に入りは残したまま、購入履歴だけ消去できます。</p><button class="button danger" data-action="clear-history">履歴を消去</button></section>
    <div class="settings-footer">Pocket Shop v1.0 · オフラインファースト<br>ログインなし・広告なし・外部APIなし</div>
    ${ui.storageWarning?`<div class="privacy-notice">⚠️ この環境では保存が利用できません。通常のSafariで開いてください。</div>`:''}`;
}
function modalHtml(){
  if(!ui.modal) return '';
  if(ui.modal==='install')return `<div class="overlay" data-action="close-backdrop"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="grabber"></div><div class="sheet-head"><h2 id="sheet-title">iPhoneに追加する</h2><button class="icon-btn" data-action="close-modal" aria-label="閉じる">${icon('x',23)}</button></div><ol class="install-steps"><li>Safariで公開したアプリのURLを開く</li><li>Safariのメニューから「共有」をタップ</li><li>「ホーム画面に追加」を選ぶ</li><li>「Webアプリとして開く」をオンにする</li><li>「追加」をタップすると完成！</li></ol><p class="privacy-notice">初回アクセス時はインターネットが必要です。オフライン保存は初回ロード後から有効になります。別のブラウザやホーム画面版とはデータが共有されない場合があります。</p><div class="sheet-actions"><button class="button full" data-action="close-modal">わかった</button></div></section></div>`;
  const item=state.items.find(x=>x.id===ui.modal?.id);
  if(!item) return '';
  return `<div class="overlay" data-action="close-backdrop"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="grabber"></div><div class="sheet-head"><h2 id="sheet-title">買うものを編集</h2><button class="icon-btn" data-action="close-modal" aria-label="閉じる">${icon('x',23)}</button></div>
    <div class="sheet-art-preview">${PocketArt.render(item.illustration)}</div>
    <form id="edit-form">
      <div class="field"><label for="edit-name">商品名</label><input class="text-field" id="edit-name" name="name" value="${esc(item.name)}" maxlength="80" required></div>
      <div class="field-row"><div class="field"><label for="edit-qty">数量</label><input class="text-field" id="edit-qty" name="quantity" type="number" inputmode="numeric" min="1" max="999" value="${item.quantity}" required></div><div class="field"><label for="edit-unit">単位</label><select id="edit-unit" name="unit">${['個','本','袋','箱','枚','パック','セット','缶','瓶','束'].map(unit=>`<option value="${unit}" ${unit===item.unit?'selected':''}>${unit}</option>`).join('')}</select></div></div>
      <div class="field-row"><div class="field"><label for="edit-store">買うお店</label><select id="edit-store" name="store">${options(STORE,item.store)}</select></div><div class="field"><label for="edit-category">ジャンル</label><select id="edit-category" name="category">${options(CATEGORY,item.category)}</select></div></div>
      <p class="sheet-helper">ここでお店・ジャンルを変えると、次回から同じ商品名にも自動適用されます。</p>
      <div class="sheet-small-action"><button type="button" class="button outline" data-action="auto-classify">自動判定に戻す</button><div style="display:flex;gap:7px"><button type="button" class="button outline" data-action="move" data-direction="up" aria-label="上へ移動">${icon('up',18)}</button><button type="button" class="button outline" data-action="move" data-direction="down" aria-label="下へ移動">${icon('down',18)}</button></div></div>
      <div class="sheet-actions"><button type="button" class="button danger" data-action="delete" data-id="${esc(item.id)}">${icon('trash',17)} 削除</button><button type="submit" class="button">変更を保存 ${icon('check',18)}</button></div>
    </form></section></div>`;
}
function renderToast(){
  if(!ui.toast)return '';
  return `<div class="toast" role="status"><span>${esc(ui.toast)}</span>${ui.undo?`<button data-action="undo">元に戻す</button>`:`<button data-action="hide-toast">閉じる</button>`}</div>`;
}
function render(){
  const remaining=state.items.length;
  root.innerHTML=`<div class="shell"><header class="hero"><div class="hero-top"><div class="brandline"><span class="brandmark">✦</span><span>POCKET SHOP</span></div><span class="network-badge"><span class="network-dot"></span>${navigator.onLine?'オフライン対応':'オフライン中'}</span></div>
    <h1 class="hero-title">おかいもの<span style="opacity:.7">。</span></h1><p class="hero-sub">思いついたら追加。買ったらチェック。</p>
    <div class="hero-stats"><span class="stat-number">${remaining}</span><span class="stat-unit">件の買うものがあります</span><span class="stat-right">${icon('sparkle',15)} かしこく自動整理</span></div></header>
    <main>${state.view==='list'?listView():state.view==='history'?historyView():settingsView()}</main>
    <nav class="bottom-nav" aria-label="メインメニュー">${[['list','list','リスト'],['history','clock','履歴・お気に入り'],['settings','settings','設定']].map(([id,ic,label])=>`<button class="nav-btn ${state.view===id?'active':''}" data-action="nav" data-value="${id}" aria-current="${state.view===id?'page':'false'}">${icon(ic,22)}<span>${label}</span></button>`).join('')}</nav>
  </div>${renderToast()}${modalHtml()}`;
}
function showToast(message,undo=null){
  clearTimeout(toastTimeout);ui.toast=message;ui.undo=undo;render();
  toastTimeout=setTimeout(()=>{ui.toast=null;ui.undo=null;render();},7000);
}
function addItem(value){
  const parsed=parseInput(value);
  if(!parsed.name)return;
  const existing=state.items.find(x=>normalize(x.name)===normalize(parsed.name));
  if(existing){existing.quantity=Math.min(999,existing.quantity+parsed.quantity);commit();showToast(`${existing.name}の数量を増やしました`);return;}
  const inferred=infer(parsed.name);
  const item={id:uniqueId(),...parsed,...inferred,createdAt:Date.now(),completedAt:null,order:++state.order};
  state.items.push(item);commit();
}
function completeItem(id){
  const idx=state.items.findIndex(x=>x.id===id);
  if(idx<0)return;
  const [item]=state.items.splice(idx,1);item.completedAt=Date.now();state.history.push(item);commit();
  showToast(`「${item.name}」を購入済みにしました`,()=>{
    const historyIndex=state.history.findIndex(x=>x.id===id);
    if(historyIndex>=0){const [back]=state.history.splice(historyIndex,1);back.completedAt=null;state.items.push(back);commit();}
  });
}
function toggleFavorite(name){
  const key=normalize(name);if(!key)return;
  if(state.favorites.includes(key))state.favorites=state.favorites.filter(n=>n!==key);
  else state.favorites.push(key);
  commit();
}
function readd(id,source){
  const row=source==='recent'?state.history.find(x=>x.id===id):[...state.items,...state.history].find(x=>x.id===id);
  if(!row)return;
  if(state.items.some(x=>normalize(x.name)===normalize(row.name)))return;
  state.items.push({...row,...infer(row.name),id:uniqueId(),createdAt:Date.now(),completedAt:null,order:++state.order});
  state.view='list';commit();showToast(`「${row.name}」をリストに追加しました`);
}
function moveItem(direction){
  const id=ui.modal?.id;if(!id)return;
  const arr=activeItems();let i=arr.findIndex(x=>x.id===id);
  const j=i+(direction==='up'?-1:1);
  if(i<0||j<0||j>=arr.length)return;
  [arr[i],arr[j]]=[arr[j],arr[i]];
  arr.forEach((x,index)=>x.order=index+1);state.order=arr.length;
  commit();
}
function exportData(){
  const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download=`okaimono-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  showToast('バックアップを書き出しました。ファイルを保存してください。');
}
async function importData(file){
  if(!file)return;
  if(file.size>5*1024*1024){alert('ファイルが大きすぎます（最大5MB）。');return;}
  try{
    const parsed=JSON.parse(await file.text());const restored=cleanState(parsed);
    if(!confirm(`現在のリストを置き換えて、買い物${restored.items.length}件・履歴${restored.history.length}件を復元しますか？`))return;
    state=restored;state.view='list';commit();showToast('バックアップを復元しました');
  }catch(e){alert(`読み込めませんでした：${e.message}`);}
}
function saveEdit(form){
  const item=state.items.find(x=>x.id===ui.modal?.id);if(!item)return;
  const fd=new FormData(form),name=String(fd.get('name')||'').trim().slice(0,80);
  if(!name)return;
  const newStore=String(fd.get('store')),newCategory=String(fd.get('category'));
  if(!Object.hasOwn(STORE,newStore)||!Object.hasOwn(CATEGORY,newCategory))return;
  if(state.items.some(x=>x.id!==item.id&&normalize(x.name)===normalize(name))){
    alert('同じ名前の商品がすでにリストにあります。');return;
  }
  if(normalize(item.name)!==normalize(name))item.illustration=infer(name).illustration;
  const renamed=normalize(item.name)!==normalize(name);
  const guess=renamed?infer(name):null;
  const finalStore=renamed && newStore===item.store ? guess.store : newStore;
  const finalCategory=renamed && newCategory===item.category ? guess.category : newCategory;
  item.name=name;item.quantity=safeInt(fd.get('quantity'),1,999,1);item.unit=String(fd.get('unit')||'個');
  item.store=finalStore;item.category=finalCategory;
  if(renamed)item.illustration=guess.illustration;
  state.preferences[normalize(name)]={store:item.store,category:item.category,illustration:item.illustration};
  ui.modal=null;commit();showToast('変更を保存しました');
}
function handleAction(btn,event){
  const action=btn.dataset.action,id=btn.dataset.id;
  if(action==='quick'){addItem(btn.dataset.name);return;}
  if(action==='group'){state.groupMode=btn.dataset.value;commit();return;}
  if(action==='nav'){state.view=btn.dataset.value;ui.modal=null;commit();return;}
  if(action==='complete'){completeItem(id);return;}
  if(action==='edit'){ui.modal={id};render();return;}
  if(action==='favorite'){toggleFavorite(btn.dataset.name);return;}
  if(action==='history-mode'){state.historyMode=btn.dataset.value;commit();return;}
  if(action==='readd'){readd(id,btn.dataset.source);return;}
  if(action==='install'){ui.modal='install';render();return;}
  if(action==='close-modal'){ui.modal=null;render();return;}
  if(action==='close-backdrop'){if(event.target===btn){ui.modal=null;render();}return;}
  if(action==='hide-toast'){clearTimeout(toastTimeout);ui.toast=null;ui.undo=null;render();return;}
  if(action==='undo'){const fn=ui.undo;clearTimeout(toastTimeout);ui.toast=null;ui.undo=null;if(fn)fn();else render();return;}
  if(action==='move'){moveItem(btn.dataset.direction);return;}
  if(action==='auto-classify'){
    const name=document.querySelector('#edit-name')?.value;const prev=state.preferences[normalize(name)];
    if(prev)delete state.preferences[normalize(name)];
    const guess=infer(name);if(prev)state.preferences[normalize(name)]=prev;
    document.querySelector('#edit-store').value=guess.store;
    document.querySelector('#edit-category').value=guess.category;
    return;
  }
  if(action==='delete'){
    const idx=state.items.findIndex(x=>x.id===id);if(idx<0)return;
    const [removed]=state.items.splice(idx,1);ui.modal=null;commit();
    showToast(`「${removed.name}」を削除しました`,()=>{state.items.push(removed);commit();});return;
  }
  if(action==='export'){exportData();return;}
  if(action==='import'){document.querySelector('#import-file')?.click();return;}
  if(action==='clear-history'){
    if(state.history.length===0){showToast('削除する履歴はありません');return;}
    if(!confirm(`購入履歴${state.history.length}件を削除しますか？ この操作は元に戻せません。`))return;
    state.history=[];commit();showToast('履歴を削除しました');return;
  }
}
root.addEventListener('click',e=>{const btn=e.target.closest('[data-action]');if(btn)handleAction(btn,e);});
root.addEventListener('submit',e=>{
  if(e.target.id==='add-form'){e.preventDefault();addItem(e.target.querySelector('#item-input').value);document.querySelector('#item-input')?.focus();}
  else if(e.target.id==='edit-form'){e.preventDefault();saveEdit(e.target);}
});
root.addEventListener('change',e=>{
  if(e.target.dataset.setting==='theme'){state.theme=e.target.value;commit();}
  if(e.target.id==='import-file'){importData(e.target.files?.[0]);}
});
window.addEventListener('online',render);window.addEventListener('offline',render);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.modal){ui.modal=null;render();}});
if(window.matchMedia)matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.theme==='system')applyTheme();});
async function main(){
  try{
    db=await openDB();
    const saved=await readDB();if(saved)state=cleanState(saved);
    else{const legacy=localStorage.getItem('pocket-shop-state');if(legacy){state=cleanState(JSON.parse(legacy));commit();}}
  }catch(err){
    console.warn('IndexedDB unavailable, trying localStorage:',err);
    try{const legacy=localStorage.getItem('pocket-shop-state');if(legacy)state=cleanState(JSON.parse(legacy));}
    catch(_){ui.storageWarning=true;}
  }
  state.view='list';applyTheme();render();
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')){
    navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Offline cache unavailable:',err));
  }
}
main();
window.PocketShopDebug={getState:()=>JSON.parse(JSON.stringify(state)),infer,parseInput};
})();
