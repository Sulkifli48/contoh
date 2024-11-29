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
            GROUP_CONCAT(dosen_db.dosen ORDER BY kelas_dosen.urutan_dosen SEPARATOR '\n'),
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
            kelas_db.id_kelas, matakuliah_db.matakuliah, kelas_db.skala, kelas_db.kelas, kelas_db.kapasitas, kelas_db.createdAt
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
        dosen_ids = data['dosen_ids'] 

        # Validasi nilai 'skala'
        if skala not in ["Inter", "Nasional", "MBKM"]:
            return jsonify({"error": "Nilai skala harus 'Inter' atau 'Nasional'"}), 400

        cur = mysql.connection.cursor()
        sorted_dosen_ids = dosen_ids  

        # Masukkan data kelas ke dalam database
        cur.execute("""
            INSERT INTO kelas_db (matkul_id, skala, kelas, kapasitas)
            VALUES (%s, %s, %s, %s)
        """, (matkul_id, skala, kelas, kapasitas))

        # Ambil ID kelas yang baru ditambahkan
        kelas_id = cur.lastrowid

        # Masukkan data dosen terkait kelas dengan urutan yang sudah disortir
        for urutan, dosen_id in enumerate(sorted_dosen_ids, start=1):
            cur.execute("""
                INSERT INTO kelas_dosen (kelas_id, dosen_id, urutan_dosen)
                VALUES (%s, %s, %s)
            """, (kelas_id, dosen_id, urutan))


        # Menyimpan perubahan
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil ditambahkan dengan dosen terkait"}), 200

    except Exception as e:
        print("Error terjadi:", e)
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
        cur.close()

        return jsonify({"message": "Kelas berhasil dihapus"}), 200

    except Exception as e:
        print("Error terjadi:", e) 
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500
    
@kelas_bp.route('/kelasedit/<int:id_kelas>', methods=['PUT'])
def edit_kelas(id_kelas):
    try:
        data = request.get_json()
        matkul_id = data.get('matkul_id')
        skala = data.get('skala')
        kelas = data.get('kelas')
        kapasitas = data.get('kapasitas')
        dosen_ids = data.get('dosen_ids', []) 

        # Validasi nilai 'skala'
        if skala not in ["Inter", "Nasional", "MBKM"]:
            return jsonify({"error": "Nilai skala harus 'Inter', 'Nasional', atau 'MBKM'"}), 400

        cur = mysql.connection.cursor()

        # Update data kelas di tabel kelas_db
        cur.execute("""
            UPDATE kelas_db 
            SET matkul_id = %s, skala = %s, kelas = %s, kapasitas = %s
            WHERE id_kelas = %s
        """, (matkul_id, skala, kelas, kapasitas, id_kelas))

        # Hapus data dosen yang terkait kelas ini di tabel kelas_dosen
        cur.execute("DELETE FROM kelas_dosen WHERE kelas_id = %s", (id_kelas,))

        # Masukkan data dosen baru dengan urutan sesuai frontend
        for urutan, dosen_id in enumerate(dosen_ids, start=1):
            cur.execute("""
                INSERT INTO kelas_dosen (kelas_id, dosen_id, urutan_dosen)
                VALUES (%s, %s, %s)
            """, (id_kelas, dosen_id, urutan))

        # Commit perubahan
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil diubah"}), 200

    except Exception as e:
        print("Error terjadi:", e)
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500
