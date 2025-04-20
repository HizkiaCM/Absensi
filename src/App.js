import logo from './logo.svg';
import './App.css';
import React from 'react';
import Attendance from './components/Attendance';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/register" element={<Register />} />{/* Tambahkan rute lain jika diperlukan */}
        </Routes>
    </Router>
  );
}

export default App;
