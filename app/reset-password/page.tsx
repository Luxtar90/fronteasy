'use client';
import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import { isAxiosError } from '../../src/utils/axiosUtils'; // Ajusta la ruta según tu estructura

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
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
