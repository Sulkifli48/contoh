from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

dosen_bp = Blueprint('dosen', __name__)

@dosen_bp.route('/listdosen', methods=['GET'])
def get_dosen():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_dosen, nip, name, bidang, createdAt FROM dosen_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_dosen': row[0],
            'nip': row[1],
            'name': row[2],
            'bidang': row[3],
            'createdAt': row[4],
        }
        for row in rows
    ]
    
    return jsonify(data), 200

@dosen_bp.route('/dosenadd', methods=['POST'])
def add_dosen():
    data = request.get_json()
    nip = data['nip']
    name = data['name']
    bidang = data['bidang']
    createdAt = datetime.now()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO dosen_db (nip, name, bidang, createdAt) VALUES (%s, %s, %s, %s)",
                (nip, name, bidang, createdAt))
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

