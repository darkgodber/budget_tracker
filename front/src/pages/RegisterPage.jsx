import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Пароли не совпадают');
      return;
    }
    try {
      await register({ email, password });
      toast.success('Регистрация успешна! Теперь войдите.');
      navigate('/login');
      } catch (err) {
          const errors = err.response?.data;
          if (Array.isArray(errors)) {
              errors.forEach(e => toast.error(e.description));
          } else {
              toast.error('Неизвестная ошибка регистрации');
          }
      }

  };

  return (
    <div className="auth-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Пароль"
            minLength={6}
          />
        </div>
        <div>
          <label>Повтор пароля:</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            placeholder="Повторите пароль"
          />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default RegisterPage;