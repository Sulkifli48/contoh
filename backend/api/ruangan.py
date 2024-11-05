from flask import Blueprint, jsonify, request  # Tambahkan request di sini
from database import mysql
from datetime import datetime

ruangan_bp = Blueprint('ruangan', __name__)
