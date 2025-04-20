// src/components/Attendance.js
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './Attendance.css';

const Attendance = () => {
    const [checkIns, setCheckIns] = useState([]);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const webcamRef = useRef(null);

    const handleCheckIn = () => {
        if (new Date().getDay() === 0 || new Date().getDay() === 6) {
            alert("Tidak bisa check-in pada Sabtu/Minggu");
            return;
        }
        
        setIsCheckingIn(true);
    };

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const now = new Date();
    
        // Mengambil lokasi pengguna
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
    
            // Mengubah ukuran gambar
            const resizedImage = await resizeImage(imageSrc, 640, 480); // Ubah ke dimensi yang diinginkan
    
            const checkInData = {
                staff_id: 1, // Ganti dengan ID staff yang sesuai
                check_in_time: now.toISOString(),
                image_url: resizedImage,
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
                location: {
                    latitude: latitude,
                    longitude: longitude
                }
            };
    
            // Kirim data ke API
            try {
                const response = await axios.post('http://localhost:5000/checkin', checkInData);
                console.log(response.data);
            } catch (error) {
                console.error('Error checking in:', error);
            }
    
            setCheckIns([...checkIns, checkInData]);
            setIsCheckingIn(false);
        }, (error) => {
            console.error('Error getting location:', error);
        });
    };
    
    // Fungsi untuk mengubah ukuran gambar
    const resizeImage = (imageSrc, width, height) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
    
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8)); // Mengubah ke format JPEG dengan kualitas 80%
            };
        });
    };

    const handleCheckOut = async (id) => {
        const now = new Date();
        const checkOutData = {
            id: id,
            check_out_time: now.toISOString(),
        };
    
        try {
            const response = await axios.post('http://localhost:5000/checkout', checkOutData);
            console.log(response.data);
        } catch (error) {
            console.error('Error checking out:', error);
        }
    };

    const handleExport = () => {
        const maxLength = 32000; // Batas maksimum panjang teks
        const processedCheckIns = checkIns.map(item => ({
            ...item,
            image_url: item.image_url.length > maxLength ? item.image_url.substring(0, maxLength) : item.image_url
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(processedCheckIns);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi');
        XLSX.writeFile(workbook, 'absensi.xlsx');
    };

    const totalWorkedTime = () => {
        let total = 0;
        checkIns.forEach((checkIn, index) => {
            if (checkIn && checkIns[index + 1]) {
                const checkInTime = new Date(checkIn.check_in_time);
                const checkOutTime = new Date(checkIns[index + 1].check_out_time); // Pastikan check_out_time ada
                total += (checkOutTime - checkInTime) / 60000; // in minutes
            }
        });
        return total;
    };

    return (
        <div className="attendance-container">
            <h2>Absensi Staff</h2>
            <div className="buttons-container">
                <button className="checkin-button" onClick={handleCheckIn}>Check In</button>
                <button className="checkout-button" onClick={() => handleCheckOut(checkIns[0]?.id)}>Check Out</button>
            </div>
            {isCheckingIn && (
                <div className="checkin-camera">
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                    <button className="capture-button" onClick={capture}>Ambil Foto</button>
                </div>
            )}
            <h3>Total Worked Time: {totalWorkedTime()} minutes</h3>
            <button className="export-button" onClick={handleExport}>Export to CSV/XLSX</button>
            <div className="checkin-list">
                {checkIns.map((checkIn, index) => (
                    <div className="checkin-item" key={index}>
                        <img className="checkin-image" src={checkIn.image_url} alt={`Check-in at ${checkIn.time}`} />
                        <p>{checkIn.date} {checkIn.time}</p>
                        <button className="checkout-item-button" onClick={() => handleCheckOut(checkIn.id)}>Check Out</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Attendance;
