from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/listusers', methods=['GET'])
def get_listusers():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_users, name, email, createdAt FROM users_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_users': row[0],
            'name': row[1],
            'email': row[2],
            'createdAt': row[3],
        }
        for row in rows
    ]
    return jsonify(data), 200

@users_bp.route('/usersadd', methods=['POST'])
def add_users():
    data = request.get_json()
    name = data['name']
    email = data['email']
    createdAt = datetime.now()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users_db (name, email, createdAt) VALUES (%s, %s, %s)",
                (name, email, createdAt))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Add Admin added successfully!'}), 201

@users_bp.route('/usersdelete/<int:id_users>', methods=['DELETE'])
def delete_users(id_users):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM users_db WHERE id_users = %s", (id_users,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Matakuliah deleted successfully!'}), 200
