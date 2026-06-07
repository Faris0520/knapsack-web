# ============================================================
#  SERVER FLASK — Knapsack Optimizer (versi "polos")
# ============================================================
#
#  Server ini menyajikan DUA hal sekaligus:
#    1. File statis (index.html, app.js, style.css, gambar) —
#       tampilan/UI dashboard.
#    2. API  POST /solve  — menjalankan algoritma knapsack di
#       Python (lihat knapsack.py) lalu mengembalikan JSON.
#
#  Cara jalan:
#    pip install -r requirements.txt
#    python app.py
#  lalu buka http://127.0.0.1:5000 di browser.
# ============================================================

from flask import Flask, request, jsonify, send_from_directory

from knapsack import solve_knapsack

# static_folder="" + static_url_path="" -> file di folder ini
# (index.html, app.js, dst) bisa diakses langsung dari root URL.
app = Flask(__name__, static_folder="", static_url_path="")


@app.route("/")
def index():
    """Halaman utama -> index.html"""
    return send_from_directory(".", "index.html")


@app.route("/solve", methods=["POST"])
def solve():
    """
    Terima JSON: { "capacity": int, "items": [{name, weight, value}, ...] }
    Balas JSON hasil algoritma knapsack 0/1.
    """
    data = request.get_json(silent=True) or {}
    capacity = int(data.get("capacity", 0))
    items = data.get("items", [])
    result = solve_knapsack(items, capacity)
    return jsonify(result)


if __name__ == "__main__":
    # debug=True agar perubahan kode otomatis reload saat dikembangkan.
    app.run(host="127.0.0.1", port=5000, debug=True)
