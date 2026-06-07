# Pembagian Tugas Kelompok

Proyek: **Knapsack Solver** — aplikasi full-stack penyelesai masalah 0/1 Knapsack.

- **Backend:** FastAPI (Python) — algoritma Dynamic Programming + REST API (`knapsack-solver-api`)
- **Frontend:** Next.js (React + TypeScript + Tailwind CSS) — antarmuka web & visualisasi simulasi

---

| No | Nama Mahasiswa | NIM | Kontribusi / Peran |
|----|----------------|-----|--------------------|
| 1 | M. Faris Daffarindra | F1E324003 | **Ketua tim & Algoritma + Backend API** — Mengimplementasikan fungsi `solve_knapsack()` (Dynamic Programming 0/1 Knapsack: tabel DP + *backtracking*) di `knapsack.py`, serta endpoint `POST /solve` dengan FastAPI & Pydantic di `main.py`. Mengkoordinasikan integrasi backend–frontend. |
| 2 | Azman Abdullah | F1E324008 | **Integrasi Frontend–Backend & Input** — Membangun komponen `Sidebar.tsx` (form input barang & kapasitas), pemanggilan API di `lib/api.ts`, definisi tipe data di `types/index.ts`, serta orkestrasi state utama di `page.tsx`. |
| 3 | Nawfal Abyaz Sadat | F1E324017 | **Visualisasi Simulasi** — Mengembangkan visualisasi langkah-per-langkah algoritma: `SimulationArea.tsx`, `DPTable.tsx` (animasi pengisian tabel DP), dan `Stepper.tsx` untuk navigasi tiap langkah simulasi. |
| 4 | Nicky Pradhitiya Dinata | F1E324018 | **UI Components & Styling** — Membuat komponen UI reusable (`button`, `card`, `input`, `Select`), `ItemIcon.tsx`, `SelectedPanel.tsx`, layout aplikasi (`layout.tsx`), dan styling Tailwind (`globals.css`). |
| 5 | Fabianto Dwitama | F1E324022 | **Testing, Deployment & Dokumentasi** — Menulis unit & integration test (`test_knapsack.py` + pytest), konfigurasi CORS, `requirements.txt`, dan `Procfile` (deploy uvicorn), serta menyusun dokumentasi `README.md` dan `penjelasan.md`. |
