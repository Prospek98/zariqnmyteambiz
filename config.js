// config.js
// ================== EDIT INI ==================
const CLIENT_ID   = "472347273718-0itvg8e273buifaj1si9d47djmch7ge7.apps.googleusercontent.com";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxmz1In-BjFP0dGspnYVRRbqJzuTmpxYfKflq4LLzQKU9dGxvtOgTROcxQ9p80oTVA/exec";
const BRAND_NAME  = "CarHub Johor";
const ADMIN_WHATSAPP = "60109074190";
// =============================================

// PUBLIC: guna POST text/plain (elak CORS GET)
function apiGet(path, params = {}) {
  // peta path → action API
  const map = { listings: 'public_listings', sellers: 'public_sellers', portal: 'public_portal' };
  const action = map[path] || ('public_' + path);

  return fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // elak preflight
    body: JSON.stringify({ action, payload: params })
  }).then(r => r.json());
}

// PROTECTED (admin/seller): hantar id_token dalam BODY (bukan header)
function apiPost(action, payload = {}, needAuth = false) {
  const body = { action, payload };
  if (needAuth) {
    const token = localStorage.getItem("id_token");
    if (token) body.id_token = token; // token dalam body
  }
  return fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // elak preflight
    body: JSON.stringify(body)
  }).then(r => r.json());
}

// util
function fmtRM(n){ return "RM " + (Number(n||0).toLocaleString("ms-MY")); }
