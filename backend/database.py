from flask_mysqldb import MySQL
from flask import Flask

mysql = MySQL()

def init_db(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = ''  # Ubah sesuai password MySQL Anda
    app.config['MYSQL_DB'] = 'penjadwalan'  # Nama database Anda
    mysql.init_app(app)
