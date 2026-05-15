# Knapsack 0/1 Visualizer — Design Spec

**Date:** 2026-05-15  
**Status:** Approved

---

## Overview

Website interaktif untuk memecahkan masalah knapsack 0/1 dengan visualisasi proses algoritma dynamic programming step-by-step. Dibuat untuk tugas kuliah dengan pendekatan "tas dan barang" yang intuitif.

---

## Arsitektur

Dua repo terpisah: frontend (Next.js) dan backend (FastAPI Python).

```
Frontend (Next.js) → POST /solve → Backend (FastAPI) → return DP table + hasil
```

### Frontend — `knapsack-frontend`
```
app/
├── page.tsx              # Halaman utama (single page)
├── layout.tsx
└── globals.css
components/
├── ItemForm.tsx          # Form input barang (nama, berat, nilai, upload gambar)
├── ItemList.tsx          # Tabel daftar barang yang sudah diinput
├── KnapsackVisual.tsx    # Visual tas + barang terpilih di hasil akhir
└── DPTable.tsx           # Tabel DP dengan animasi step-by-step
lib/
└── api.ts                # Fetch ke FastAPI backend
types/
└── index.ts              # Type definitions (Item, SolveRequest, SolveResponse, dll)
```

### Backend — `knapsack-backend`
```
main.py                   # FastAPI app + CORS + endpoint POST /solve
knapsack.py               # Logika algoritma 0/1 knapsack (Python)
```

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | FastAPI (Python) |
| Deploy Frontend | Vercel |
| Deploy Backend | Railway atau Render |

---

## Fitur

### 1. Input Barang
- Form dengan field: nama barang, berat (kg), nilai
- Tombol upload gambar per barang (disimpan sebagai object URL, hilang saat refresh)
- Tombol "Tambah Barang" untuk menambah ke daftar
- Tombol "Random" untuk generate 3–5 barang contoh sekaligus
- Daftar barang ditampilkan sebagai tabel, bisa dihapus per item

### 2. Kapasitas Tas
- Input angka untuk kapasitas maksimum tas

### 3. Solve
- Tombol "Selesaikan" mengirim `POST /solve` ke backend
- Request body: list barang (nama, berat, nilai) + kapasitas
- Response: tabel DP lengkap (semua langkah) + daftar barang terpilih

### 4. Visualisasi Proses DP
- Tabel DP berukuran `(n+1) x (kapasitas+1)`
- Tombol "Next Step" untuk maju satu langkah
- Tombol "Auto Play" untuk animasi otomatis
- Highlight: baris aktif (barang yang sedang diproses) + sel yang baru diisi
- Keterangan di bawah tabel: "Mempertimbangkan barang X (berat: Y, nilai: Z)"

### 5. Hasil Akhir
- Visual tas dengan daftar barang terpilih beserta gambar masing-masing
- Total berat dan total nilai yang didapat

---

## API Contract

### `POST /solve`

**Request:**
```json
{
  "capacity": 10,
  "items": [
    { "name": "Laptop", "weight": 3, "value": 4 },
    { "name": "Buku", "weight": 1, "value": 2 }
  ]
}
```

**Response:**
```json
{
  "dp_table": [[0, 0, ...], [0, 0, 2, ...], ...],
  "selected_items": [
    { "name": "Laptop", "weight": 3, "value": 4 },
    { "name": "Buku", "weight": 1, "value": 2 }
  ],
  "total_weight": 4,
  "total_value": 6
}
```

---

## Data Flow

1. User mengisi form barang + kapasitas
2. Klik "Selesaikan" → frontend kirim POST /solve ke FastAPI
3. FastAPI jalankan algoritma knapsack 0/1, rekam setiap langkah pengisian tabel DP
4. Return tabel DP lengkap + barang terpilih
5. Frontend animasikan tabel DP step-by-step (Next Step / Auto Play)
6. Tampilkan hasil akhir: tas + barang terpilih + total berat/nilai

---

## Deployment

- **Frontend:** push ke GitHub → auto-deploy ke Vercel
- **Backend:** push ke GitHub → auto-deploy ke Railway atau Render
- **CORS:** backend dikonfigurasi untuk menerima request dari domain Vercel frontend
