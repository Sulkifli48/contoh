from flask import Blueprint, jsonify
import nbformat
from nbconvert import PythonExporter

# Inisialisasi Blueprint
jadwals1_bp = Blueprint('jadwals1', __name__)

# Simpan hasil dari file .ipynb dalam variabel jadwal_s1
jadwal_s1 = []

# Fungsi untuk mengeksekusi file .ipynb
def execute_ipynb(file_path):
    global jadwal_s1  # Agar bisa memperbarui variabel global jadwal_s1
    try:
        with open(file_path, 'r') as f:
            notebook = nbformat.read(f, as_version=4)
        exporter = PythonExporter()
        code, _ = exporter.from_notebook_node(notebook)
        exec(code, globals())  # Eksekusi kode dari file .ipynb
        print(f"File {file_path} berhasil dieksekusi.")
    except FileNotFoundError:
        print(f"File {file_path} tidak ditemukan.")
        raise
    except Exception as e:
        print(f"Terjadi kesalahan saat eksekusi file {file_path}: {e}")
        raise

# Eksekusi file jadwal.ipynb saat server dimulai
try:
    execute_ipynb('api/penjadwalan.ipynb')
except Exception as e:
    print(f"Kesalahan saat inisialisasi: {e}")

# Route untuk mengakses data jadwal_s1
@jadwals1_bp.route('/jadwals1', methods=['GET'])
def get_jadwal_s1():
    return jsonify(jadwal_s1), 200

# Route untuk memperbarui jadwal secara manual
# @jadwals1_bp.route('/jadwals1/update', methods=['POST'])
# def update_jadwal_s1():
#     try:
#         execute_ipynb('api/penjadwalan.ipynb')  # Eksekusi ulang file .ipynb
#         return jsonify({"message": "Jadwal berhasil diperbarui"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
