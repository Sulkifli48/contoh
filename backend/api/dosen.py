from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

dosen_bp = Blueprint('dosen', __name__)
