// config.js
// ================== EDIT INI ==================
const CLIENT_ID   = "472347273718-0itvg8e273buifaj1si9d47djmch7ge7.apps.googleusercontent.com";

// Pilih SATU:
// 1) Jika guna Cloudflare Worker (disyorkan untuk CORS penuh)
// const WEB_APP_URL = "https://gas-proxy.<akaun>.workers.dev";
//
// 2) Tanpa Worker (terus ke Apps Script Web App):
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxmz1In-BjFP0dGspnYVRRbqJzuTmpxYfKflq4LLzQKU9dGxvtOgTROcxQ9p80oTVA/exec";

const BRAND_NAME  = "ZARIQAFRO";
const ADMIN_WHATSAPP = "60109074190";
// =============================================

// ---------- API util ----------
function apiGet(path, params = {}) {
  const map = { listings: 'public_listings', sellers: 'public_sellers', portal: 'public_portal', config:'public_config', brands:'public_brands' };
  const action = map[path] || ('public_' + path);
  return fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, payload: params })
  }).then(r => r.json());
}

function apiPost(action, payload = {}, needAuth = false, opts = {}) {
  const body = { action, payload };
  if (needAuth) {
    const token = localStorage.getItem("id_token");
    if (token) body.id_token = token;
  }
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  };
  if (opts.noCors) {
    // fallback untuk upload besar (logo/gambar) bila belum pasang Worker
    fetchOptions.mode = 'no-cors';
  }
  return fetch(WEB_APP_URL, fetchOptions).then(async (r) => {
    if (fetchOptions.mode === 'no-cors') return { ok: true, data: { note: 'opaque' } };
    return r.json();
  });
}

function fmtRM(n){ return "RM " + (Number(n||0).toLocaleString("ms-MY")); }

// helper: file → base64 dataURL
function fileToBase64(file){ 
  return new Promise((res,rej)=>{ 
    const r=new FileReader(); 
    r.onload=()=>res(r.result); 
    r.onerror=rej; 
    r.readAsDataURL(file); 
  }); 
}
