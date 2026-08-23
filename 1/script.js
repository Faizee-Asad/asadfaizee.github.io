// izen.lol bypass tool — frontend
// API docs (per user-provided manual):
//   GET https://api.izen.lol/v1/supported
//   GET https://api.izen.lol/v1/bypass?url={encoded_url}
//   GET https://api.izen.lol/v1/refresh?url={encoded_url}
// Header: x-api-key: <key>

const API_BASE = "https://api.izen.lol";
const KEY_STORAGE = "izen_api_key";

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);

const apiKeyInput = $("apiKey");
const toggleKeyBtn = $("toggleKey");
const saveKeyBtn = $("saveKey");
const keyStatus = $("keyStatus");

const targetUrlInput = $("targetUrl");
const runBtn = $("runBtn");
const endpointPreview = $("endpointPreview");

const resultBox = $("resultBox");
const statusDot = $("statusDot");
const statusText = $("statusText");
const resultBody = $("resultBody");
const copyBtn = $("copyBtn");

const loadServicesBtn = $("loadServices");
const servicesBox = $("servicesBox");

const modeButtons = document.querySelectorAll(".mode");

let currentMode = "bypass"; // or "refresh"

// ---------- Key handling ----------
function loadKey() {
  const k = localStorage.getItem(KEY_STORAGE) || "";
  apiKeyInput.value = k;
  return k;
}

function saveKey() {
  const v = apiKeyInput.value.trim();
  if (!v) {
    setKeyStatus("Key cleared.", "ok");
    localStorage.removeItem(KEY_STORAGE);
    return;
  }
  localStorage.setItem(KEY_STORAGE, v);
  setKeyStatus("Saved ✓ (stored in localStorage)", "ok");
}

function setKeyStatus(msg, kind = "") {
  keyStatus.textContent = msg;
  keyStatus.className = "hint " + kind;
}

toggleKeyBtn.addEventListener("click", () => {
  const isPwd = apiKeyInput.type === "password";
  apiKeyInput.type = isPwd ? "text" : "password";
  toggleKeyBtn.textContent = isPwd ? "Hide" : "Show";
});

saveKeyBtn.addEventListener("click", saveKey);
apiKeyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveKey();
});

// ---------- Mode toggle ----------
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
    updateEndpointPreview();
  });
});

function updateEndpointPreview() {
  const u = targetUrlInput.value.trim();
  const path = currentMode === "refresh" ? "/v1/refresh" : "/v1/bypass";
  endpointPreview.textContent = u
    ? `${path}?url=${encodeURIComponent(u)}`
    : `${path}?url=…`;
}
targetUrlInput.addEventListener("input", updateEndpointPreview);

// ---------- Core fetch ----------
async function callApi(path) {
  const key = (localStorage.getItem(KEY_STORAGE) || "").trim();
  if (!key) {
    throw new Error("Missing API key. Add it under Configuration and click Save.");
  }
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "x-api-key": key },
  });

  const contentType = res.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const msg =
      typeof data === "string"
        ? data
        : data?.message || data?.error || JSON.stringify(data, null, 2);
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return data;
}

// ---------- Run bypass / refresh ----------
runBtn.addEventListener("click", async () => {
  const url = targetUrlInput.value.trim();
  if (!url) {
    showResult("err", "Missing URL", "Paste a URL first.");
    return;
  }
  const path =
    currentMode === "refresh"
      ? `/v1/refresh?url=${encodeURIComponent(url)}`
      : `/v1/bypass?url=${encodeURIComponent(url)}`;

  setLoading(true);
  try {
    const data = await callApi(path);
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    showResult("ok", "Success", text);
  } catch (err) {
    showResult("err", "Error", err.message || String(err));
  } finally {
    setLoading(false);
  }
});

function setLoading(on) {
  runBtn.classList.toggle("loading", on);
  runBtn.disabled = on;
  runBtn.querySelector(".btn-label").textContent = on ? "Running…" : "Run";
}

function showResult(kind, status, body) {
  resultBox.classList.remove("hidden");
  statusDot.className = "dot " + kind;
  statusText.textContent = status;
  resultBody.textContent = body;
}

// ---------- Copy ----------
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultBody.textContent || "");
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy result"), 1200);
  } catch {
    copyBtn.textContent = "Copy failed";
    setTimeout(() => (copyBtn.textContent = "Copy result"), 1200);
  }
});

// ---------- Supported services ----------
loadServicesBtn.addEventListener("click", async () => {
  servicesBox.classList.remove("empty");
  servicesBox.textContent = "Loading…";
  try {
    const data = await callApi("/v1/supported");
    servicesBox.textContent =
      typeof data === "string" ? data : JSON.stringify(data, null, 2);
  } catch (err) {
    servicesBox.classList.add("empty");
    servicesBox.textContent = err.message || String(err);
  }
});

// ---------- Init ----------
loadKey();
updateEndpointPreview();
