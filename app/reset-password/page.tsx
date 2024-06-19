'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../src/axiosConfig';
import { isAxiosError } from '../../src/utils/axiosUtils';
import './resetPassword.css';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/reset-password-request', { email });
      setMessage(response.data.message);
      // Navegar a otra página si es necesario
      router.push('/login');
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
        <p className="login-link">¿Aún no tienes cuenta? <a onClick={() => { router.push('/register'); setTimeout(() => { window.location.reload(); }, 500); }}>Regístrate</a></p>
      </div>
    </div>
  );
};

export default ResetPassword;
