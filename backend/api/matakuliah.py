from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

matakuliah_bp = Blueprint('matakuliah', __name__)

@matakuliah_bp.route('/listmatakuliah', methods=['GET'])
def get_matakuliah():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_matkul, kode, matakuliah, sks, jenjang, wp, semester, createdAt FROM matakuliah_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_matkul': row[0],
            'kode': row[1],
            'matakuliah': row[2],
            'sks': row[3],
            'jenjang': row[4],
            'wp': row[5],
            'semester': row[6],
            'createdAt': row[7],
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
    wp = data['wp']
    semester = data['semester']
    jenjang = data['jenjang']
    createdAt = datetime.now()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO matakuliah_db (kode, matakuliah, sks, wp, semester, jenjang, createdAt) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (kode, matakuliah, sks, wp, semester, jenjang, createdAt))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Matakuliah added successfully!'}), 201

@matakuliah_bp.route('/matakuliah/<int:id_matkul>', methods=['DELETE'])
def delete_matakuliah(id_matkul):
    cur = mysql.connection.cursor()
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
    data = request.get_json()
    kode = data.get('kode')
    matakuliah = data.get('matakuliah')
    sks = data.get('sks')
    jenjang = data.get('jenjang')
    wp = data.get('wp')
    semester = data.get('semester')
    
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE matakuliah_db 
            SET kode = %s, matakuliah = %s, sks = %s, jenjang = %s, wp = %s, semester = %s
            WHERE id_matkul = %s
        """, (kode, matakuliah, sks, jenjang, wp, semester, id_matkul))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'matakuliah updated successfully!'}), 200
    except Exception as e:
        print(f"Error updating matkul: {e}")
        return jsonify({'error': 'Failed to update matkul'}), 500


