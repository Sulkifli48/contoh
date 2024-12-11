from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

matakuliah_bp = Blueprint('matakuliah', __name__)

@matakuliah_bp.route('/listmatakuliah', methods=['GET'])
def get_matakuliah():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            matakuliah_db.id_matkul, 
            matakuliah_db.kode, 
            matakuliah_db.matakuliah,
            matakuliah_db.sks,
            matakuliah_db.durasi,
            matakuliah_db.jenjang,
            matakuliah_db.wp, 
            GROUP_CONCAT(semester_db.semester ORDER BY semester_matakuliah.semester_id SEPARATOR ', ') AS jenis_list,
            matakuliah_db.createdAt
        FROM 
            matakuliah_db
        LEFT JOIN 
            semester_matakuliah ON matakuliah_db.id_matkul = semester_matakuliah.matkul_id
        LEFT JOIN 
            semester_db ON semester_matakuliah.semester_id = semester_db.id_semester
        GROUP BY 
            matakuliah_db.id_matkul, matakuliah_db.kode, matakuliah_db.matakuliah, matakuliah_db.sks, matakuliah_db.durasi, matakuliah_db.jenjang, matakuliah_db.wp, matakuliah_db.createdAt
    """)
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_matkul': row[0],
            'kode': row[1],
            'matakuliah': row[2],
            'sks': row[3],
            'durasi': row[4],
            'jenjang': row[5],
            'wp': row[6],
            'semester': [int(x) for x in row[7].split(', ')] if row[7] else [],
            'createdAt': row[8],
        }
        for row in rows
    ]
    
    return jsonify(data), 200

@matakuliah_bp.route('/listsemester', methods=['GET'])
def get_dosen():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_semester, semester FROM semester_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_semester': row[0],
            'semester': row[1],
        }
        for row in rows
    ]
    
    return jsonify(data), 200


@matakuliah_bp.route('/matakuliahadd', methods=['POST'])
def add_matakuliah():
    data = request.get_json()
    kode = data['kode']
    matakuliah = data['matakuliah']
    sks = data['sks']
    durasi = data['durasi']
    wp = data['wp']
    semester_ids = data['semester_ids']
    jenjang = data['jenjang']
    createdAt = datetime.now()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO matakuliah_db (kode, matakuliah, sks, durasi, wp, jenjang, createdAt) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (kode, matakuliah, sks, durasi, wp, jenjang, createdAt))
    
    matkul_id = cur.lastrowid
    
    for semester_id in semester_ids:
            cur.execute("""
                INSERT INTO semester_matakuliah (matkul_id, semester_id)
                VALUES (%s, %s)
            """, (matkul_id, semester_id))
            
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Matakuliah added successfully!'}), 201

@matakuliah_bp.route('/matakuliah/<int:id_matkul>', methods=['DELETE'])
def delete_matakuliah(id_matkul):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM semester_matakuliah WHERE matkul_id = %s", (id_matkul,))
    cur.execute("DELETE FROM matakuliah_db WHERE id_matkul = %s", (id_matkul,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Matakuliah deleted successfully!'}), 200

@matakuliah_bp.route('/checkMatkulUsage/<int:id_matkul>', methods=['GET'])
def check_matkul_usage(id_matkul):
    try:
        cur = mysql.connection.cursor()
        
        # Cek referensi di tabel kelas_db
        cur.execute("SELECT COUNT(*) FROM matakuliah_db WHERE id_matkul = %s", (id_matkul,))
        kelas_count = cur.fetchone()[0]
        
        # Cek referensi di tabel kelas_dosen
        cur.execute("SELECT COUNT(*) FROM kelas_db WHERE matkul_id = %s", (id_matkul,))
        jadwal_count = cur.fetchone()[0]
        
        cur.close()
        
        # Buat respon yang menunjukkan status penggunaan di masing-masing tabel
        usage_status = {
            "is_used_in_kelas": kelas_count > 0,
            "is_used_in_jadwal": jadwal_count > 0
        }
        
        return jsonify(usage_status), 200
    except Exception as e:
        print(f"Error checking dosen usage: {e}")
        return jsonify({'error': 'Failed to check dosen usage'}),

@matakuliah_bp.route('/matakuliahedit/<int:id_matkul>', methods=['PUT'])
def edit_matkul(id_matkul):
    try:
        data = request.get_json()   
        kode = data.get('kode')
        matakuliah = data.get('matakuliah')
        sks = data.get('sks')
        durasi = data.get('durasi')
        jenjang = data.get('jenjang')
        wp = data.get('wp')
        semester_ids = data.get('semester_ids', []) 

        cur = mysql.connection.cursor()

        cur.execute("""
            UPDATE matakuliah_db 
            SET kode = %s, matakuliah = %s, sks = %s, durasi = %s, jenjang = %s, wp = %s
            WHERE id_matkul = %s
        """, (kode, matakuliah, sks, durasi, jenjang, wp, id_matkul))

        cur.execute("DELETE FROM semester_matakuliah WHERE matkul_id = %s", (id_matkul,))

        for semester_id in semester_ids:
            cur.execute("""
                INSERT INTO semester_matakuliah (matkul_id, semester_id)
                VALUES (%s, %s)
            """, (id_matkul, semester_id))

        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil diubah"}), 200

    except Exception as e:
        print("Error terjadi:", e)
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500



