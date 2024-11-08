from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/schedule', methods=['GET'])
def get_schedule():
    schedule = [
    {
        "subject": "Basis Data A",
        "room": "GR01",
        "start": "07:50",
        "day": "Senin",
        "sks": 2,
        "level": "S1",
        "dosen1": "Pak Dosen 1",
        "dosen2": "Pak Dosen 2",
    },
    {
        "subject": "Pemrograman Web B",
        "room": "GR02",
        "start": "13:00",
        "day": "Senin",
        "sks": 2,
        "level": "S2",
        "dosen1": "Pak Dosen 1",
        "dosen2": "Pak Dosen 2",
    },
    {
        "subject": "Komputasi B",
        "room": "GR02",
        "start": "14:40",
        "day": "Senin",
        "sks": 2,
        "level": "Inter",
        "dosen1": "Pak Dosen 1",
    },
    {
        "subject": "Pemrograman Web A",
        "room": "GR04",
        "start": "13:50",
        "day": "Senin",
        "sks": 3,
        "level": "S1",
        "dosen1": "Pak Dosen 1",
        "dosen2": "Pak Dosen 2",
        "dosen3": "Pak Dosen 3",
    },
    ]
    return jsonify(schedule)

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)