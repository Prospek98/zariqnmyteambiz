// config.js
// ================== EDIT INI ==================
const CLIENT_ID   = "472347273718-0itvg8e273buifaj1si9d47djmch7ge7.apps.googleusercontent.com";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxmz1In-BjFP0dGspnYVRRbqJzuTmpxYfKflq4LLzQKU9dGxvtOgTROcxQ9p80oTVA/exec";
const BRAND_NAME  = "CarHub Johor";
const ADMIN_WHATSAPP = "60109074190";
// =============================================

// GET helper (public)
function apiGet(path, params = {}) {
  const url = new URL(WEB_APP_URL);
  url.searchParams.set("path", path);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  return fetch(url, { headers: { "Accept": "application/json" } })
    .then(r => r.json());
}

// POST helper (admin/seller: needAuth=true)
function apiPost(action, payload = {}, needAuth = false) {
  const body = { action, payload };
  if (needAuth) {
    const token = localStorage.getItem("id_token");
    if (token) body.id_token = token; // << token dalam BODY, bukan header
  }
  return fetch(WEB_APP_URL, {
    method: "POST",
    // text/plain mengelakkan preflight CORS
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body)
  }).then(r => r.json());
}

// util kecil
function fmtRM(n){ return "RM " + (Number(n||0).toLocaleString("ms-MY")); }
