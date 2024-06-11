'use client';
import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import { isAxiosError } from '../../src/utils/axiosUtils';
import './resetPassword.css';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/reset-password-request', { email });
      setMessage(response.data.message);
    } catch (error) {
      if (isAxiosError(error)) {
        setMessage((error.response?.data as { message: string })?.message || 'Error sending email');
      } else {
        setMessage('Unknown error');
      }
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <div className="reset-header">
          <img src="/logo.png" alt="TaskEase Logo" className="logo" />
          <h2>Recuperar Contraseña</h2>
          <p>Escribe tu correo registrado y te enviaremos un link de recuperación al mismo</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="login-link">¿Aún no tienes cuenta? <a href="/register">Regístrate</a></p>
      </div>
    </div>
  );
};

export default ResetPassword;
