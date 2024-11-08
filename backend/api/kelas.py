from flask import Blueprint, jsonify, request
from database import mysql
from datetime import datetime

kelas_bp = Blueprint('kelas', __name__)

@kelas_bp.route('/kelas', methods=['GET'])
def get_kelas():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            kelas_db.id_kelas, 
            matakuliah_db.jenjang,
            matakuliah_db.semester,
            matakuliah_db.matakuliah,
            kelas_db.skala,
            kelas_db.kelas,
            dosen_db.dosen,
            kelas_db.kapasitas,
            kelas_db.createdAt
        FROM 
            kelas_db
        JOIN 
            matakuliah_db ON kelas_db.id_matkul = matakuliah_db.id_matkul
        JOIN 
            dosen_db ON kelas_db.id_dosen = dosen_db.id_dosen
    """)
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_kelas': row[0],
            'jenjang': row[1],
            'semester': row[2],
            'matakuliah': row[3],
            'skala': row[4],
            'kelas': row[5],
            'dosen': row[6],
            'kapasitas': row[7],
            'createdAt': row[8],
        }
        for row in rows
    ]
    return jsonify(data), 200

@kelas_bp.route('/kelas', methods=['POST'])
def add_kelas():
    data = request.get_json()

    # Mengambil data dari request JSON
    id_matkul = data['id_matkul']
    id_dosen = data['id_dosen']
    skala = data['skala']
    kelas = data['kelas']
    kapasitas = data['kapasitas']
    createdAt = datetime.now()

    # Menyimpan data ke tabel kelas_db
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO kelas_db (id_matkul, id_dosen, skala, kelas, kapasitas, createdAt)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (id_matkul, id_dosen, skala, kelas, kapasitas, createdAt))

    # Commit perubahan ke database dan tutup cursor
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Kelas added successfully!'}), 201


@kelas_bp.route('/kelas/<int:id_kelas>', methods=['DELETE'])
def delete_kelas(id_kelas):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM kelas_db WHERE id_kelas = %s", (id_kelas,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Kelas deleted successfully!'}), 200
