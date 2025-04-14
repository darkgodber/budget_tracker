import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Cat from './pages/Cat';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Устанавливаем тему и сохраняем в localStorage
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <Router>
            <div className="container">
                {/* Навигация */}
                <nav className="navbar">
                    <NavLink to="/" className="nav-link" activeClassName="active-link">Главная</NavLink>
                    <NavLink to="/about" className="nav-link" activeClassName="active-link">О нас</NavLink>
                    <NavLink to="/cat" className="nav-link" activeClassName="active-link">Котик</NavLink>
                </nav>

                {/* Контент страниц */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/cat" element={<Cat />} />
                </Routes>

                {/* Toast уведомления */}
                <ToastContainer />
            </div>
        </Router>
    );
};

export default App;
