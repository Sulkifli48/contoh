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
            GROUP_CONCAT(DISTINCT dosen_db.dosen ORDER BY kelas_dosen.urutan_dosen SEPARATOR '/n ') AS dosen,
            GROUP_CONCAT(DISTINCT rooms_db.rooms ORDER BY kelas_rooms.urutan_rooms SEPARATOR ', ') AS rooms,
            kelas_db.terpakai,
            kelas_db.kapasitas,
            kelas_db.createdAt,
            matakuliah_db.jenjang,
            matakuliah_db.wp,
            GROUP_CONCAT(DISTINCT semester_db.semester ORDER BY semester_db.semester SEPARATOR ', ') AS semester_list,
            matakuliah_db.durasi,
            matakuliah_db.kode
        FROM 
            kelas_db
        JOIN 
            matakuliah_db ON kelas_db.matkul_id = matakuliah_db.id_matkul
        LEFT JOIN 
            kelas_dosen ON kelas_db.id_kelas = kelas_dosen.kelas_id
        LEFT JOIN 
            dosen_db ON kelas_dosen.dosen_id = dosen_db.id_dosen
        LEFT JOIN 
            kelas_rooms ON kelas_db.id_kelas = kelas_rooms.kelas_id
        LEFT JOIN 
            rooms_db ON kelas_rooms.rooms_id = rooms_db.id_rooms
        LEFT JOIN 
            semester_matakuliah ON matakuliah_db.id_matkul = semester_matakuliah.matkul_id
        LEFT JOIN 
            semester_db ON semester_matakuliah.semester_id = semester_db.id_semester
        GROUP BY 
            kelas_db.id_kelas, 
            matakuliah_db.matakuliah, 
            kelas_db.skala, 
            kelas_db.kelas, 
            kelas_db.terpakai,
            kelas_db.kapasitas, 
            kelas_db.createdAt, 
            matakuliah_db.jenjang,
            matakuliah_db.wp,
            matakuliah_db.durasi,
            matakuliah_db.kode
    """)
    rows = cur.fetchall()
    cur.close()

    data = [
    {
        'id_kelas': row[0],
        'matakuliah': row[1],
        'skala': row[2],
        'kelas': row[3],
        'dosen': row[4].split('/n ') if row[4] else [],
        'dosenString': row[4].replace('/n ', '\n') if row[4] else '', 
        'rooms': (row[5].split(', ') if row[5] else []) + ['alternatif'],
        'terpakai': row[6],
        'kapasitas': row[7],
        'createdAt': row[8],
        'jenjang': row[9],
        'wp': row[10],
        'semester': [int(x) for x in row[11].split(', ')] if row[11] else [],
        'durasi': row[12],
        'kode': row[13],
        'semesterString': 'ALL' if len(row[11].split(', ')) > 1 else (
        'GENAP' if int(row[11].split(', ')[0]) % 2 == 0 else 'GANJIL'
        ),
    }
    for row in rows
]
    
    return jsonify(data), 200



@kelas_bp.route('/listrooms', methods=['GET'])
def get_rooms():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_rooms, rooms FROM rooms_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_rooms': row[0],
            'rooms': row[1],
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
        rooms_ids = data['rooms_ids']
        terpakai = data.get('terpakai', 'tidak')  # Default 'tidak' jika tidak dikirim

        cur = mysql.connection.cursor()
        
        # Masukkan data kelas ke dalam database
        cur.execute("""
            INSERT INTO kelas_db (matkul_id, skala, kelas, kapasitas, terpakai)
            VALUES (%s, %s, %s, %s, %s)
        """, (matkul_id, skala, kelas, kapasitas, terpakai))

        # Ambil ID kelas yang baru ditambahkan
        kelas_id = cur.lastrowid

        # Masukkan data dosen terkait kelas
        for urutan, dosen_id in enumerate(dosen_ids, start=1):
            cur.execute("""
                INSERT INTO kelas_dosen (kelas_id, dosen_id, urutan_dosen)
                VALUES (%s, %s, %s)
            """, (kelas_id, dosen_id, urutan))

        # Masukkan data rooms terkait kelas
        for urutan, rooms_id in enumerate(rooms_ids, start=1):
            cur.execute("""
                INSERT INTO kelas_rooms (kelas_id, rooms_id, urutan_rooms)
                VALUES (%s, %s, %s)
            """, (kelas_id, rooms_id, urutan))

        # Commit perubahan
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil ditambahkan dengan status terpakai"}), 200

    except Exception as e:
        print("Error terjadi:", e)
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500


@kelas_bp.route('/kelasdelete/<int:id_kelas>', methods=['DELETE'])
def delete_kelas(id_kelas):
    try:
        cur = mysql.connection.cursor()

        # Hapus entri terkait dari tabel kelas_dosen dan kelas_rooms terlebih dahulu
        cur.execute("DELETE FROM kelas_dosen WHERE kelas_id = %s", (id_kelas,))
        cur.execute("DELETE FROM kelas_rooms WHERE kelas_id = %s", (id_kelas,))

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
        rooms_ids = data.get('rooms_ids', [])

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

        # Hapus data rooms yang terkait kelas ini di tabel kelas_rooms
        cur.execute("DELETE FROM kelas_rooms WHERE kelas_id = %s", (id_kelas,))

        # Masukkan data rooms baru dengan urutan sesuai frontend
        for urutan, rooms_id in enumerate(rooms_ids, start=1):
            cur.execute("""
                INSERT INTO kelas_rooms (kelas_id, rooms_id, urutan_rooms)
                VALUES (%s, %s, %s)
            """, (id_kelas, rooms_id, urutan))

        # Commit perubahan
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil diubah"}), 200

    except Exception as e:
        print("Error terjadi:", e)
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500
    
@kelas_bp.route('/kelaseditpakai', methods=['PUT'])
def edit_kelaspakai():
    try:
        data = request.get_json()
        rowStatus = data.get('rowStatus')  # Mendapatkan array rowStatus dari body permintaan
        
        if not rowStatus:
            return jsonify({"error": "Data tidak ditemukan."}), 400
        
        # Menyiapkan cursor untuk query ke database
        cur = mysql.connection.cursor()

        # Looping melalui setiap item di rowStatus untuk melakukan pembaruan pada setiap kelas
        for kelas in rowStatus:
            kelasId = kelas.get('kelasId')
            terpakai = kelas.get('terpakai')
            
            # Melakukan pembaruan pada kelas yang sesuai
            cur.execute("""
                UPDATE kelas_db 
                SET terpakai = %s
                WHERE id_kelas = %s
            """, (terpakai, kelasId))
        
        # Commit perubahan dan tutup cursor
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil diubah"}), 200

    except Exception as e:
        print("Error terjadi:", e)
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500