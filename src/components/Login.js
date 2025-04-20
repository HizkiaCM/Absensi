import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Pastikan ini ada
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState(''); // Untuk menampilkan pesan error
    const navigate = useNavigate(); // Menggunakan useNavigate

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset pesan error sebelumnya
        setErrorMessage('');

        axios.post('http://localhost:5000/api/auth/login', formData)
            .then(response => {
                alert(response.data.message);
                // Simpan token di localStorage jika berhasil login
                localStorage.setItem('token', response.data.token);

                // Redirect ke halaman Attendance (atau halaman lainnya) setelah login berhasil
                navigate('/attendance');
            })
            .catch(error => {
                // Jika ada error dari server, tampilkan pesan error
                setErrorMessage(error.response?.data?.error || 'Login gagal, coba lagi!');
            });
    };
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        className="form-control"
                    />
                </div>
                <button type="submit" className="login-button">Log In</button>
            </form>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <div className="register-link">
                <p>Belum punya akun? <Link to="/register">Register sekarang!</Link></p>
            </div>
        </div>
    );
};

export default Login;
