from flask import Blueprint, jsonify, request
from database import mysql
from datetime import datetime

kelas_bp = Blueprint('kelas', __name__)

@kelas_bp.route('/listkelas', methods=['GET'])
def get_kelas():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            kelas_db.id_kelas, 
            matakuliah_db.matakuliah,
            kelas_db.skala,
            kelas_db.kelas,
            GROUP_CONCAT(dosen_db.dosen SEPARATOR ', ') AS dosen,
            kelas_db.kapasitas,
            kelas_db.createdAt
        FROM 
            kelas_db
        JOIN 
            matakuliah_db ON kelas_db.matkul_id = matakuliah_db.id_matkul
        LEFT JOIN 
            kelas_dosen ON kelas_db.id_kelas = kelas_dosen.kelas_id
        LEFT JOIN 
            dosen_db ON kelas_dosen.dosen_id = dosen_db.id_dosen
        GROUP BY 
            kelas_db.id_kelas
    """)
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_kelas': row[0],
            'matakuliah': row[1],
            'skala': row[2],
            'kelas': row[3],
            'dosen': row[4],
            'kapasitas': row[5],
            'createdAt': row[6],
        }
        for row in rows
    ]
    return jsonify(data), 200

@kelas_bp.route('/kelasadd', methods=['POST'])
def add_kelas():
    try:
        data = request.get_json()
        matkul_id = data['matkul_id']
        skala = data['skala']
        kelas = data['kelas']
        kapasitas = data['kapasitas']
        dosen_ids = data['dosen_ids']  # Ambil daftar ID dosen dari request

        # Validasi nilai 'skala'
        if skala not in ["Inter", "Nasional"]:
            return jsonify({"error": "Nilai skala harus 'Inter' atau 'Nasional'"}), 400

        cur = mysql.connection.cursor()
        
        # Masukkan data kelas ke dalam database
        cur.execute("""
            INSERT INTO kelas_db (matkul_id, skala, kelas, kapasitas)
            VALUES (%s, %s, %s, %s)
        """, (matkul_id, skala, kelas, kapasitas))

        # Ambil ID kelas yang baru ditambahkan
        kelas_id = cur.lastrowid

        # Masukkan data dosen terkait kelas ke dalam tabel kelas_dosen
        for dosen_id in dosen_ids:
            cur.execute("""
                INSERT INTO kelas_dosen (kelas_id, dosen_id)
                VALUES (%s, %s)
            """, (kelas_id, dosen_id))

        # Menyimpan perubahan
        mysql.connection.commit()

        # Menutup koneksi
        cur.close()

        return jsonify({"message": "Kelas berhasil ditambahkan dengan dosen terkait"}), 200

    except Exception as e:
        print("Error terjadi:", e)  # Mencetak error
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500


@kelas_bp.route('/kelasdelete/<int:id_kelas>', methods=['DELETE'])
def delete_kelas(id_kelas):
    try:
        cur = mysql.connection.cursor()

        # Hapus entri terkait dari tabel kelas_dosen terlebih dahulu
        cur.execute("DELETE FROM kelas_dosen WHERE kelas_id = %s", (id_kelas,))

        # Hapus kelas dari tabel kelas_db
        cur.execute("DELETE FROM kelas_db WHERE id_kelas = %s", (id_kelas,))

        # Commit perubahan
        mysql.connection.commit()

        # Tutup koneksi
        cur.close()

        return jsonify({"message": "Kelas berhasil dihapus"}), 200

    except Exception as e:
        print("Error terjadi:", e)  # Cetak error
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500
