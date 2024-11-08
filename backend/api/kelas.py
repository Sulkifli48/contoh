from flask import Blueprint, jsonify, request  # Tambahkan request di sini
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
            kelas_db.kelas, 
            dosen_db.name, 
            kelas_db.kapasitas, 
            kelas_db.createdAt 
        FROM kelas_db
        JOIN matakuliah_db ON kelas_db.id_matkul = matakuliah_db.id_matkul
        JOIN dosen_db ON kelas_db.id_dosen = dosen_db.id_dosen
    """)
    rows = cur.fetchall()
    cur.close()
    
    # Format data hasil query untuk JSON response
    data = [
        {
            'id_kelas': row[0],
            'matakuliah': row[1],
            'kelas': row[2],
            'dosen': row[3],
            'kapasitas': row[4],
            'createdAt': row[5]
        }
        for row in rows
    ]
    return jsonify(data), 200

