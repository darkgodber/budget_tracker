// src/services/api.js
import axios from 'axios';

const api = axios.create({
	baseURL: '/api', // замените URL на ваш адрес API
    // Если ваш ASP.NET запускается на HTTPS, убедитесь, что сертификаты установлены корректно
});

const token = localStorage.getItem('token');
 if (token) {
   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 }

export default api;
