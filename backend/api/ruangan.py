from flask import Blueprint, jsonify, request 
from database import mysql
from datetime import datetime

ruangan_bp = Blueprint('ruangan', __name__)

@ruangan_bp.route('/listruangan', methods=['GET'])
def get_ruangan():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            ruangan_db.id_ruangan, 
            ruangan_db.name, 
            ruangan_db.kapasitas, 
            GROUP_CONCAT(jenis_db.jenis ORDER BY jenis_ruangan.jenis_id SEPARATOR ', ') AS jenis_list,
            ruangan_db.createdAt
        FROM 
            ruangan_db
        LEFT JOIN 
            jenis_ruangan ON ruangan_db.id_ruangan = jenis_ruangan.ruangan_id
        LEFT JOIN 
            jenis_db ON jenis_ruangan.jenis_id = jenis_db.id_jenis
        GROUP BY 
            ruangan_db.id_ruangan, ruangan_db.name, ruangan_db.kapasitas, ruangan_db.createdAt
    """)
    rows = cur.fetchall()
    cur.close()

    data = [
        {
            'id_ruangan': row[0],
            'name': row[1],
            'kapasitas': row[2],
            'jenis': row[3].split(', ') if row[3] else [], 
            'createdAt': row[4],
        }
        for row in rows
    ]
    
    return jsonify(data), 200

@ruangan_bp.route('/listjenis', methods=['GET'])
def get_dosen():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id_jenis, jenis FROM jenis_db")
    rows = cur.fetchall()
    cur.close()
    data = [
        {
            'id_jenis': row[0],
            'jenis': row[1],
        }
        for row in rows
    ]
    
    return jsonify(data), 200


@ruangan_bp.route('/ruanganadd', methods=['POST'])
def add_ruangan():
    try:
        data = request.get_json()
        name = data['name']
        kapasitas = data['kapasitas']
        jenis_ids = data['jenis_ids']
        createdAt = datetime.now() 

        cur = mysql.connection.cursor()

        cur.execute("""
            INSERT INTO ruangan_db (name, kapasitas, createdAt)
            VALUES (%s, %s, %s)
        """, (name, kapasitas, createdAt))
        ruangan_id = cur.lastrowid

        for jenis_id in jenis_ids:
            cur.execute("""
                INSERT INTO jenis_ruangan (ruangan_id, jenis_id)
                VALUES (%s, %s)
            """, (ruangan_id, jenis_id))

        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil ditambahkan dengan dosen terkait"}), 200

    except Exception as e:
        print("Error terjadi:", e)
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500

@ruangan_bp.route('/ruangandelete/<int:id_ruangan>', methods=['DELETE'])
def delete_ruangan(id_ruangan):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM jenis_ruangan WHERE ruangan_id = %s", (id_ruangan,))
    cur.execute("DELETE FROM ruangan_db WHERE id_ruangan = %s", (id_ruangan,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Matakuliah deleted successfully!'}), 200

@ruangan_bp.route('/ruanganedit/<int:id_ruangan>', methods=['PUT'])
def edit_ruangan(id_ruangan):
    
    try:
        data = request.get_json()
        name = data.get('name')
        kapasitas = data.get('kapasitas')
        jenis_ids = data.get('jenis_ids', []) 

        cur = mysql.connection.cursor()

        cur.execute("""
            UPDATE ruangan_db 
            SET name = %s, kapasitas = %s
            WHERE id_ruangan = %s
        """, (name, kapasitas, id_ruangan))

        cur.execute("DELETE FROM jenis_ruangan WHERE ruangan_id = %s", (id_ruangan,))

        for jenis_id in jenis_ids:
            cur.execute("""
                INSERT INTO jenis_ruangan (ruangan_id, jenis_id)
                VALUES (%s, %s)
            """, (id_ruangan, jenis_id))

        # Commit perubahan
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Kelas berhasil diubah"}), 200

    except Exception as e:
        print("Error terjadi:", e)
        return jsonify({"error": "Terjadi kesalahan server", "detail": str(e)}), 500


