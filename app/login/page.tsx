'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../src/axiosConfig';
import { isAxiosError } from '../../src/utils/axiosUtils';
import './login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      setMessage('Login successful!');
      router.push('/tasks'); // Redirige a la página de tareas
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
            <img src="/logo.png" alt="TaskEase Logo" className="logo" />
            <h2>Inicia Sesión</h2>
          </div>
          <div className="social-login">
            <button className="social-button facebook">
              <img src="/facebook.png" alt="Facebook" />
            </button>
            <button className="social-button google">
              <img src="/google.png" alt="Google" />
            </button>
            <button className="social-button apple">
              <img src="/logotipo-de-apple.png" alt="Apple" />
            </button>
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
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src="/ojo.png"
                alt="Show Password"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="remember-me">
              <div className="remember-me-left">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Recuérdame</label>
              </div>
              <a href="/reset-password" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
          {message && <p className="error-message">{message}</p>}
          <p className="register-link">¿Aún no tienes cuenta? <a href="/register">Regístrate</a></p>
        </div>
        <div className="login-right">
          <img src="/portada.webp" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
