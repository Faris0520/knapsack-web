# Knapsack 0/1 Optimizer - Frontend

Dashboard interaktif untuk memvisualisasikan algoritma Dynamic Programming pada permasalahan Knapsack 0/1.

## Tech Stack

- **Next.js 16** (Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Lucide React** (ikon)

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
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── Sidebar.tsx
│   ├── Stepper.tsx
│   ├── SimulationArea.tsx
│   ├── DPTable.tsx
│   ├── SelectedPanel.tsx
│   └── ItemIcon.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
├── types/
│   └── index.ts
public/
└── items/
    ├── tas.png
    ├── laptop.png
    ├── buku.png
    ├── charger.png
    ├── botol-minum.png
    ├── kotak-pensil.png
    ├── powerbank.png
    └── jaket.png
```

## Setup

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Koneksi Backend

Frontend mengirim request ke backend di `http://localhost:8000` (default). Ubah via environment variable:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Endpoint yang digunakan: `POST /solve` dengan body:

```json
{
  "capacity": 7,
  "items": [
    { "name": "Laptop", "weight": 3, "value": 10 },
    { "name": "Buku", "weight": 2, "value": 8 }
  ]
}
```

## Gambar Barang

Letakkan file gambar di `public/items/` dengan format nama `nama-barang.png`. Mapping nama ke file ada di `src/components/ItemIcon.tsx`.
