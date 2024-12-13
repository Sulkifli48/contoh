from flask import Blueprint, jsonify, request
from database import mysql
from datetime import datetime

dosen_bp = Blueprint('dosen', __name__)

@dosen_bp.route('/listdosen', methods=['GET'])
def get_dosen():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_dosen, nip, dosen, createdAt FROM dosen_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_dosen': row[0],
            'nip': row[1],
            'dosen': row[2],
            'createdAt': row[3],
        }
        for row in rows
    ]
    
    return jsonify(data), 200

@dosen_bp.route('/dosenadd', methods=['POST'])
def add_dosen():
    data = request.get_json()
    nip = data['nip']
    dosen = data['dosen']
    createdAt = datetime.now()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO dosen_db (nip, dosen, createdAt) VALUES (%s, %s, %s)",
                (nip, dosen, createdAt))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Add Admin added successfully!'}), 201

@dosen_bp.route('/dosendelete/<int:id_dosen>', methods=['DELETE'])
def delete_dosen(id_dosen):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM dosen_db WHERE id_dosen = %s", (id_dosen,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Matakuliah deleted successfully!'}), 200

@dosen_bp.route('/checkDosenUsage/<int:id_dosen>', methods=['GET'])
def check_dosen_usage(id_dosen):
    try:
        cur = mysql.connection.cursor()
        
        # Cek referensi di tabel kelas_db
        cur.execute("SELECT COUNT(*) FROM dosen_db WHERE id_dosen = %s", (id_dosen,))
        kelas_count = cur.fetchone()[0]
        
        # Cek referensi di tabel kelas_dosen
        cur.execute("SELECT COUNT(*) FROM kelas_dosen WHERE dosen_id = %s", (id_dosen,))
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
    
@dosen_bp.route('/dosenedit/<int:id_dosen>', methods=['PUT'])
def edit_dosen(id_dosen):
    data = request.get_json()
    nip = data.get('nip')
    dosen = data.get('dosen')

    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE dosen_db 
            SET nip = %s, dosen = %s
            WHERE id_dosen = %s
        """, (nip, dosen, id_dosen))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Dosen updated successfully!'}), 200
    except Exception as e:
        print(f"Error updating dosen: {e}")
        return jsonify({'error': 'Failed to update dosen'}), 500