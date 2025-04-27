import api from './api';

export const register = data => api.post('/auth/register', data);

export const login = async data => {
  const resp = await api.post('/auth/login', data);
  const token = resp.data.token;
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
