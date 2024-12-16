import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    Typography, 
    CircularProgress,
    Button,
  } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Home.css'; 

const Home = () => {
    const [selectedDay, setSelectedDay] = useState('Senin');
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const [ruangan, setruangan] = useState([]);

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
    
        const parseWeekRange = (weekRange) => {
            const [start, end] = weekRange.split('-').map(Number);
            return { start, end };
        };
    
        const sortWeeksAndFollowDosen = (weeks, dosens) => {
            const parsedWeeks = weeks.map((week, index) => ({
                week,
                dosen: dosens[index],
                ...parseWeekRange(week),
            }));
            parsedWeeks.sort((a, b) => a.start - b.start);
            return {
                sortedWeeks: parsedWeeks.map((item) => item.week),
                sortedDosens: parsedWeeks.map((item) => item.dosen),
            };
        };
    
        schedule.forEach(item => {
            // Cari entri jadwal yang sama berdasarkan kombinasi kelas, ruangan, dan hari
            const existingSchedule = mergedSchedule.find(mergedItem =>
                mergedItem.kelas === item.kelas &&
                mergedItem.ruangan === item.ruangan &&
                mergedItem.hari === item.hari
            );
    
            if (existingSchedule) {
                // Gabungkan daftar jam
                item.jam.forEach(jam => {
                    if (!existingSchedule.jam.includes(jam)) {
                        existingSchedule.jam.push(jam);
                    }
                });
    
                // Gabungkan nilai minggu
                if (!existingSchedule.minggu.includes(item.minggu)) {
                    existingSchedule.minggu.push(item.minggu);
                    existingSchedule.dosen.push(item.dosen);
                }

                 // Urutan dosen berdasarkan minggu
                const { sortedWeeks, sortedDosens } = sortWeeksAndFollowDosen(existingSchedule.minggu, existingSchedule.dosen);
                existingSchedule.minggu = sortedWeeks;
                existingSchedule.dosen = sortedDosens;
    
            } else {
                mergedSchedule.push({
                    ...item,
                    dosen: [item.dosen],
                    jam: [...item.jam],
                    minggu: [item.minggu],
                    day: item.hari,
                    isConflict: false,
                });
            }
        });
    
        // Urutkan dan set waktu mulai dan selesai
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

        // Aturan umum
        mergedSchedule.forEach(item => {
            const conflictingItemByDosen = mergedSchedule.find(
                other =>
                    other !== item &&
                    other.day === item.day &&
                    other.start < item.end &&
                    other.end > item.start &&
                    other.dosen.some((dosen, index) => 
                        item.dosen[index] && item.dosen[index] === dosen // Cocokkan berdasarkan posisi
                    )
            );

            const conflictingItemByRuangan = mergedSchedule.find(
                other =>
                    other !== item &&
                    other.day === item.day &&
                    other.ruangan === item.ruangan &&
                    other.start < item.end &&
                    other.end > item.start
            );

            if (conflictingItemByDosen || conflictingItemByRuangan) {
                item.isConflict = true;
            }
        });
        
        // Aturan Khusus
        mergedSchedule.forEach(item => {
            if (item.dosen.length === 3) {
                const dosenUrutanKedua = item.dosen[1];
    
                const conflictingBySpecialRule = mergedSchedule.filter(
                    other =>
                        other !== item &&
                        other.day === item.day &&
                        other.start < item.end &&
                        other.end > item.start &&
                        other.dosen.includes(dosenUrutanKedua)
                );
    
                if (conflictingBySpecialRule.length > 0) {
                    item.isConflict = true;
                    conflictingBySpecialRule.forEach(conflictingItem => {
                        conflictingItem.isConflict = true;
                    });
                }
            }
    
            if (item.dosen.length === 1) {
                const dosenUrutanSatu = item.dosen[0];
    
                const conflictingBySpecialRule = mergedSchedule.filter(
                    other =>
                        other !== item &&
                        other.day === item.day &&
                        other.start < item.end &&
                        other.end > item.start &&
                        other.dosen.includes(dosenUrutanSatu)
                );
    
                if (conflictingBySpecialRule.length > 0) {
                    item.isConflict = true;
                    conflictingBySpecialRule.forEach(conflictingItem => {
                        conflictingItem.isConflict = true;
                    });
                }
            }
        });
    
        return mergedSchedule;
    };
    
    
    const mergedSchedule = mergeScheduleData(schedule);
    console.log(mergedSchedule);

    const handleConflictClick = (conflictingClass) => {
        const conflictingItems = mergedSchedule.filter(
            (item) =>
                item.day === conflictingClass.day &&
                item !== conflictingClass && (
                    (item.ruangan === conflictingClass.ruangan &&
                     item.start < conflictingClass.end && 
                     item.end > conflictingClass.start) ||
                    (item.dosen.some(dosen => conflictingClass.dosen.includes(dosen)) &&
                     item.start < conflictingClass.end && 
                     item.end > conflictingClass.start)
                )
        );
    
        if (conflictingItems.length > 0) {
            const conflictDetails = conflictingItems.map((item, idx) => 
                `(${idx + 1}) ${item.kelas}`
            ).join('\n');
            
            alert(`Kelas ini memiliki konflik dengan:\n${conflictDetails}`);
        } else {
            alert("Tidak ditemukan konflik tambahan.");
        }
    };

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

    const toggleDetailsVisibility = () => {
        setShowDetails((prevState) => !prevState);
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
            <div className="statistics" style={{ textAlign: 'center', margin: '20px 0' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>
                            Total Data: <span style={{ color: '#007bff' }}>{totalData}</span>
                        </Typography>
                        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333'}}>
                            Total Konflik: <span style={{ color: totalConflicts > 0 ? '#d32f2f' : '#4caf50' }}>{totalConflicts}</span>
                        </Typography>
                    </div>
                    <div className="day-select">
                        <Button 
                                variant="contained" 
                                onClick={toggleDetailsVisibility} 
                                style={{ marginRight: '10px' }}
                                startIcon={showDetails ? <VisibilityOff /> : <Visibility />} // Ikon mata
                            >
                               Dosen
                            </Button>
                            <label htmlFor="day">Pilih Hari:</label>
                            <select id="day" value={selectedDay} onChange={handleDayChange}>
                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
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
                                                            <div
                                                                className={`schedule-matkul ${classInSlot.isConflict ? 'conflict' : ''}`}
                                                                onClick={() => {
                                                                    if (classInSlot.isConflict) {
                                                                        handleConflictClick(classInSlot);
                                                                    }
                                                                }}
                                                            >
                                                                {classInSlot.kelas}&nbsp;
                                                                <br />
                                                                <br />
                                                                {showDetails && classInSlot.dosen.map((dosen, idx) => (
                                                                    <React.Fragment key={idx}>
                                                                        <div className='dosen-left'>
                                                                        {idx + 1}.  {dosen}
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

