from flask import Blueprint, jsonify, request
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
    password = data['password']
    createdAt = datetime.now()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users_db (name, email, password, createdAt) VALUES (%s, %s, %s, %s)",
                (name, email, password, createdAt))
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

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')  

    cur = mysql.connection.cursor()
    cur.execute("SELECT id_users, name, email FROM users_db WHERE email = %s AND password = %s", (email, password))
    user = cur.fetchone()
    cur.close()

    if user:
        response = {
            'id_users': user[0],
            'name': user[1],
            'email': user[2],
            'user_role': 'Admin'  # Sesuaikan dengan kolom role jika tersedia
        }
        return jsonify(response), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401