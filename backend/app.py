from flask import Flask
from database import mysql, init_db
from flask_cors import CORS

from api.matakuliah import matakuliah_bp
from api.users import users_bp
from api.dosen import dosen_bp
from api.ruangan import ruangan_bp
from api.kelas import kelas_bp

app = Flask(__name__)

# Inisialisasi database
init_db(app)
CORS(app)

# Register blueprint untuk endpoint matakuliah
app.register_blueprint(matakuliah_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')
app.register_blueprint(dosen_bp, url_prefix='/api')
app.register_blueprint(ruangan_bp, url_prefix='/api')
app.register_blueprint(kelas_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
    