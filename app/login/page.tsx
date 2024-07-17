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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <h2 className="title">Inicia Sesión</h2>
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
            <div className="input-field">
              <input
                type="email"
                className="input"
                value={email}
                onChange={handleEmailChange}
                list="email-suggestions"
                required
              />
              <label className="label">Correo</label>
              <datalist id="email-suggestions">
                {emailSuggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
            </div>
            <div className="input-field">
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="label">Contraseña</label>
                <label className="container">
                  <input type="checkbox" onClick={togglePasswordVisibility} />
                  <svg className="eye" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                  </svg>
                  <svg className="eye-slash" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                  </svg>
                </label>
              </div>
            </div>
            <div className="remember-me">
              <div className="remember-me-left">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Recuérdame</label>
              </div>
              <button type="button" className="forgot-password" onClick={() => router.push('/reset-password')}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <button type="submit" className="submit-btn">
              Iniciar Sesión
            </button>
          </form>
          {message && <p className="error-message">{message}</p>}
          <p className="register-link">¿Aún no tienes cuenta? 
            <button type="button" className="register-button" onClick={() => router.push('/register')}>
              Regístrate
            </button>
          </p>
        </div>
        <div className="login-right">
          <img src="/portada.webp" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
