// Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Import a CSS file for styling

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        axios.post('http://localhost:5000/api/auth/register', formData)
            .then(response => {
                alert(response.data.message);
                // Redirect or perform any other action after successful registration
            })
            .catch(error => {
                // Check if error.response exists and display the error message
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.error || 'Terjadi kesalahan, coba lagi.');
                } else {
                    setErrorMessage('Terjadi kesalahan, silakan coba lagi.');
                }
            });
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="username"><i className="fas fa-user"></i> Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password"><i className="fas fa-key"></i> Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>

                <button type="submit" className="register-btn">
                    <i className="fas fa-user-plus"></i> Register
                </button>
                
                <p className="login-link">
                    Sudah punya akun? <a href="/login">Login di sini!</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
