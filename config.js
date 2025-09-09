/* config.js — ZARIQAFRO (versi stabil, guna Cloudflare Worker untuk CORS) */

/** === EDIT INI (WAJIB) === **/
const CLIENT_ID   = "472347273718-0itvg8e273buifaj1si9d47djmch7ge7.apps.googleusercontent.com"; // <- tukar kpd Client ID anda
const WEB_APP_URL = "https://broken-dew-0eb2.amiruladlije.workers.dev";        // URL Cloudflare Worker
const BRAND_NAME  = "ZARIQAFRO";
const ADMIN_WHATSAPP = "60109074190";
/** ========================= **/

/* Util asas */
function fmtRM(n){ return "RM " + (Number(n||0).toLocaleString("ms-MY")); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function getQuery(name, url){ 
  const u = new URL(url || window.location.href); 
  return u.searchParams.get(name); 
}
function fileToBase64(file){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result);
    r.onerror=rej;
    r.readAsDataURL(file);
  });
}

/* API helper — semua request pergi ke Cloudflare Worker (yang forward ke Apps Script) */
function apiGet(path, params = {}) {
  // Worker/Apps Script kita pakai POST untuk public endpoints juga (lebih stabil & seragam)
  const map = { listings:'public_listings', sellers:'public_sellers', portal:'public_portal', config:'public_config', brands:'public_brands' };
  const action = map[path] || ('public_' + path);
  return fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, payload: params })
  }).then(r => r.json());
}

function apiPost(action, payload = {}, needAuth = false) {
  const body = { action, payload };
  if (needAuth) {
    const token = localStorage.getItem("id_token");
    if (token) body.id_token = token;
  }
  return fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body)
  }).then(r => r.json());
}

/* Auth (Google One Tap / Button) */
function ensureAuthUI(targetElId){
  const box = document.getElementById(targetElId);
  if (!box) return;
  if(localStorage.getItem('id_token')){
    box.innerHTML = `<span class="badge">Logged in</span>
      <button class="btn btn-ghost" onclick="signOut()">Sign out</button>`;
  } else {
    box.innerHTML = `
      <div id="g_id_onload" data-client_id="${CLIENT_ID}" data-auto_prompt="false" data-callback="onSignIn"></div>
      <div class="g_id_signin" data-type="standard" data-size="large"></div>`;
    if (window.google && google.accounts && google.accounts.id){
      google.accounts.id.initialize({ client_id: CLIENT_ID, callback:onSignIn });
      google.accounts.id.renderButton(document.querySelector('.g_id_signin'), { theme:'outline', size:'large' });
    }
  }
}
function onSignIn(res){
  if(res && res.credential){ localStorage.setItem('id_token', res.credential); location.reload(); }
}
function signOut(){ localStorage.removeItem('id_token'); location.reload(); }

/* Link WhatsApp helper */
function openWA(phone, text){
  const p = String(phone||'').replace(/\D/g,'');
  const t = encodeURIComponent(text||'');
  window.open(`https://wa.me/${p}?text=${t}`, '_blank');
}

/* Expose a few helpers globally (diguna oleh halaman) */
window.ZARIQAFRO = {
  CLIENT_ID, WEB_APP_URL, BRAND_NAME, ADMIN_WHATSAPP,
  apiGet, apiPost,
  fmtRM, getQuery, fileToBase64, openWA,
  ensureAuthUI, onSignIn, signOut
};
