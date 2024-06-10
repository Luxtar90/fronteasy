// app/login.tsx
'use client';

import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import { isAxiosError } from '../../src/utils/axiosUtils'; // Ajusta la ruta según tu estructura
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      setMessage('Login successful!');
    } catch (error) {
      if (isAxiosError(error)) {
        setMessage((error.response?.data as { message: string })?.message || 'Error logging in');
      } else {
        setMessage('Unknown error');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <div className="login-header">
            <img src="/path-to-logo.png" alt="TaskEase Logo" className="logo"/>
            <h2>Inicia Sesión</h2>
          </div>
          <div className="social-login">
            <button className="social-button facebook">F</button>
            <button className="social-button google">G</button>
            <button className="social-button apple">A</button>
          </div>
          <p className="separator">o por vía correo</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Usuario / Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="remember-me">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Recuérdame</label>
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
          {message && <p className="error-message">{message}</p>}
          <p className="register-link">¿Aún no tienes cuenta? <a href="/register">Regístrate</a></p>
        </div>
        <div className="login-right">
          <img src="/path-to-your-image.png" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
