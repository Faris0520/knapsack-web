# Penjelasan Project: Knapsack Optimizer

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tujuan Project](#2-tujuan-project)
3. [Tech Stack](#3-tech-stack)
4. [Struktur Folder](#4-struktur-folder)
5. [Alur Kerja Aplikasi](#5-alur-kerja-aplikasi)
6. [Frontend (HTML/CSS/JS)](#6-frontend-htmlcssjs)
7. [Backend & Algoritma](#7-backend--algoritma)
8. [Format Data (Request & Response)](#8-format-data-request--response)
9. [Integrasi Frontend ↔ Backend](#9-integrasi-frontend--backend)
10. [Tampilan & Styling](#10-tampilan--styling)
11. [Cara Menjalankan](#11-cara-menjalankan)
12. [Aset](#12-aset)
13. [Ringkasan Singkat](#13-ringkasan-singkat)

---

## 1. Gambaran Umum

**Knapsack Optimizer** adalah aplikasi web interaktif yang memvisualisasikan dan menyelesaikan masalah klasik **0/1 Knapsack Problem** menggunakan teknik **Dynamic Programming (DP)**. Aplikasi ini bersifat edukatif — pengguna dapat menambahkan barang-barang dengan berat dan nilai tertentu, lalu menyaksikan bagaimana algoritma bekerja secara langkah demi langkah (step-by-step) untuk menemukan kombinasi barang yang paling optimal agar muat dalam tas dengan kapasitas terbatas dan menghasilkan total nilai tertinggi.

Versi ini dibuat **polos**: antarmuka memakai **HTML, CSS, dan JavaScript murni** (tanpa framework seperti React/Next.js), sedangkan **algoritma dijalankan di server Python (Flask)**. Satu server Flask menyajikan halaman web sekaligus melayani perhitungan, jadi cukup satu perintah untuk menjalankannya.

Bahasa antarmuka yang digunakan adalah **Bahasa Indonesia**, cocok untuk keperluan edukasi di lingkungan akademik Indonesia.

---

## 2. Tujuan Project

### Masalah yang Diselesaikan

**0/1 Knapsack Problem** adalah masalah optimasi klasik dalam ilmu komputer:

> Diberikan sekumpulan barang, masing-masing dengan berat dan nilai tertentu, tentukan barang-barang mana yang harus dimasukkan ke dalam tas dengan kapasitas berat terbatas sehingga total nilainya **maksimal**, dan setiap barang hanya boleh diambil **satu kali** (0 atau 1).

### Fitur Utama

- Visualisasi **tabel DP** secara interaktif (per sel, berwarna)
- **Step-by-step simulation** dengan kontrol manual dan auto-play
- Manajemen barang: tambah, edit (inline), hapus, randomisasi
- 7 **preset barang** siap pakai (Laptop, Buku, Charger, dll.) + opsi Custom
- Tampilan hasil: barang terpilih, total berat, total nilai
- Antarmuka 3 tahap (wizard) yang mudah dipahami
- Animasi mulus (capacity bar, reveal sel DP) dengan dukungan `prefers-reduced-motion`

---

## 3. Tech Stack

### Frontend (tanpa framework)

| Teknologi | Fungsi |
|---|---|
| HTML5 | Struktur halaman (`index.html`) |
| CSS3 | Styling, tema, animasi (`style.css`) |
| JavaScript (vanilla) | Logika UI & state (`app.js`) — tanpa build step |
| Ikon SVG inline | Gaya Lucide, didefinisikan langsung di `app.js` |
| Google Sans | Font di-host lokal di `fonts/` |

### Backend

| Teknologi | Fungsi |
|---|---|
| Flask (Python) | Menyajikan file statis **dan** endpoint `POST /solve` |
| `knapsack.py` | Implementasi algoritma 0/1 Knapsack (DP) |

Tidak ada build tool, bundler, atau dependensi Node.js. Satu-satunya dependensi adalah **Flask** (lihat `requirements.txt`).

---

## 4. Struktur Folder

```
D:\Koding\knapsack/
│
├── app.py              # Server Flask: sajikan file statis + endpoint /solve
├── knapsack.py         # Algoritma 0/1 Knapsack (Dynamic Programming)
├── requirements.txt    # Dependensi Python (flask>=3.0)
│
├── index.html          # Struktur halaman (sidebar | area simulasi | panel)
├── app.js              # Logika UI: state, render, panggil /solve via fetch
├── style.css           # Styling, tema (CSS variables), animasi
│
├── fonts/              # Google Sans (woff2): Regular, Medium, Bold, Italic
│   ├── GoogleSans-Regular.woff2
│   ├── GoogleSans-Medium.woff2
│   ├── GoogleSans-Bold.woff2
│   ├── GoogleSans-Italic.woff2
│   └── GoogleSans-MediumItalic.woff2
│
└── items/              # Gambar ikon barang (PNG)
    ├── tas.png         # logo aplikasi
    ├── laptop.png
    ├── buku.png
    ├── charger.png
    ├── botol-minum.png
    ├── kotak-pensil.png
    ├── powerbank.png
    └── jaket.png
```

---

## 5. Alur Kerja Aplikasi

Aplikasi menggunakan alur wizard **3 langkah**:

```
[Langkah 0: Mulai] → [Langkah 1: Evaluasi Barang] → [Langkah 2: Hasil Optimal]
```

### Langkah 0 — Mulai

- Pengguna melihat tampilan awal dengan tas kosong di area simulasi
- Di sidebar kiri, pengguna mengatur:
  - **Kapasitas tas** (dalam kg)
  - **Daftar barang** yang akan dimasukkan
- Pengguna dapat menambah barang dari preset atau mengisi manual (custom)
- Setelah siap, klik **"Mulai"** → `app.js` mengirim data ke server Flask

### Langkah 1 — Evaluasi Barang

- Data dikirim ke server via `fetch('/solve')` (POST)
- Server (`knapsack.py`) menghitung tabel DP dan barang yang dipilih, lalu
  mengembalikan JSON
- Frontend menampilkan:
  - **Area simulasi**: visual barang yang sedang dievaluasi + indikator kapasitas
  - **Matriks DP**: tabel DP yang bisa dinavigasi sel per sel
- Pengguna dapat melangkah manual (tombol "Next") atau play otomatis

### Langkah 2 — Hasil Optimal

- Setelah simulasi selesai, tampil hasil akhir:
  - **Area simulasi**: visual barang-barang yang terpilih di dalam tas
  - **Panel kanan**: daftar barang terpilih + total berat & nilai

---

## 6. Frontend (HTML/CSS/JS)

### `index.html` — Struktur Halaman

Layout 3 kolom dalam satu container `.app`:

- **`<aside class="sidebar">`** (kiri) — input kapasitas, kelola barang, tabel barang, statistik
- **`<main class="main">`** (tengah) — stepper, area simulasi, kontrol, kartu matriks DP
- **`<aside class="selected-panel">`** (kanan) — barang terpilih

Di bagian bawah hanya memuat satu skrip:

```html
<script src="app.js"></script>
```

### `app.js` — Logika UI

Seluruh perilaku aplikasi ada di sini. Bagian-bagian utamanya:

**Konstanta**

- `ICONS` & `icon()` — kumpulan path SVG inline (gaya Lucide) dan helper render-nya
- `PRESETS` — 7 preset barang + Custom:

  | Barang | Berat | Nilai |
  |---|---|---|
  | Laptop | 3 kg | 10 |
  | Buku | 2 kg | 8 |
  | Charger | 1 kg | 7 |
  | Botol Minum | 1 kg | 5 |
  | Kotak Pensil | 1 kg | 6 |
  | Powerbank | 1 kg | 8 |
  | Jaket | 2 kg | 7 |

- `IMAGE_MAP` — pemetaan nama barang → file gambar di `items/`
- `STEPS = ["Mulai", "Evaluasi Barang", "Hasil Optimal"]`
- Utilitas: `uid()` (ID unik lintas-browser), `escapeHtml()`, `itemIcon()`

**State global (`state`)**

```javascript
items          // Daftar barang { id, name, weight, value }
capacity       // Kapasitas tas (kg)
result         // Hasil dari server (dp_table, selected_items, ...)
currentStep    // Langkah wizard (0, 1, 2)
currentEvalItem, dpProgress   // Posisi evaluasi & progress kapasitas
dpStep, dpPlaying, dpInterval // Sub-state navigasi tabel DP
selectedPreset, editingId     // State form sidebar
simView, dpSig, dpPrevStep    // Pelacak render incremental untuk animasi mulus
```

**Fungsi penting**

- `initSidebar()`, `renderPresetArea()` — isi dropdown preset & form custom
- `handleAdd()`, `handleRandom()` — tambah barang (manual/preset/acak)
- `handleStart()` — **async**; kirim `POST /solve` ke Flask, simpan hasil ke `state.result`, lalu mulai animasi (lihat bagian 9)
- `handlePrev()` / `handleNext()` — navigasi langkah wizard
- `handleDPStepChange()` — sinkronisasi posisi sel DP dengan area simulasi
- `renderMain()` & fungsi render tabel DP — menggambar ulang UI; memakai update DOM incremental agar animasi tidak "loncat"

### `style.css` — Styling & Animasi

- `@font-face` untuk Google Sans (woff2 lokal)
- Tema lewat CSS variables (lihat bagian 10)
- Sistem animasi (capacity bar, pulsing dot evaluasi, transisi sel DP) dengan dukungan `@media (prefers-reduced-motion: reduce)` untuk aksesibilitas

---

## 7. Backend & Algoritma

### `app.py` — Server Flask

Server menyajikan **dua hal sekaligus** dari folder yang sama:

```python
from flask import Flask, request, jsonify, send_from_directory
from knapsack import solve_knapsack

app = Flask(__name__, static_folder="", static_url_path="")

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/solve", methods=["POST"])
def solve():
    data = request.get_json(silent=True) or {}
    capacity = int(data.get("capacity", 0))
    items = data.get("items", [])
    return jsonify(solve_knapsack(items, capacity))

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
```

1. **File statis** (`index.html`, `app.js`, `style.css`, `fonts/`, `items/`) disajikan langsung dari root URL.
2. **Endpoint `POST /solve`** menjalankan algoritma dan membalas JSON.

Karena frontend dan API berada di **origin yang sama**, tidak diperlukan konfigurasi CORS.

### `knapsack.py` — Algoritma Inti

Implementasi **0/1 Knapsack dengan Dynamic Programming**.

#### Fase 1 — Membangun Tabel DP

```python
# Tabel berukuran (n+1) x (capacity+1), diinisialisasi 0
dp = [[0] * (capacity + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    berat = items[i - 1]["weight"]
    nilai = items[i - 1]["value"]
    for w in range(capacity + 1):
        if berat <= w:
            # Pilih maksimum: TIDAK ambil vs AMBIL barang ke-i
            dp[i][w] = max(dp[i - 1][w], nilai + dp[i - 1][w - berat])
        else:
            # Barang tidak muat -> warisi nilai dari baris atas
            dp[i][w] = dp[i - 1][w]
```

- **`dp[i][w]`** = nilai optimal memakai `i` barang pertama dengan kapasitas `w`
- Setiap barang hanya bisa diambil **0 atau 1 kali** (0/1 Knapsack)

#### Fase 2 — Backtracking (menentukan barang terpilih)

```python
selected = []
w = capacity
for i in range(n, 0, -1):
    if dp[i][w] != dp[i - 1][w]:   # nilai berubah -> barang ke-i diambil
        selected.append(items[i - 1])
        w -= items[i - 1]["weight"]
selected.reverse()
```

Melacak mundur dari `dp[n][capacity]` untuk menentukan barang mana saja yang dipilih, lalu mengembalikan hasil (lihat bagian 8).

---

## 8. Format Data (Request & Response)

### Request — `POST /solve`

```json
{
  "capacity": 7,
  "items": [
    { "name": "Laptop", "weight": 3, "value": 10 },
    { "name": "Buku",   "weight": 2, "value": 8  }
  ]
}
```

### Response

```json
{
  "dp_table": [[0, 0, "..."], ["..."]],
  "selected_items": [
    { "name": "Laptop", "weight": 3, "value": 10 }
  ],
  "total_weight": 3,
  "total_value": 10
}
```

| Field | Tipe | Keterangan |
|---|---|---|
| `dp_table` | `int[][]` | Seluruh tabel DP (untuk visualisasi) |
| `selected_items` | objek `{name, weight, value}[]` | Barang yang dipilih algoritma |
| `total_weight` | `int` | Total berat barang terpilih |
| `total_value` | `int` | Total nilai optimal (`dp[n][capacity]`) |

Format ini **identik** dengan versi lama, sehingga seluruh logika animasi di `app.js` tetap berfungsi.

---

## 9. Integrasi Frontend ↔ Backend

Inti integrasi ada di `handleStart()` dalam `app.js`:

```javascript
async function handleStart() {
  if (state.items.length === 0 || state.capacity <= 0) return;
  state.error = "";
  state.currentStep = 1;
  state.dpStep = 0;
  try {
    const res = await fetch("/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        capacity: state.capacity,
        items: state.items.map(({ name, weight, value }) => ({ name, weight, value })),
      }),
    });
    if (!res.ok) throw new Error("Server membalas status " + res.status);
    state.result = await res.json();
  } catch (err) {
    state.error = "Gagal menghubungi server: " + err.message;
    renderMain();
    return;
  }
  handleDPStepChange(0, state.items.length * (state.capacity + 1));
  renderMain();
}
```

- Memakai URL **relatif** `/solve` karena halaman & API satu origin (Flask).
- Penanganan error: jika server tidak terjangkau / membalas status non-OK, pesan ditampilkan di UI.
- Setelah `state.result` terisi, animasi langkah demi langkah dimulai.

---

## 10. Tampilan & Styling

### Tema (CSS Variables di `style.css`)

```css
:root {
  --background:  #f5f7fa;  /* Abu-biru terang */
  --foreground:  #1a1a2e;  /* Teks gelap */
  --card:        #ffffff;  /* Latar kartu */
  --primary:     #2563eb;  /* Biru utama */
  --primary-fg:  #ffffff;  /* Teks di atas primary */
  --muted:       #6b7280;  /* Teks sekunder */
  --border:      #e5e7eb;  /* Border terang */
  --destructive: #ef4444;  /* Merah (hapus/error) */
  --success:     #22c55e;  /* Hijau (konfirmasi) */
}
```

### Font

- **Google Sans** di-host lokal di `fonts/` (Regular, Medium, Bold, + Italic) untuk menghindari ketergantungan pada Google Fonts CDN.

### Layout Keseluruhan

```
┌─────────────────────────────────────────────────────────────┐
│                          Stepper                            │
├──────────────┬──────────────────────────────┬───────────────┤
│              │                              │               │
│  Sidebar     │     Area Simulasi            │ Barang        │
│  (kelola     │     + Matriks DP             │ Terpilih      │
│   barang)    │                              │ (panel kanan) │
│              │                              │               │
└──────────────┴──────────────────────────────┴───────────────┘
```

---

## 11. Cara Menjalankan

```bash
# 1. Pasang dependensi Python
pip install -r requirements.txt

# 2. Jalankan server Flask
python app.py
```

Lalu buka **http://127.0.0.1:5000** di browser.

Karena Flask menyajikan file statis sekaligus API, **cukup satu perintah dan satu URL** — tidak perlu menjalankan server frontend terpisah.

---

## 12. Aset

### `fonts/`

Font **Google Sans** dalam beberapa weight (Regular, Medium, Bold) + varian italic, untuk tampilan konsisten tanpa CDN.

### `items/`

Gambar ikon PNG untuk setiap preset barang:

| File | Barang |
|---|---|
| `tas.png` | Ikon tas (logo app) |
| `laptop.png` | Laptop |
| `buku.png` | Buku |
| `charger.png` | Charger |
| `botol-minum.png` | Botol Minum |
| `kotak-pensil.png` | Kotak Pensil |
| `powerbank.png` | Powerbank |
| `jaket.png` | Jaket |

Untuk barang custom/tidak dikenal, ditampilkan ikon `package` (SVG inline).

---

## 13. Ringkasan Singkat

| Aspek | Detail |
|---|---|
| **Jenis Aplikasi** | Web app edukasi interaktif |
| **Masalah yang Diselesaikan** | 0/1 Knapsack Problem |
| **Algoritma** | Dynamic Programming (di server) |
| **Frontend** | HTML/CSS/JavaScript polos (tanpa framework) |
| **Backend** | Python (Flask) — sajikan statis + `POST /solve` |
| **Komunikasi** | `fetch('/solve')`, satu origin (tanpa CORS) |
| **Cara Jalan** | `python app.py` → buka `http://127.0.0.1:5000` |
| **Bahasa Antarmuka** | Bahasa Indonesia |
| **Target Pengguna** | Mahasiswa / pelajar yang belajar algoritma |
