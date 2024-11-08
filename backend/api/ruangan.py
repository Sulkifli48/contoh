from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

ruangan_bp = Blueprint('ruangan', __name__)

@ruangan_bp.route('/listruangan', methods=['GET'])
def get_ruangan():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_ruangan, name, kapasitas, createdAt FROM ruangan_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_ruangan': row[0],
            'name': row[1],
            'kapasitas': row[2],
            'createdAt': row[3],
        }
        for row in rows
    ]
    
    return jsonify(data), 200

@ruangan_bp.route('/ruanganadd', methods=['POST'])
def add_ruangan():
    data = request.get_json()
    name = data['name']
    kapasitas = data['kapasitas']
    createdAt = datetime.now()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO ruangan_db (name, kapasitas, createdAt) VALUES (%s, %s, %s)",
                (name, kapasitas, createdAt))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Add Admin added successfully!'}), 201

@ruangan_bp.route('/ruangandelete/<int:id_ruangan>', methods=['DELETE'])
def delete_ruangan(id_ruangan):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM ruangan_db WHERE id_ruangan = %s", (id_ruangan,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Matakuliah deleted successfully!'}), 200

