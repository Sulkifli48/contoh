import React, { useEffect, useState } from 'react'; // Impor useEffect dan useState
import axios from 'axios'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css'; 

const Home = () => {
    const [selectedDay, setSelectedDay] = useState('Senin');
    const [schedule, setSchedule] = useState([]);
    
    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const rooms = ['GR01', 'GR02', 'GR03', 'GR04','GR05','GR06','GR07'];

    const times = [];
    const morningStartHour = 7;
    const morningStartMinute = 50;
    const morningEndHour = 12;
    const afternoonStartHour = 13;
    const afternoonEndHour = 16;
    const interval = 50;

    const generateTimes = (startHour, startMinute, endHour, timesArray) => {
        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute === 0)) {
            const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            currentMinute += interval;

            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
            
            if (startTime === '12:00') {
                currentHour = 13; 
                currentMinute = 0; 
                continue;
            }

            const endTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            timesArray.push(`${startTime} - ${endTime}`);
        }
    };

    generateTimes(morningStartHour, morningStartMinute, morningEndHour, times);
    times.push('12:00 - 13:00');
    generateTimes(afternoonStartHour, 0, afternoonEndHour, times);

    useEffect(() => {
        // Fetch schedule data from API
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/schedule'); // Tidak perlu await response.json();
                setSchedule(response.data); // Set data dari API langsung
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            }
        };
    
        fetchSchedule();
    }, []);
    

    const calculateRowSpan = (start, end) => {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
    
        return Math.ceil((endTotalMinutes - startTotalMinutes) / interval);
    };
    
    const calculateEndTime = (startTime, sks) => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const totalMinutes = startHour * 60 + startMinute + (sks * 50);
        const endHour = Math.floor(totalMinutes / 60) % 24;
        const endMinute = totalMinutes % 60;
        return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    };
    

    const getColorByLevel = (level) => {
        switch (level) {
            case 'S1':
                return '#B8860B';
            case 'S2':
                return '#8FBC8F'; 
            case 'Inter':
                return '#5F9EA0';
            default:
                return '#FFFFFF';
        }
    };

    return (
        <div>
            <Header />
            <div className="container">
                <div className="day-select">
                    <label htmlFor="day">Select a day:</label>
                    <select id="day" value={selectedDay} onChange={handleDayChange}>
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tabel untuk menampilkan jadwal */}
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Waktu</th>
                            {rooms.map((room) => (
                                <th key={room}>{room}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                            {times.map((time, index) => {
                            const [startTime, endTime] = time.split(' - ');

                            return (
                                <tr key={index}>
                                    <td>{time}</td>
                                    {rooms.map((room) => {
                                        // Find if there's a class starting at this time
                                        const classInSlot = schedule.find(
                                            (s) =>
                                                s.room === room &&
                                                s.start === startTime &&
                                                s.day === selectedDay
                                        );

                                        if (classInSlot) {
                                            const endTimeCalculated = calculateEndTime(classInSlot.start, classInSlot.sks); // Menghitung waktu akhir
                                            const rowSpan = calculateRowSpan(classInSlot.start, endTimeCalculated);
                                            const color = getColorByLevel(classInSlot.level);
                                            return (
                                                <td key={room} rowSpan={rowSpan}>
                                                    <div className="schedule-matkul" style={{ backgroundColor: color }}>
                                                    {classInSlot.subject}&nbsp;
                                                    ({classInSlot.level}) <br />
                                                    {classInSlot.dosen1} <br />
                                                    {classInSlot.dosen2 && <>{classInSlot.dosen2}<br /></>}
                                                    {classInSlot.dosen3 && <>{classInSlot.dosen3}<br /></>}
                                                    </div>
                                                </td>
                                            );
                                        }

                                        // Check if the current time falls within a class's range
                                        const classInRange = schedule.find(
                                            (s) =>
                                                s.room === room &&
                                                calculateEndTime(s.start, s.sks) > startTime &&
                                                s.start < endTime &&
                                                s.day === selectedDay
                                        );

                                        if (classInRange) {
                                            return null;
                                        }

                                        return <td key={room}></td>;
                                    })}
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
