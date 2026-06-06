// ============================================================
//  ALGORITMA KNAPSACK 0/1 (Dynamic Programming)
// ============================================================
//
//  File ini HANYA berisi algoritmanya, terpisah dari kode
//  tampilan/proses (lihat app.js). Tujuannya supaya logika inti
//  mudah dibaca dan dipelajari.
//
//  Masalah: punya tas berkapasitas `capacity` kg. Ada beberapa
//  barang, masing-masing punya berat & nilai. Pilih kombinasi
//  barang (tiap barang hanya boleh dipakai 0 atau 1 kali) agar
//  TOTAL NILAI maksimum tanpa melewati kapasitas.
//
//  Input:
//    capacity : number               -> batas berat tas (integer)
//    items    : { name, weight, value }[]
//
//  Output:
//    {
//      dp_table       : number[][]    -> tabel DP (untuk visualisasi)
//      selected_items : {name,weight,value}[]
//      total_weight   : number
//      total_value    : number
//    }
// ============================================================

function solveKnapsack(capacity, items) {
  const n = items.length;

  // ----------------------------------------------------------
  // LANGKAH 1 — Siapkan tabel DP berukuran (n+1) x (capacity+1)
  // ----------------------------------------------------------
  // dp[i][w] = nilai maksimum yang bisa dicapai dengan
  //            mempertimbangkan i barang pertama dan
  //            kapasitas tas sebesar w.
  // Baris 0 dan kolom 0 bernilai 0 (tidak ada barang / tas 0 kg).
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  // ----------------------------------------------------------
  // LANGKAH 2 — Isi tabel dari barang ke-1 sampai ke-n
  // ----------------------------------------------------------
  for (let i = 1; i <= n; i++) {
    const berat = items[i - 1].weight;
    const nilai = items[i - 1].value;

    for (let w = 0; w <= capacity; w++) {
      if (berat <= w) {
        // Barang muat. Pilih yang lebih besar antara:
        //  (a) TIDAK ambil barang ke-i  -> dp[i-1][w]
        //  (b) AMBIL barang ke-i        -> nilai + dp[i-1][w - berat]
        dp[i][w] = Math.max(dp[i - 1][w], nilai + dp[i - 1][w - berat]);
      } else {
        // Barang tidak muat -> warisi nilai dari baris atas
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // ----------------------------------------------------------
  // LANGKAH 3 — Telusuri balik (backtrack) barang yang dipilih
  // ----------------------------------------------------------
  // Mulai dari sudut kanan-bawah dp[n][capacity].
  // Jika nilainya BERBEDA dari baris di atasnya (dp[i-1][w]),
  // berarti barang ke-i ikut diambil.
  let w = capacity;
  const selected = [];
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.unshift(items[i - 1]);   // barang ke-i diambil
      w -= items[i - 1].weight;         // kurangi sisa kapasitas
    }
  }

  // ----------------------------------------------------------
  // LANGKAH 4 — Kembalikan hasil
  // ----------------------------------------------------------
  const total_weight = selected.reduce((sum, it) => sum + it.weight, 0);
  return {
    dp_table: dp,
    selected_items: selected.map(({ name, weight, value }) => ({ name, weight, value })),
    total_weight,
    total_value: dp[n][capacity],
  };
}

// Diekspos sebagai global agar bisa dipakai oleh app.js
// (lihat urutan <script> di index.html).
