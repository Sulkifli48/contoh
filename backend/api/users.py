from flask import Blueprint, jsonify, request
from database import mysql
from datetime import datetime
import jwt
import datetime as dt
from functools import wraps

SECRET_KEY = "your_secret_key" 

users_bp = Blueprint('users', __name__)

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] 
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['id_users']  
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated_function


@users_bp.route('/listusers', methods=['GET'])
@token_required
def get_listusers(current_user):
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
@token_required
def add_users(current_user):
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

    return jsonify({'message': 'Admin added successfully!'}), 201

@users_bp.route('/usersdelete/<int:id_users>', methods=['DELETE'])
@token_required
def delete_users(current_user, id_users):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM users_db WHERE id_users = %s", (id_users,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'User deleted successfully!'}), 200

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
        token = jwt.encode(
            {'id_users': user[0], 'exp': dt.datetime.utcnow() + dt.timedelta(hours=24)},
            SECRET_KEY,
            algorithm="HS256"
        )
        response = {
            'id_users': user[0],
            'name': user[1],
            'email': user[2],
            'token': token  
        }
        return jsonify(response), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
