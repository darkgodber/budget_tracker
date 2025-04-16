// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5192/api', // замените URL на ваш адрес API
    // Если ваш ASP.NET запускается на HTTPS, убедитесь, что сертификаты установлены корректно
});

// Если требуется добавить токен авторизации, можно создать интерсептор
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('token'); // или иную логику получения токена
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default api;
