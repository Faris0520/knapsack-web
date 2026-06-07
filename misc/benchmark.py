#  BENCHMARK PERFORMA - Algoritma 0/1 Knapsack (knapsack.py)

#  Mengukur waktu eksekusi solve_knapsack() pada berbagai ukuran
#  input untuk memverifikasi kompleksitas teoritis O(n x W),
#  dengan n = jumlah barang dan W = kapasitas tas.

#  Cara pakai:
#    python benchmark.py                 # cetak tabel performa
#    python benchmark.py --plot          # + buat grafik PNG
#    python benchmark.py --reps 10       # rata-rata 10x per ukuran
#    python benchmark.py --out hasil.png # nama file grafik

import argparse
import random
import time

from knapsack import solve_knapsack

# Daftar konfigurasi uji: (jumlah_barang n, kapasitas W)
KONFIGURASI = [
    (10, 50),
    (50, 200),
    (100, 500),
    (500, 1000),
    (1000, 2000),
]


def buat_items(n: int, rng: random.Random) -> list[dict]:
    """Hasilkan n barang acak dengan berat 1..10 dan nilai 1..50."""
    return [
        {"name": f"x{i}", "weight": rng.randint(1, 10), "value": rng.randint(1, 50)}
        for i in range(n)
    ]


def ukur(n: int, cap: int, reps: int, rng: random.Random) -> float:
    """Kembalikan rata-rata waktu eksekusi (ms) dari `reps` kali percobaan."""
    items = buat_items(n, rng)
    waktu = []
    for _ in range(reps):
        mulai = time.perf_counter()
        solve_knapsack(items, cap)
        waktu.append((time.perf_counter() - mulai) * 1000)  # detik -> ms
    return sum(waktu) / len(waktu)


def jalankan(reps: int, seed: int) -> list[dict]:
    """Jalankan semua konfigurasi, kembalikan daftar hasil pengukuran."""
    rng = random.Random(seed)
    hasil = []
    for n, cap in KONFIGURASI:
        ms = ukur(n, cap, reps, rng)
        hasil.append({"n": n, "cap": cap, "nW": n * cap, "ms": ms})
    return hasil


def cetak_tabel(hasil: list[dict]) -> None:
    print(f"{'n':>6} {'W':>6} {'n x W':>10} {'waktu (ms)':>12}")
    print("-" * 38)
    for h in hasil:
        print(f"{h['n']:>6} {h['cap']:>6} {h['nW']:>10} {h['ms']:>12.3f}")


def buat_grafik(hasil: list[dict], out: str) -> None:
    """Buat grafik waktu eksekusi vs ukuran input (n x W)."""
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError:
        print("matplotlib belum terpasang. Jalankan: pip install matplotlib")
        return

    sizes = [h["nW"] for h in hasil]
    ts = [h["ms"] for h in hasil]

    fig, ax = plt.subplots(figsize=(7.2, 4.4))
    ax.plot(sizes, ts, marker="o", color="#2563eb", linewidth=2,
            label="Waktu eksekusi terukur")
    # Garis referensi linear ideal O(n x W), dikalibrasi ke titik terbesar
    k = ts[-1] / sizes[-1]
    ax.plot(sizes, [k * s for s in sizes], linestyle="--", color="#9ca3af",
            linewidth=1.5, label="Referensi linear O(n x W)")

    ax.set_title("Analisis Performa: Waktu Eksekusi vs Ukuran Input (n x W)")
    ax.set_xlabel("Ukuran input  (n x W)")
    ax.set_ylabel("Waktu eksekusi (ms)")
    ax.grid(True, alpha=0.3)
    ax.legend()
    for x, y in zip(sizes, ts):
        ax.annotate(f"{y:.1f} ms", (x, y), textcoords="offset points",
                    xytext=(0, 9), fontsize=8, ha="center")

    fig.tight_layout()
    fig.savefig(out, dpi=140)
    print(f"Grafik tersimpan: {out}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Benchmark performa algoritma 0/1 Knapsack.")
    parser.add_argument("--reps", type=int, default=5, help="jumlah percobaan per ukuran (default 5)")
    parser.add_argument("--seed", type=int, default=1, help="seed acak agar hasil konsisten (default 1)")
    parser.add_argument("--plot", action="store_true", help="buat grafik PNG")
    parser.add_argument("--out", default="grafik_performa.png", help="nama file grafik (default grafik_performa.png)")
    args = parser.parse_args()

    hasil = jalankan(reps=args.reps, seed=args.seed)
    cetak_tabel(hasil)
    if args.plot:
        buat_grafik(hasil, args.out)


if __name__ == "__main__":
    main()
