from flask import Flask, request, jsonify, send_from_directory

from knapsack import solve_knapsack

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
    app.run(host="127.0.0.1", port=5000, debug=True)
