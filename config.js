<!-- config.js -->
<script>
  // ====== EDIT INI ======
  const CLIENT_ID   = "472347273718-0itvg8e273buifaj1si9d47djmch7ge7.apps.googleusercontent.com"; 
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxmz1In-BjFP0dGspnYVRRbqJzuTmpxYfKflq4LLzQKU9dGxvtOgTROcxQ9p80oTVA/exec";
  const BRAND_NAME  = "CarHub Johor";
  const ADMIN_WHATSAPP = "60109074190";
  // ======================

  function apiGet(path, params = {}) {
    const url = new URL(WEB_APP_URL);
    url.searchParams.set("path", path);
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
    return fetch(url, {headers: { "Accept": "application/json" }})
      .then(r => r.json());
  }

  function apiPost(action, payload = {}, needAuth = false) {
    const headers = { "Content-Type": "application/json" };
    if (needAuth) {
      const token = localStorage.getItem("id_token");
      if (token) headers["Authorization"] = "Bearer " + token;
    }
    return fetch(WEB_APP_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ action, payload })
    }).then(r => r.json());
  }

  function fmtRM(n){ return "RM " + (Number(n||0).toLocaleString("ms-MY")); }
</script>
