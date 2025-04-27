import React, { useState, useEffect } from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    NavLink,
    Navigate
} from 'react-router-dom';

import api from './services/api';
import './services/auth'; // гарантируем инициализацию токена при старте

import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Cat from './pages/Cat';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Подставляем токен в заголовок каждого запроса
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Обработчик 401: очищаем токен и редиректим на /login
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            toast.error('Требуется авторизация. Пожалуйста, войдите снова.');
            window.location.href = '/#/login';
        }
        return Promise.reject(error);
    }
);

// Защищённый маршрут
function PrivateRoute({ children }) {
    return localStorage.getItem('token')
        ? children
        : <Navigate to="/login" replace />;
}

const App = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <Router>
            <div className="container">
                <nav className="navbar">
                    <NavLink to="/" className="nav-link">Главная</NavLink>
                    <NavLink to="/about" className="nav-link">О нас</NavLink>
                    <NavLink to="/cat" className="nav-link">Котик</NavLink>
                    <NavLink to="/login" className="nav-link">Войти</NavLink>
                    <NavLink to="/register" className="nav-link">Регистрация</NavLink>
                </nav>

                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/"
                        element={<PrivateRoute><Dashboard /></PrivateRoute>}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/cat" element={<Cat />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <ToastContainer />
            </div>
        </Router>
    );
};

export default App;
