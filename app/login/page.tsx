'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../src/axiosConfig';
import { isAxiosError } from '../../src/utils/axiosUtils';
import './login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmails = JSON.parse(localStorage.getItem('emails') || '[]');
    setEmailSuggestions(storedEmails);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/login', { email, password });
      setMessage('Login successful!');
      localStorage.setItem('token', response.data.token);

      const storedEmails = JSON.parse(localStorage.getItem('emails') || '[]');
      if (!storedEmails.includes(email)) {
        storedEmails.push(email);
        localStorage.setItem('emails', JSON.stringify(storedEmails));
      }

      // Redirigir y recargar la página de tareas
      router.replace('/tasks');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setIsLoading(false);
      if (isAxiosError(error)) {
        setMessage((error.response?.data as { message: string })?.message || 'Error logging in');
      } else {
        setMessage('Unknown error');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/facebook`;
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="pencil">
            <div className="pencil__ball-point"></div>
            <div className="pencil__cap"></div>
            <div className="pencil__cap-base"></div>
            <div className="pencil__middle"></div>
            <div className="pencil__eraser"></div>
          </div>
          <div className="line"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <div className="login-header">
            <img src="/logo.png" alt="TaskEase Logo" className="logo" />
            <h2>Inicia Sesión</h2>
          </div>
          <div className="social-login">
            <button className="social-button facebook" onClick={handleFacebookLogin}>
              <img src="/facebook.png" alt="Facebook" />
            </button>
            <button className="social-button google" onClick={handleGoogleLogin}>
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
              placeholder="Correo"
              value={email}
              onChange={handleEmailChange}
              list="email-suggestions"
              required
            />
            <datalist id="email-suggestions">
              {emailSuggestions.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>
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
              <a onClick={() => router.push('/reset-password')} className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
          {message && <p className="error-message">{message}</p>}
          <p className="register-link">¿Aún no tienes cuenta? <a onClick={() => router.push('/register')}>Regístrate</a></p>
        </div>
        <div className="login-right">
          <img src="/portada.webp" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
