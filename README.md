# Knapsack 0/1 Optimizer

https://knapsack.parriz.in

<img width="720" alt="Screenshot 2026-06-07 134425" src="https://github.com/user-attachments/assets/1d387a23-65f4-478e-941d-b7c97bda2fd1" />
<br><br/>

Dashboard interaktif untuk memvisualisasikan algoritma **Dynamic Programming** pada permasalahan **0/1 Knapsack**. Tampilan dibuat dengan **HTML/CSS/JavaScript polos** (tanpa framework), sedangkan algoritmanya berjalan di server **Flask (Python)**. Dibuat bersama dengan anggota kelompok 6, sebagai tugas akhir Desain dan Analisis Algoritma

## Tech Stack

- **HTML5 / CSS3 / JavaScript (vanilla)** - antarmuka, tanpa build step
- **Flask (Python)** - menyajikan halaman + endpoint `POST /solve`
- **Algoritma Dynamic Programming** - 0/1 Knapsack di `knapsack.py`
- **Google Sans** (font lokal) + ikon SVG inline gaya Lucide

## Fitur

- Input barang dengan preset (Laptop, Buku, Charger, dll) atau custom
- Inline editing dan hapus barang
- Tombol random untuk menambah barang acak
- Visualisasi step-by-step algoritma DP (auto play / manual next)
- Stepper horizontal: Mulai → Evaluasi Barang → Hasil Optimal
- Simulasi langkah dengan progress kapasitas tas secara real-time
- Matriks DP dengan highlight sel aktif dan path optimal
- Panel barang terpilih setelah proses selesai

## Struktur Folder

```
knapsack/
├── app.py              # Server Flask: sajikan file statis + endpoint /solve
├── knapsack.py         # Algoritma 0/1 Knapsack (Dynamic Programming)
├── requirements.txt    # Dependensi Python (flask)
├── index.html          # Struktur halaman (sidebar | simulasi | panel)
├── app.js              # Logika UI: state, render, panggil /solve via fetch
├── style.css           # Styling + animasi
├── fonts/              # Google Sans (woff2)
└── items/              # Gambar ikon barang (PNG)
    ├── tas.png
    ├── laptop.png
    ├── buku.png
    ├── charger.png
    ├── botol-minum.png
    ├── kotak-pensil.png
    ├── powerbank.png
    └── jaket.png
```

> Catatan: `knapsack.js` masih ada sebagai referensi versi lama (algoritma di
> browser), tetapi **tidak lagi dimuat** - algoritma kini di `knapsack.py`.

## Cara Menjalankan

```bash
pip install -r requirements.txt
python app.py
```

Lalu buka **http://127.0.0.1:5000** - satu perintah, satu URL. Flask menyajikan
file statis sekaligus melayani API, jadi tidak perlu server terpisah.

## API

Satu-satunya endpoint: `POST /solve`

Request:

```json
{
  "capacity": 7,
  "items": [
    { "name": "Laptop", "weight": 3, "value": 10 },
    { "name": "Buku", "weight": 2, "value": 8 }
  ]
}
```

Response:

```json
{
  "dp_table": [[0, 0, ...], ...],
  "selected_items": [{ "name": "Laptop", "weight": 3, "value": 10 }],
  "total_weight": 3,
  "total_value": 10
}
```

`app.js` memanggil endpoint ini lewat `fetch('/solve')` di fungsi `handleStart()`,
lalu memakai `dp_table` & `selected_items` untuk animasi langkah demi langkah.

## Gambar Barang

Letakkan file gambar di `items/` dengan format nama `nama-barang.png`. Mapping nama
ke file ada di konstanta `IMAGE_MAP` pada `app.js`.

## Dukungan AI
Pengerjaan aplikasi ini sangat terbantu oleh kolaborasi dengan model bahasa besar (Large Language Models) dari Anthropic:

- Claude Sonnet 4.6
- Claude Opus 4.8

Model-model AI ini digunakan untuk membantu dalam proses debugging, perbaikan kode, penambahan fitur, dan perancangan struktur aplikasi.
