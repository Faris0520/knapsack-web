// ============================================================
// Knapsack Optimizer - versi vanilla HTML/CSS/JS (tanpa backend)
// ============================================================

// ---------- Ikon (inline SVG, gaya lucide) ----------
const ICONS = {
  package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  weight: '<circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  shuffle: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  'check-circle': '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
};

function icon(name, rem = 1, cls = "") {
  const inner = ICONS[name] || "";
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${rem}rem" height="${rem}rem">${inner}</svg>`;
}

// ---------- Konstanta ----------
const PRESETS = [
  { label: "Laptop", value: "laptop", weight: 3, points: 10 },
  { label: "Buku", value: "buku", weight: 2, points: 8 },
  { label: "Charger", value: "charger", weight: 1, points: 7 },
  { label: "Botol Minum", value: "botol-minum", weight: 1, points: 5 },
  { label: "Kotak Pensil", value: "kotak-pensil", weight: 1, points: 6 },
  { label: "Powerbank", value: "powerbank", weight: 1, points: 8 },
  { label: "Jaket", value: "jaket", weight: 2, points: 7 },
  { label: "Custom", value: "custom", weight: 0, points: 0 },
];

const IMAGE_MAP = {
  "Laptop": "items/laptop.png",
  "Buku": "items/buku.png",
  "Charger": "items/charger.png",
  "Botol Minum": "items/botol-minum.png",
  "Kotak Pensil": "items/kotak-pensil.png",
  "Powerbank": "items/powerbank.png",
  "Jaket": "items/jaket.png",
};

const STEPS = ["Mulai", "Evaluasi Barang", "Hasil Optimal"];

function itemIcon(name, rem) {
  const src = IMAGE_MAP[name];
  if (!src) return icon("package", rem || 1.25, "muted");
  return `<img src="${src}" alt="${escapeHtml(name)}" width="${(rem || 2) * 16}" height="${(rem || 2) * 16}" style="width:${rem || 2}rem;height:${rem || 2}rem;object-fit:contain;" />`;
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- Algoritma ----------
// Fungsi `solveKnapsack(capacity, items)` didefinisikan di file
// terpisah: knapsack.js (dimuat lebih dulu di index.html).
// File ini (app.js) hanya mengurus tampilan/proses & memanggilnya.

// ---------- State ----------
const state = {
  items: [],
  capacity: 10,
  result: null,
  loading: false,
  error: "",
  currentStep: 0,
  currentEvalItem: 0,
  dpProgress: { weight: 0, value: 0 },
  // sidebar form
  selectedPreset: "kotak-pensil",
  editingId: null,
  // DP table sub-state
  dpStep: 0,
  dpPlaying: false,
  dpInterval: null,
  // pelacak render incremental (untuk animasi mulus)
  simView: null, // tipe tampilan simulasi yang sedang ada di DOM (0/1/2)
  dpSig: null, // signature tabel DP yang sudah dibangun
  dpPrevStep: 0, // dpStep pada render sebelumnya (untuk efek reveal)
};

// ---------- Element refs ----------
const $ = (id) => document.getElementById(id);

// ============================================================
// Sidebar
// ============================================================
function initSidebar() {
  // preset options
  $("preset").innerHTML = PRESETS.map((p) => `<option value="${p.value}">${p.label}</option>`).join("");
  $("preset").value = state.selectedPreset;

  $("capacity").addEventListener("input", (e) => {
    state.capacity = Number(e.target.value);
    state.result = null;
    state.currentStep = 0;
    renderMain();
  });

  $("preset").addEventListener("change", (e) => {
    state.selectedPreset = e.target.value;
    renderPresetArea();
  });

  $("addBtn").addEventListener("click", handleAdd);
  $("randomBtn").addEventListener("click", handleRandom);

  renderPresetArea();
}

function renderPresetArea() {
  const isCustom = state.selectedPreset === "custom";
  const preset = PRESETS.find((p) => p.value === state.selectedPreset);

  $("customFields").classList.toggle("hidden", !isCustom);
  if (isCustom) {
    $("presetInfo").innerHTML = "";
  } else if (preset) {
    $("presetInfo").innerHTML = `<span>Berat: ${preset.weight} kg</span><span>Nilai: ${preset.points} poin</span>`;
  }

  $("addBtn").innerHTML = icon("plus", 1) + " Tambah Barang";
  $("randomBtn").innerHTML = icon("shuffle", 1);
}

function handleAdd() {
  const isCustom = state.selectedPreset === "custom";
  if (isCustom) {
    const name = $("customName").value;
    const weight = $("customWeight").value;
    const value = $("customValue").value;
    if (!name || !weight || !value) return;
    addItem({ id: uid(), name, weight: Number(weight), value: Number(value) });
    $("customName").value = "";
    $("customWeight").value = "";
    $("customValue").value = "";
  } else {
    const preset = PRESETS.find((p) => p.value === state.selectedPreset);
    if (preset) addItem({ id: uid(), name: preset.label, weight: preset.weight, value: preset.points });
  }
}

function handleRandom() {
  const available = PRESETS.filter((p) => p.value !== "custom");
  const r = available[Math.floor(Math.random() * available.length)];
  addItem({ id: uid(), name: r.label, weight: r.weight, value: r.points });
}

function addItem(item) {
  state.items.push(item);
  state.result = null;
  state.currentStep = 0;
  renderItems();
  renderMain();
}

function editItem(id, updates) {
  state.items = state.items.map((it) => (it.id === id ? { ...it, ...updates } : it));
  state.result = null;
  state.currentStep = 0;
  state.editingId = null;
  renderItems();
  renderMain();
}

function removeItem(id) {
  state.items = state.items.filter((it) => it.id !== id);
  state.result = null;
  state.currentStep = 0;
  renderItems();
  renderMain();
}

function renderItems() {
  const { items } = state;
  $("itemsCard").classList.toggle("hidden", items.length === 0);

  const body = $("itemsBody");
  body.innerHTML = items
    .map((item) => {
      if (state.editingId === item.id) {
        return `<tr data-id="${item.id}">
          <td class="tight">${itemIcon(item.name, 2.5)}</td>
          <td class="tight"><input class="input input-mini" data-f="name" value="${escapeHtml(item.name)}" /></td>
          <td class="tight"><input class="input input-mini w-12" type="number" data-f="weight" value="${item.weight}" /></td>
          <td class="tight"><input class="input input-mini w-12" type="number" data-f="value" value="${item.value}" /></td>
          <td class="tight center">
            <div class="row gap-1" style="justify-content:center;">
              <button class="btn btn-ghost" data-act="save">OK</button>
              <button class="btn btn-ghost" data-act="cancel">✕</button>
            </div>
          </td>
        </tr>`;
      }
      return `<tr data-id="${item.id}">
        <td class="tight">${itemIcon(item.name, 1.5)}</td>
        <td>${escapeHtml(item.name)}</td>
        <td class="center">${item.weight} kg</td>
        <td class="center">${item.value}</td>
        <td class="center">
          <div class="row gap-1" style="justify-content:center;">
            <button class="icon-btn" data-act="edit" aria-label="Edit ${escapeHtml(item.name)}">${icon("pencil", 0.75)}</button>
            <button class="icon-btn danger" data-act="remove" aria-label="Hapus ${escapeHtml(item.name)}">${icon("trash", 0.75)}</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");

  // bind row actions
  body.querySelectorAll("button[data-act]").forEach((btn) => {
    const tr = btn.closest("tr");
    const id = tr.getAttribute("data-id");
    const act = btn.getAttribute("data-act");
    btn.addEventListener("click", () => {
      if (act === "edit") {
        state.editingId = id;
        renderItems();
      } else if (act === "remove") {
        removeItem(id);
      } else if (act === "cancel") {
        state.editingId = null;
        renderItems();
      } else if (act === "save") {
        editItem(id, {
          name: tr.querySelector('[data-f="name"]').value,
          weight: Number(tr.querySelector('[data-f="weight"]').value),
          value: Number(tr.querySelector('[data-f="value"]').value),
        });
      }
    });
  });

  // stats
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  const totalValue = items.reduce((s, i) => s + i.value, 0);
  $("statCount").textContent = items.length;
  $("statWeight").textContent = totalWeight;
  $("statValue").textContent = totalValue;
  document.querySelectorAll(".stat-icon").forEach((el) => {
    el.innerHTML = icon(el.getAttribute("data-icon"), 1);
  });
}

// ============================================================
// Proses / kontrol langkah
// ============================================================
function handleStart() {
  if (state.items.length === 0 || state.capacity <= 0) return;
  state.error = "";
  state.currentStep = 1;
  state.dpStep = 0;
  // Hitung langsung di browser (sinkron, tanpa server)
  state.result = solveKnapsack(
    state.capacity,
    state.items.map(({ name, weight, value }) => ({ name, weight, value }))
  );
  // posisi awal evaluasi
  handleDPStepChange(0, state.items.length * (state.capacity + 1));
  renderMain();
}

function handlePrev() {
  state.currentStep = Math.max(0, state.currentStep - 1);
  renderMain();
}
function handleNext() {
  state.currentStep = Math.min(STEPS.length - 1, state.currentStep + 1);
  renderMain();
}

// Mirror dari logika React handleDPStepChange
function handleDPStepChange(step, totalSteps) {
  const { capacity, result, items } = state;
  if (step === 0) {
    state.currentEvalItem = 0;
    state.dpProgress = { weight: 0, value: 0 };
    state.currentStep = 1;
  } else if (step < totalSteps) {
    const row = Math.floor((step - 1) / (capacity + 1));
    const col = (step - 1) % (capacity + 1);
    state.currentEvalItem = row;
    if (result) {
      const currentValue = result.dp_table[row + 1][col];
      let usedWeight = 0;
      let tempW = col;
      for (let i = row + 1; i >= 1; i--) {
        if (result.dp_table[i][tempW] !== result.dp_table[i - 1][tempW]) {
          usedWeight += items[i - 1].weight;
          tempW -= items[i - 1].weight;
        }
      }
      state.dpProgress = { weight: usedWeight, value: currentValue };
    }
    state.currentStep = 1;
  } else {
    if (result) state.dpProgress = { weight: result.total_weight, value: result.total_value };
    state.currentStep = 2;
  }
}

// ============================================================
// Render bagian tengah + kanan
// ============================================================
function renderMain() {
  renderStepper();
  renderSimulation();
  renderControls();
  renderError();
  renderDP();
  renderSelectedPanel();
}

function renderStepper() {
  const cur = state.currentStep;
  $("stepper").innerHTML = STEPS.map((label, i) => {
    const completed = i < cur;
    const active = i === cur;
    const circleCls = completed ? "completed" : active ? "active" : "";
    const line = i < STEPS.length - 1 ? `<div class="step-line ${i < cur ? "done" : ""}"></div>` : "";
    return `<div class="step-item">
      <div class="step-col">
        <div class="step-circle ${circleCls}">${completed ? "✓" : i + 1}</div>
        <span class="step-label ${active ? "active" : ""}">${label}</span>
      </div>
      ${line}
    </div>`;
  }).join("");
}

function capPct(used, total) {
  return total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
}

// Panel tas dengan id pada bagian yang berubah, agar bisa di-update tanpa dibangun ulang
function bagPanel(used, value, capacity, greenBadge) {
  const pct = capacity > 0 ? Math.round((used / capacity) * 100) : 0;
  return `<div class="sim-panel bag">
    <div class="bag-col">
      <p class="xs medium muted mb-2">Tas Saat Ini</p>
      <img src="items/tas.png" alt="Tas" width="140" height="140" />
    </div>
    <div class="bag-info">
      <div>
        <p class="tiny" style="margin-bottom:0.25rem;">Kapasitas Terpakai</p>
        <p class="sm bold"><span id="bagUsed">${used}</span> kg / ${capacity} kg</p>
        <div class="cap-bar-track"><div id="bagFill" class="cap-bar-fill" style="width:0%"></div></div>
      </div>
      <div id="bagBadge" class="badge ${greenBadge ? "badge-green" : "badge-blue"}">${pct}%</div>
      <div>
        <p class="tiny">Nilai Saat Ini</p>
        <p class="sm bold">☆ <span id="bagValue">${value}</span> poin</p>
      </div>
    </div>
  </div>`;
}

const SIM_HEAD = `<div class="sim-head">
    <span class="icon-primary">${icon("play", 1)}</span>
    <div>
      <h3>Simulasi Langkah</h3>
      <p>Simulasi berjalan mengikuti algoritma mengevaluasi setiap barang.</p>
    </div>
  </div>`;

function buildSimulation(view) {
  const { items, capacity, result, currentEvalItem, dpProgress } = state;
  let content = "";
  if (view === 0) {
    content = `<div class="sim-row">
      <div class="sim-panel empty">
        <span style="color:#d1d5db;margin-bottom:0.5rem;">${icon("clipboard", 2.5)}</span>
        <p class="medium sm">Siap memulai</p>
        <p class="xs muted">Belum ada barang yang dievaluasi</p>
      </div>
      <span class="arrow">${icon("arrow", 1.25)}</span>
      ${bagPanel(0, 0, capacity, false)}
    </div>`;
  } else if (view === 1) {
    const item = items[currentEvalItem];
    const evalCard = item
      ? `<div class="eval-item">
          <span id="evalIcon">${itemIcon(item.name, 3.5)}</span>
          <p id="evalName" class="eval-name" style="margin-top:0.5rem;">${escapeHtml(item.name)}</p>
          <div class="row gap-3 xs muted" style="margin-top:0.25rem;">
            <span>△ <span id="evalWeight">${item.weight}</span> kg</span><span>☆ <span id="evalValue">${item.value}</span> poin</span>
          </div>
          <span class="eval-status"><span class="dot"></span>Sedang dievaluasi</span>
        </div>`
      : `<p class="xs muted center">Memulai evaluasi...</p>`;
    content = `<div class="sim-row">
      <div class="sim-panel">
        <p class="eval-label">Barang yang Sedang Dievaluasi</p>
        ${evalCard}
      </div>
      <span class="arrow dark">${icon("arrow", 1.25)}</span>
      ${bagPanel(dpProgress.weight, dpProgress.value, capacity, false)}
    </div>`;
  } else {
    const list = result && result.selected_items.length > 0
      ? `<div class="selected-list">` +
        result.selected_items.map((it) => `<div class="selected-row">
            ${itemIcon(it.name, 1.25)}
            <span class="xs medium">${escapeHtml(it.name)}</span>
            <span class="ml-auto" style="font-size:0.625rem;color:var(--muted);">${it.weight} kg · ${it.value} poin</span>
          </div>`).join("") +
        `</div>`
      : "";
    content = `<div class="sim-row" style="align-items:stretch;">
      <div class="sim-panel success">
        <div class="success-head">
          <span class="icon-success">${icon("trophy", 1.25)}</span>
          <p class="semibold sm">Solusi ditemukan!</p>
        </div>
        <p class="xs muted mb-3">Total nilai: ${dpProgress.value} poin | Kapasitas: ${dpProgress.weight}/${capacity} kg</p>
        ${list}
      </div>
      ${bagPanel(dpProgress.weight, dpProgress.value, capacity, true)}
    </div>`;
  }
  $("simulation").innerHTML = SIM_HEAD + content;
}

// Update nilai tanpa membangun ulang DOM → transisi CSS (bar kapasitas dll) berjalan mulus
function updateSimValues(view) {
  const { items, capacity, currentEvalItem, dpProgress } = state;
  const used = view === 0 ? 0 : dpProgress.weight;
  const value = view === 0 ? 0 : dpProgress.value;

  const bagUsed = $("bagUsed");
  if (bagUsed) bagUsed.textContent = used;
  const bagFill = $("bagFill");
  if (bagFill) bagFill.style.width = capPct(used, capacity) + "%";
  const bagValue = $("bagValue");
  if (bagValue) bagValue.textContent = value;
  const bagBadge = $("bagBadge");
  if (bagBadge) bagBadge.textContent = (capacity > 0 ? Math.round((used / capacity) * 100) : 0) + "%";

  if (view === 1) {
    const item = items[currentEvalItem];
    if (item) {
      const ic = $("evalIcon");
      if (ic) ic.innerHTML = itemIcon(item.name, 3.5);
      const nm = $("evalName");
      if (nm) nm.textContent = item.name;
      const wt = $("evalWeight");
      if (wt) wt.textContent = item.weight;
      const vl = $("evalValue");
      if (vl) vl.textContent = item.value;
    }
  }
}

function renderSimulation() {
  const view = state.currentStep;
  if (state.simView === view && $("simulation").querySelector(".sim-row")) {
    updateSimValues(view);
  } else {
    buildSimulation(view);
    state.simView = view;
    // set lebar bar di frame berikutnya agar transisi meluncur dari 0
    requestAnimationFrame(() => updateSimValues(view));
  }
}

function renderControls() {
  const c = $("controls");
  if (state.currentStep === 0) {
    const disabled = state.items.length === 0 || state.capacity <= 0;
    c.innerHTML = `<button id="startBtn" class="btn btn-primary" ${disabled ? "disabled" : ""}>Mulai Proses</button>`;
    $("startBtn").addEventListener("click", handleStart);
  } else {
    c.innerHTML = `<div class="row gap-2">
      <button id="prevBtn" class="btn btn-outline" ${state.currentStep <= 0 ? "disabled" : ""}>Sebelumnya</button>
      <button id="nextBtn" class="btn btn-outline" ${state.currentStep >= STEPS.length - 1 ? "disabled" : ""}>Selanjutnya</button>
    </div>`;
    $("prevBtn").addEventListener("click", handlePrev);
    $("nextBtn").addEventListener("click", handleNext);
  }
}

function renderError() {
  const el = $("error");
  el.classList.toggle("hidden", !state.error);
  el.textContent = state.error;
}

// ============================================================
// Matriks DP
// ============================================================
function renderDP() {
  const card = $("dpCard");
  if (!state.result) {
    card.classList.add("hidden");
    state.dpSig = null;
    return;
  }
  card.classList.remove("hidden");

  // Bangun rangka tabel sekali per hasil; setelah itu hanya update sel (animasi mulus)
  if (state.dpSig !== state.result) {
    buildDPTable();
    state.dpSig = state.result;
  }
  updateDP();
}

function buildDPTable() {
  const { result, items, capacity } = state;
  const dpTable = result.dp_table;
  const totalSteps = items.length * (capacity + 1);

  let head = `<th class="corner">Item \\ Cap</th>`;
  for (let j = 0; j <= capacity; j++) head += `<th>${j}</th>`;

  let rows = "";
  dpTable.forEach((row, i) => {
    let cells = `<td class="rowhead">${i === 0 ? "∅" : escapeHtml(items[i - 1] ? items[i - 1].name : "")}</td>`;
    row.forEach((cell, j) => {
      // baris 0 selalu tampil; sisanya diisi oleh updateDP
      cells += `<td data-r="${i}" data-c="${j}">${i === 0 ? cell : ""}</td>`;
    });
    rows += `<tr>${cells}</tr>`;
  });

  $("dpTable").innerHTML = `
    <div class="dp-status">
      <span class="muted">Step <span id="dpStepNum">0</span> / ${totalSteps}</span>
      <span id="dpDoneBadge"></span>
    </div>
    <div class="dp-scroll">
      <table class="dp-table">
        <thead><tr>${head}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="dp-controls">
      <button id="dpNext" class="dp-btn next">Next</button>
      <button id="dpPlay" class="dp-btn outline">Auto Play</button>
      <button id="dpReset" class="dp-btn reset">Reset</button>
    </div>`;

  $("dpNext").addEventListener("click", dpNext);
  $("dpPlay").addEventListener("click", dpTogglePlay);
  $("dpReset").addEventListener("click", dpReset);
}

function updateDP() {
  const { result, items, capacity, dpStep } = state;
  const dpTable = result.dp_table;
  const totalSteps = items.length * (capacity + 1);
  const isComplete = dpStep >= totalSteps;

  // status & tombol
  $("dpStepNum").textContent = dpStep;
  $("dpDoneBadge").innerHTML = isComplete
    ? `<span class="badge badge-green" style="font-size:0.625rem;">Selesai</span>`
    : "";
  $("dpNext").disabled = isComplete;
  $("dpPlay").textContent = state.dpPlaying ? "Pause" : "Auto Play";

  // baris pada jalur optimal (hanya saat selesai)
  const optimalRows = new Set();
  if (isComplete) {
    let w = capacity;
    for (let i = items.length; i >= 1; i--) {
      if (dpTable[i][w] !== dpTable[i - 1][w]) {
        optimalRows.add(i);
        w -= items[i - 1].weight;
      }
    }
  }

  // sel aktif saat ini
  let activeRow = -1, activeCol = -1;
  if (dpStep > 0 && dpStep <= totalSteps) {
    activeRow = Math.floor((dpStep - 1) / (capacity + 1)) + 1;
    activeCol = (dpStep - 1) % (capacity + 1);
  }

  $("dpTable").querySelectorAll("td[data-r]").forEach((td) => {
    const i = +td.dataset.r;
    const j = +td.dataset.c;
    if (i === 0) return; // selalu tampil, tak berubah

    const visible = (i - 1) * (capacity + 1) + j < dpStep;
    const active = i === activeRow && j === activeCol;
    const optimal = isComplete && optimalRows.has(i) && j === capacity;

    td.textContent = visible ? dpTable[i][j] : "";

    let cls = "";
    if (active) cls = "active";
    else if (optimal) cls = "optimal";
    else if (!visible) cls = "hidden-cell";
    // assign hanya jika berubah → animasi pop tidak terpicu ulang tanpa perlu
    if (td.className !== cls) td.className = cls;
  });
}

function setDpStep(step) {
  state.dpStep = step;
  const totalSteps = state.items.length * (state.capacity + 1);
  handleDPStepChange(step, totalSteps);
  renderMain();
}

function dpNext() {
  const totalSteps = state.items.length * (state.capacity + 1);
  if (state.dpStep < totalSteps) setDpStep(state.dpStep + 1);
}

function dpTogglePlay() {
  const totalSteps = state.items.length * (state.capacity + 1);
  if (state.dpPlaying) {
    clearInterval(state.dpInterval);
    state.dpInterval = null;
    state.dpPlaying = false;
    renderMain();
  } else {
    state.dpPlaying = true;
    state.dpInterval = setInterval(() => {
      if (state.dpStep >= totalSteps) {
        clearInterval(state.dpInterval);
        state.dpInterval = null;
        state.dpPlaying = false;
        renderMain();
        return;
      }
      setDpStep(state.dpStep + 1);
    }, 500);
    renderMain();
  }
}

function dpReset() {
  if (state.dpInterval) clearInterval(state.dpInterval);
  state.dpInterval = null;
  state.dpPlaying = false;
  setDpStep(0);
}

// ============================================================
// Panel kanan (Barang Terpilih)
// ============================================================
function renderSelectedPanel() {
  const { result, capacity, currentStep } = state;
  const isComplete = currentStep === 2;
  const hasItems = isComplete && result && result.selected_items.length > 0;
  const el = $("selectedContent");

  if (!hasItems) {
    el.innerHTML = `<div class="sp-empty">
      <span class="icon-gray">${icon("package", 3)}</span>
      <p class="sm medium" style="color:#9ca3af;">Belum ada barang dipilih</p>
      <p class="xs muted" style="margin-top:0.25rem;">Mulai proses untuk memilih barang secara optimal.</p>
    </div>`;
    return;
  }

  const list = result.selected_items
    .map((it) => `<div class="sp-card">
      ${itemIcon(it.name, 2)}
      <div class="flex-1" style="min-width:0;">
        <p class="name">${escapeHtml(it.name)}</p>
        <p style="font-size:0.625rem;color:var(--muted);">${it.weight} kg · ${it.value} poin</p>
      </div>
    </div>`).join("");

  el.innerHTML = `<div class="flex-1 stack-sm">${list}</div>
    <div class="sp-totals">
      <div class="sp-row"><span class="muted">Kapasitas Terpakai</span><span class="medium">${result.total_weight} kg / ${capacity} kg</span></div>
      <div class="sp-row"><span class="muted">Total Nilai</span><span class="medium">${result.total_value} poin</span></div>
      <div class="sp-row"><span class="muted">Jumlah Barang</span><span class="medium">${result.selected_items.length} item</span></div>
    </div>`;
}

// ============================================================
// Init
// ============================================================
initSidebar();
renderItems();
renderMain();
