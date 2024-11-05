from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

matakuliah_bp = Blueprint('matakuliah', __name__)

@matakuliah_bp.route('/matakuliah', methods=['GET'])
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

@matakuliah_bp.route('/matakuliah', methods=['POST'])
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
