import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    Typography, 
    CircularProgress,
  } from '@mui/material';
import './Home.css'; // Impor CSS untuk styling

const Home = () => {
    const [selectedDay, setSelectedDay] = useState('Senin');
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const [ruangan, setruangan] = useState([]);

    // Ruangan yang akan ditampilkan
    const fetchruanganData = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/listruangan');
            setruangan(response.data.map((ruangan) => ruangan.name)); 
        } catch (error) {
            setError("Error fetching ruangan data");
        }
    }, []);

    const fetchScheduleData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/jadwals1');
            setSchedule(response.data);
        } catch (error) {
            setError("Error fetching schedule data");
        } finally {
            setLoading(false);
        }
    }, []);
    
    

    useEffect(() => {
        fetchScheduleData();
    }, [fetchScheduleData]);
    
    useEffect(() => {
        fetchruanganData();
    }, [fetchruanganData]);

    
    
    const mergeScheduleData = (schedule) => {
        const mergedSchedule = [];
    
        schedule.forEach(item => {
            const existingSchedule = mergedSchedule.find(mergedItem => 
                mergedItem.kelas === item.kelas && 
                mergedItem.ruangan === item.ruangan && 
                mergedItem.hari === item.hari
            );
    
            if (existingSchedule) {
                // Hanya tambahkan jam jika belum ada dalam daftar jam
                item.jam.forEach(jam => {
                    if (!existingSchedule.jam.includes(jam)) {
                        existingSchedule.jam.push(jam);
                    }
                });
                // Gabungkan dosen yang unik
                existingSchedule.dosen = [...new Set([...existingSchedule.dosen, item.dosen])];
            } else {
                mergedSchedule.push({
                    ...item,
                    dosen: [item.dosen],
                    jam: [...item.jam],
                    day: item.hari,
                    isConflict: false,
                });
            }
        });
    
        mergedSchedule.forEach(item => {
            if (item.jam.length > 0) {
                const sortedTimes = item.jam.sort((a, b) => {
                    const [startA] = a.split(' - ');
                    const [startB] = b.split(' - ');
                    return startA.localeCompare(startB);
                });
    
                item.start = sortedTimes[0].split(' - ')[0];
                item.end = sortedTimes[sortedTimes.length - 1].split(' - ')[1];
            }
        });
    
        mergedSchedule.forEach(item => {
            const conflictingItem = mergedSchedule.find(
                other => other.ruangan === item.ruangan &&
                         other.start < item.end && other.end > item.start && 
                         other.day === item.day && other !== item
            );
            if (conflictingItem) {
                item.isConflict = true; 
            }
        });
    
        return mergedSchedule;
    };
    
    // Menggabungkan jadwal dan mendeteksi tabrakan
    const mergedSchedule = mergeScheduleData(schedule);
    
    // Menampilkan hasil
    console.log(mergedSchedule);
     
    

    // Waktu untuk ditampilkan di kolom kiri
    const times = [];
    const morningStartHour = 7;
    const morningStartMinute = 50;
    const morningEndHour = 12;
    const afternoonStartHour = 13;
    const afternoonEndHour = 17;
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

    
    const calculateRowSpan = (start, end) => {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        return Math.ceil((endTotalMinutes - startTotalMinutes) / interval);
    };

    const totalData = mergedSchedule.length;
    const totalConflicts = mergedSchedule.filter(item => item.isConflict).length;

    return (
        <div>
            <Header />
            <div className='head'>
                <h1 className='head-h1'>Departemen Informatika Universitas Hasanuddin</h1>
                <h2 className='head-h2'>Jadwal Perkuliahan Semester Ganjil 2024/2025</h2>
            </div>
            <div className="container">
                    {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <CircularProgress />
                        <Typography className='loading-message' variant="h6">Loading...</Typography>
                    </div>
                    )
                     : error ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Typography className='error-message' color="error">{error}</Typography>
                    </div>
                    ) : (
                    <>
                    <div className="statistics" style={{ textAlign: 'center', margin: '20px 0' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>
                            Total Data: <span style={{ color: '#007bff' }}>{totalData}</span>
                        </Typography>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333'}}>
                            Total Konflik: <span style={{ color: totalConflicts > 0 ? '#d32f2f' : '#4caf50' }}>{totalConflicts}</span>
                        </Typography>
                    </div>
                        <div className="day-select">
                            <label htmlFor="day">Pilih Hari:</label>
                            <select id="day" value={selectedDay} onChange={handleDayChange}>
                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
    
                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th>Waktu</th>
                                    {ruangan.map((ruangan) => (
                                        <th key={ruangan}>{ruangan}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {times.map((time, index) => {
                                    const [startTime, endTime] = time.split(' - ');
    
                                    return (
                                        <tr key={index}>
                                            <td>{time}</td>
                                            {ruangan.map((ruangan) => {
                                                const classInSlot = mergedSchedule.find(
                                                    (s) =>
                                                        s.ruangan === ruangan &&
                                                        s.start === startTime &&
                                                        s.day === selectedDay
                                                );
    
                                                if (classInSlot) {
                                                    const rowSpan = calculateRowSpan(classInSlot.start, classInSlot.end);
                                                    return (
                                                        <td key={ruangan} rowSpan={rowSpan}>
                                                            <div className={`schedule-matkul ${classInSlot.isConflict ? 'conflict' : ''}`}>
                                                                {classInSlot.kelas}&nbsp;
                                                                <br />
                                                                <br />
                                                                {classInSlot.dosen.map((dosen, idx) => (
                                                                    <React.Fragment key={idx}>
                                                                        <div className='dosen-left'>
                                                                            {idx + 1}. {dosen}
                                                                            <br />
                                                                        </div>
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    );
                                                }
    
                                                const classInRange = mergedSchedule.find(
                                                    (s) =>
                                                        s.ruangan === ruangan &&
                                                        s.start < endTime &&
                                                        s.end > startTime &&
                                                        s.day === selectedDay
                                                );
    
                                                if (classInRange) {
                                                    return null;
                                                }
    
                                                return <td key={ruangan}></td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        </>
                )}
            </div>
            <Footer />
        </div>
    );    
};

export default Home;

