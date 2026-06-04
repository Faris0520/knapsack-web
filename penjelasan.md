# Penjelasan Project: Knapsack Optimizer

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tujuan Project](#2-tujuan-project)
3. [Tech Stack](#3-tech-stack)
4. [Struktur Folder](#4-struktur-folder)
5. [Alur Kerja Aplikasi](#5-alur-kerja-aplikasi)
6. [Komponen Frontend](#6-komponen-frontend)
7. [Backend & Algoritma](#7-backend--algoritma)
8. [Tipe Data & Interface](#8-tipe-data--interface)
9. [Integrasi API](#9-integrasi-api)
10. [Tampilan & Styling](#10-tampilan--styling)
11. [Konfigurasi Project](#11-konfigurasi-project)
12. [Aset Publik](#12-aset-publik)

---

## 1. Gambaran Umum

**Knapsack Optimizer** adalah aplikasi web interaktif yang memvisualisasikan dan menyelesaikan masalah klasik **0/1 Knapsack Problem** menggunakan teknik **Dynamic Programming (DP)**. Aplikasi ini bersifat edukatif — pengguna dapat menambahkan barang-barang dengan berat dan nilai tertentu, lalu menyaksikan bagaimana algoritma bekerja secara langkah demi langkah (step-by-step) untuk menemukan kombinasi barang yang paling optimal agar muat dalam tas dengan kapasitas terbatas dan menghasilkan total nilai tertinggi.

Bahasa antarmuka yang digunakan adalah **Bahasa Indonesia**, cocok untuk keperluan edukasi di lingkungan akademik Indonesia.

---

## 2. Tujuan Project

### Masalah yang Diselesaikan

**0/1 Knapsack Problem** adalah masalah optimasi klasik dalam ilmu komputer:

> Diberikan sekumpulan barang, masing-masing dengan berat dan nilai tertentu, tentukan barang-barang mana yang harus dimasukkan ke dalam tas dengan kapasitas berat terbatas sehingga total nilainya **maksimal**, dan setiap barang hanya boleh diambil **satu kali** (0 atau 1).

### Fitur Utama

- Visualisasi **tabel DP** secara interaktif (per sel, berwarna)
- **Step-by-step simulation** dengan kontrol manual dan auto-play
- Manajemen barang: tambah, edit, hapus, randomisasi
- 8 **preset barang** siap pakai (Laptop, Buku, Charger, dll.)
- Tampilan hasil: barang terpilih, total berat, total nilai
- Antarmuka 3 tahap (wizard) yang mudah dipahami

---

## 3. Tech Stack

### Frontend

| Teknologi | Versi | Fungsi |
|---|---|---|
| Next.js | 16.2.6 | Framework React dengan SSR/SSG |
| React | 19.2.4 | Library UI utama |
| TypeScript | 5 | Type safety dan DX |
| Tailwind CSS | 4 | Utility-first styling |
| Lucide React | ^1.16.0 | Ikon SVG |

### Backend

| Teknologi | Fungsi |
|---|---|
| FastAPI (Python) | REST API server |
| Pydantic | Validasi request/response |
| CORS Middleware | Izinkan akses dari frontend |

### Deployment

- Backend di-deploy di **Vercel**: `https://knapsack-web-wix4.vercel.app`
- Frontend menggunakan **Next.js App Router**

---

## 4. Struktur Folder

```
D:\Koding\knapsack/
│
├── src/                          # Source code frontend
│   ├── app/
│   │   ├── layout.tsx            # Root layout (font, metadata)
│   │   ├── page.tsx              # Halaman utama (entry point)
│   │   └── globals.css           # Global styles & CSS variables
│   │
│   ├── components/
│   │   ├── ui/                   # Komponen UI dasar (reusable)
│   │   │   ├── button.tsx        # Tombol dengan varian
│   │   │   ├── card.tsx          # Wrapper kartu
│   │   │   ├── input.tsx         # Input field dengan suffix opsional
│   │   │   └── Select.tsx        # Dropdown select
│   │   │
│   │   ├── Sidebar.tsx           # Panel kiri: manajemen barang
│   │   ├── Stepper.tsx           # Indikator langkah (3 step)
│   │   ├── SimulationArea.tsx    # Area visualisasi utama
│   │   ├── DPTable.tsx           # Tabel Dynamic Programming interaktif
│   │   ├── SelectedPanel.tsx     # Panel kanan: hasil barang terpilih
│   │   └── ItemIcon.tsx          # Render ikon/gambar barang
│   │
│   ├── lib/
│   │   ├── api.ts                # Fungsi pemanggil API backend
│   │   └── utils.ts              # Utilitas (fungsi `cn`)
│   │
│   └── types/
│       └── index.ts              # Interface & type definitions
│
├── backend/
│   ├── main.py                   # FastAPI app + endpoint /solve
│   ├── knapsack.py               # Implementasi algoritma DP
│   └── test_knapsack.py          # Unit test algoritma
│
├── public/
│   ├── fonts/                    # Font Google Sans (lokal)
│   └── items/                    # Gambar ikon barang (PNG)
│       ├── tas.png
│       ├── laptop.png
│       ├── buku.png
│       ├── charger.png
│       ├── botol.png
│       ├── pensil.png
│       ├── powerbank.png
│       └── jaket.png
│
├── package.json                  # Dependensi & skrip Node.js
├── tsconfig.json                 # Konfigurasi TypeScript
├── next.config.ts                # Konfigurasi Next.js
├── postcss.config.mjs            # Konfigurasi PostCSS/Tailwind
├── .env.example                  # Template environment variables
├── CLAUDE.md                     # Instruksi untuk AI Claude
├── AGENTS.md                     # Catatan khusus Next.js versi ini
└── penjelasan.md                 # File ini
```

---

## 5. Alur Kerja Aplikasi

Aplikasi menggunakan alur wizard **3 langkah**:

```
[Langkah 0: Mulai] → [Langkah 1: Evaluasi Barang] → [Langkah 2: Hasil Optimal]
```

### Langkah 0 — Mulai (`page.tsx`)

- Pengguna melihat tampilan awal dengan tas kosong di area simulasi
- Di sidebar kiri, pengguna mengatur:
  - **Kapasitas tas** (dalam kg)
  - **Daftar barang** yang akan dimasukkan
- Pengguna dapat menambah barang dari preset atau mengisi manual
- Setelah siap, klik **"Mulai Proses"** untuk mengirim data ke backend

### Langkah 1 — Evaluasi Barang

- Data dikirim ke backend via POST request
- Backend menghitung tabel DP dan item yang dipilih
- Frontend menampilkan:
  - **SimulationArea**: visual barang yang sedang dievaluasi
  - **DPTable**: tabel DP yang bisa dinavigasi sel per sel
- Pengguna dapat melangkah manual (tombol "Next") atau play otomatis

### Langkah 2 — Hasil Optimal

- Setelah simulasi selesai, tampil hasil akhir:
  - **SimulationArea**: visual barang-barang yang terpilih di dalam tas
  - **SelectedPanel**: daftar barang terpilih + total berat & nilai

---

## 6. Komponen Frontend

### `src/app/page.tsx` — Halaman Utama

File terpenting di frontend. Bertanggung jawab atas:

- **State management** global: daftar item, kapasitas, hasil solve, step saat ini, index simulasi
- Memanggil API `solveKnapsack` saat pengguna mulai proses
- Meneruskan data ke komponen anak via props
- Merender layout 3 kolom: Sidebar | Area Tengah | SelectedPanel

State utama:
```typescript
items: Item[]                    // Daftar barang
capacity: number                 // Kapasitas tas (kg)
solveResult: SolveResponse | null // Hasil dari backend
currentStep: number              // Langkah wizard (0, 1, 2)
currentSimIndex: number          // Index langkah simulasi DP
```

---

### `src/components/Sidebar.tsx` — Panel Kiri

Lebar **340px**, berisi:

- **Input kapasitas** tas (angka, dalam kg)
- **Dropdown preset** 8 jenis barang:
  - Laptop (3 kg, 10 poin)
  - Buku (2 kg, 8 poin)
  - Charger (1 kg, 7 poin)
  - Botol Minum (1 kg, 5 poin)
  - Kotak Pensil (1 kg, 6 poin)
  - Powerbank (1 kg, 8 poin)
  - Jaket (2 kg, 7 poin)
  - Custom (isi manual)
- **Tombol tambah** barang dan **randomisasi** barang acak
- **Tabel barang** dengan mode edit inline (nama, berat, nilai)
- **Statistik ringkas**: jumlah barang, total berat, total nilai
- **Tombol "Mulai Proses"** (aktif jika ada minimal 1 barang)

---

### `src/components/SimulationArea.tsx` — Area Simulasi

Area tengah yang berubah sesuai langkah:

- **Langkah 0**: Menampilkan ilustrasi tas kosong
- **Langkah 1**: Menampilkan barang yang sedang dievaluasi algoritma beserta indikator kapasitas terpakai
- **Langkah 2**: Menampilkan animasi/visual barang-barang yang masuk ke dalam tas sebagai hasil optimal

---

### `src/components/DPTable.tsx` — Tabel Dynamic Programming

Komponen paling teknis. Menampilkan tabel DP berukuran `(n+1) × (kapasitas+1)`:

- **Navigasi sel**: tombol "Next" untuk maju satu langkah
- **Auto Play**: otomatis melanjutkan dengan interval waktu
- **Reset**: kembali ke awal
- **Warna sel**:
  - **Hijau**: sel yang sedang aktif diproses
  - **Biru**: jalur optimal (backtracking)
  - **Putih/Abu**: sel yang sudah selesai
- Memancarkan event `onStepChange` ke parent untuk sinkronisasi dengan `SimulationArea`

---

### `src/components/SelectedPanel.tsx` — Panel Kanan

Lebar **280px**, menampilkan:

- Daftar barang yang dipilih oleh algoritma (dengan ikon)
- Total berat dan total nilai optimal
- Jumlah barang terpilih
- **Empty state** saat simulasi belum selesai

---

### `src/components/Stepper.tsx` — Indikator Langkah

Komponen navigasi visual di bagian atas, menampilkan 3 langkah:

1. **Mulai** — Pengaturan awal
2. **Evaluasi Barang** — Proses algoritma
3. **Hasil Optimal** — Tampil hasil

Langkah selesai ditandai ikon centang (✓), langkah aktif ditandai titik.

---

### `src/components/ItemIcon.tsx` — Ikon Barang

Memetakan nama preset ke file gambar PNG di `/public/items/`:

```
"Laptop"       → /items/laptop.png
"Buku"         → /items/buku.png
"Charger"      → /items/charger.png
"Botol Minum"  → /items/botol.png
"Kotak Pensil" → /items/pensil.png
"Powerbank"    → /items/powerbank.png
"Jaket"        → /items/jaket.png
```

Untuk barang custom atau tidak dikenal, menampilkan ikon `Package` dari Lucide React.

---

### `src/components/ui/` — Komponen UI Dasar

#### `button.tsx`
Tombol dengan 4 varian:
- `primary` — biru solid (aksi utama)
- `outline` — border biru, background transparan
- `ghost` — tanpa border/background
- `destructive` — merah, untuk hapus

#### `input.tsx`
Input teks dengan prop `suffix` opsional (contoh: tampilkan "kg" di kanan input).

#### `card.tsx`
Wrapper dengan padding dan shadow ringan, dipakai sebagai kontainer section.

#### `Select.tsx`
Dropdown select berbasis HTML `<select>` dengan styling Tailwind.

---

## 7. Backend & Algoritma

### `backend/main.py` — FastAPI Server

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)

@app.post("/solve")
def solve(request: SolveRequest) -> SolveResponse:
    ...
```

Satu-satunya endpoint: `POST /solve`

### `backend/knapsack.py` — Algoritma Inti

Implementasi **0/1 Knapsack dengan Dynamic Programming**:

#### Fase 1: Membangun Tabel DP

```python
# Inisialisasi tabel berukuran (n+1) x (capacity+1) dengan 0
dp = [[0] * (capacity + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    weight = items[i-1].weight
    value  = items[i-1].value
    for j in range(capacity + 1):
        if weight <= j:
            # Pilih nilai maksimum: ambil atau tidak ambil barang ke-i
            dp[i][j] = max(dp[i-1][j], dp[i-1][j-weight] + value)
        else:
            # Barang terlalu berat, tidak bisa diambil
            dp[i][j] = dp[i-1][j]
```

- **`dp[i][j]`** = nilai optimal menggunakan `i` barang pertama dengan kapasitas `j`
- Setiap barang hanya bisa diambil **0 atau 1 kali** (0/1 Knapsack)

#### Fase 2: Backtracking untuk Menemukan Barang Terpilih

```python
selected = []
j = capacity
for i in range(n, 0, -1):
    if dp[i][j] != dp[i-1][j]:
        selected.append(items[i-1])
        j -= items[i-1].weight
```

Melacak mundur dari `dp[n][capacity]` untuk menentukan barang mana saja yang dipilih.

#### Response yang dikembalikan:

```python
{
  "dp_table":      [[...], [...], ...],  # Seluruh tabel DP
  "selected_items": [...],               # Barang-barang terpilih
  "total_weight":  int,
  "total_value":   int
}
```

### `backend/test_knapsack.py` — Unit Test

Berisi test case untuk memvalidasi kebenaran algoritma, mencakup:
- Kasus normal (beberapa barang, kapasitas terbatas)
- Kasus edge (tas kosong, tidak ada barang yang muat)

---

## 8. Tipe Data & Interface

Semua type definitions ada di `src/types/index.ts`:

### `Item`

```typescript
interface Item {
  id: string       // UUID unik setiap barang
  name: string     // Nama barang
  weight: number   // Berat dalam kg
  value: number    // Nilai/utilitas barang (poin)
  image?: string   // Opsional: path gambar
}
```

### `SolveRequest`

```typescript
interface SolveRequest {
  capacity: number
  items: {
    name: string
    weight: number
    value: number
  }[]
}
```

### `SolveResponse`

```typescript
interface SolveResponse {
  dp_table: number[][]           // Matriks DP lengkap
  selected_items: {
    name: string
    weight: number
    value: number
  }[]
  total_weight: number
  total_value: number
}
```

---

## 9. Integrasi API

### `src/lib/api.ts`

```typescript
const BASE_URL = "https://knapsack-web-wix4.vercel.app"

export async function solveKnapsack(request: SolveRequest): Promise<SolveResponse> {
  const response = await fetch(`${BASE_URL}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  return response.json()
}
```

- Backend berjalan di Vercel (Python/FastAPI)
- Frontend memanggil satu endpoint: `POST /solve`
- Tidak ada autentikasi (public API)

### `src/lib/utils.ts`

```typescript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Helper `cn()` dipakai di seluruh komponen untuk menggabungkan class Tailwind secara kondisional tanpa konflik.

---

## 10. Tampilan & Styling

### `src/app/globals.css` — CSS Variables & Tema

```css
:root {
  --color-primary:     #2563eb;  /* Biru utama */
  --color-background:  #f5f7fa;  /* Abu-biru terang */
  --color-foreground:  #1a1a2e;  /* Teks gelap */
  --color-success:     #22c55e;  /* Hijau (konfirmasi) */
  --color-destructive: #ef4444;  /* Merah (hapus/error) */
  --color-muted:       #6b7280;  /* Abu (teks sekunder) */
  --color-border:      #e5e7eb;  /* Border terang */
}
```

### Font

- **Google Sans** (di-host lokal di `/public/fonts/`)
- Dipakai sebagai font default seluruh aplikasi
- Di-set di `src/app/layout.tsx`

### Layout Keseluruhan

```
┌─────────────────────────────────────────────────────────────┐
│                      Header / Stepper                       │
├──────────────┬──────────────────────────────┬───────────────┤
│              │                              │               │
│  Sidebar     │     SimulationArea           │ SelectedPanel │
│  (340px)     │     + DPTable                │ (280px)       │
│              │                              │               │
└──────────────┴──────────────────────────────┴───────────────┘
```

---

## 11. Konfigurasi Project

### `package.json`

```json
{
  "name": "knapsack",
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start",
    "lint":  "next lint"
  }
}
```

### `tsconfig.json`

- Target: **ES2017**
- Path alias `@/*` → `./src/*` (misal: `import { cn } from "@/lib/utils"`)
- Strict mode aktif
- JSX mode: `preserve` (Next.js menangani transform)

### `next.config.ts`

Konfigurasi minimal, siap untuk dikembangkan (CORS, image domain, dll.).

### `postcss.config.mjs`

```js
export default { plugins: { "@tailwindcss/postcss": {} } }
```

Menggunakan plugin Tailwind CSS v4 berbasis PostCSS.

### `.env.example`

Template environment variables. Salin ke `.env.local` dan isi nilai yang diperlukan sebelum menjalankan aplikasi secara lokal.

---

## 12. Aset Publik

### `/public/fonts/`

Font **Google Sans** tersedia dalam beberapa weight (Regular, Medium, Bold, dll.) untuk menghindari ketergantungan pada Google Fonts CDN.

### `/public/items/`

Gambar ikon PNG untuk setiap preset barang:

| File | Barang |
|---|---|
| `tas.png` | Ikon tas (logo app) |
| `laptop.png` | Laptop |
| `buku.png` | Buku |
| `charger.png` | Charger |
| `botol.png` | Botol Minum |
| `pensil.png` | Kotak Pensil |
| `powerbank.png` | Powerbank |
| `jaket.png` | Jaket |

---

## Ringkasan Singkat

| Aspek | Detail |
|---|---|
| **Jenis Aplikasi** | Web app edukasi interaktif |
| **Masalah yang Diselesaikan** | 0/1 Knapsack Problem |
| **Algoritma** | Dynamic Programming |
| **Bahasa Frontend** | TypeScript (Next.js + React) |
| **Bahasa Backend** | Python (FastAPI) |
| **Styling** | Tailwind CSS v4 |
| **Deployment** | Vercel (backend) |
| **Bahasa Antarmuka** | Bahasa Indonesia |
| **Target Pengguna** | Mahasiswa / pelajar yang belajar algoritma |
