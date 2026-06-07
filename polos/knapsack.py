# ============================================================
#  ALGORITMA KNAPSACK 0/1 (Dynamic Programming)
# ============================================================
#
#  File ini HANYA berisi algoritmanya, terpisah dari kode
#  server/tampilan (lihat app.py). Tujuannya supaya logika inti
#  mudah dibaca dan dipelajari.
#
#  Masalah: punya tas berkapasitas `capacity` kg. Ada beberapa
#  barang, masing-masing punya berat & nilai. Pilih kombinasi
#  barang (tiap barang hanya boleh dipakai 0 atau 1 kali) agar
#  TOTAL NILAI maksimum tanpa melewati kapasitas.
#
#  Input:
#    items    : list[dict]  -> [{ "name", "weight", "value" }, ...]
#    capacity : int         -> batas berat tas (integer)
#
#  Output (dict):
#    dp_table       : list[list[int]]  -> tabel DP (untuk visualisasi)
#    selected_items : list[dict]
#    total_weight   : int
#    total_value    : int
# ============================================================


def solve_knapsack(items: list[dict], capacity: int) -> dict:
    # Jumlah barang
    n = len(items)

    # ----------------------------------------------------------
    # LANGKAH 1 — Siapkan tabel DP berukuran (n+1) x (capacity+1)
    # ----------------------------------------------------------
    # dp[i][w] = nilai maksimum yang bisa dicapai dengan
    #            mempertimbangkan i barang pertama dan
    #            kapasitas tas sebesar w.
    # Baris 0 dan kolom 0 bernilai 0 (tidak ada barang / tas 0 kg).
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    # ----------------------------------------------------------
    # LANGKAH 2 — Isi tabel dari barang ke-1 sampai ke-n
    # ----------------------------------------------------------
    for i in range(1, n + 1):
        berat = items[i - 1]["weight"]  # Berat barang ke-i
        nilai = items[i - 1]["value"]   # Nilai barang ke-i
        for w in range(capacity + 1):
            if berat <= w:
                # Barang muat. Pilih yang lebih besar antara:
                #  (a) TIDAK ambil barang ke-i  -> dp[i-1][w]
                #  (b) AMBIL barang ke-i        -> nilai + dp[i-1][w - berat]
                dp[i][w] = max(dp[i - 1][w], nilai + dp[i - 1][w - berat])
            else:
                # Barang tidak muat -> warisi nilai dari baris atas
                dp[i][w] = dp[i - 1][w]

    # ----------------------------------------------------------
    # LANGKAH 3 — Telusuri balik (backtrack) barang yang dipilih
    # ----------------------------------------------------------
    # Mulai dari sudut kanan-bawah dp[n][capacity].
    # Jika nilainya BERBEDA dari baris di atasnya (dp[i-1][w]),
    # berarti barang ke-i ikut diambil.
    selected = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(items[i - 1])   # barang ke-i diambil
            w -= items[i - 1]["weight"]     # kurangi sisa kapasitas

    # Membalikkan urutan agar sesuai dengan urutan asli barang
    selected.reverse()

    # ----------------------------------------------------------
    # LANGKAH 4 — Kembalikan hasil
    # ----------------------------------------------------------
    return {
        "dp_table": dp,
        "selected_items": [
            {"name": it["name"], "weight": it["weight"], "value": it["value"]}
            for it in selected
        ],
        "total_weight": sum(it["weight"] for it in selected),
        "total_value": dp[n][capacity],
    }
