'use client';
import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import './register.css';

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return alert('Passwords do not match');
        }

        try {
            const response = await axios.post('/auth/register', {
                firstName,
                lastName,
                phone,
                username,
                email,
                password,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error during registration');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-left">
                    <div className="register-header">
                        <img src="/logo.png" alt="TaskEase Logo" className="logo" />
                        <h2>Regístrate</h2>
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
                        <div className="input-group">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Nombres"
                                required
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Apellidos"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Teléfono"
                                required
                            />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Usuario"
                                required
                            />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo"
                            required
                        />
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                required
                            />
                            <img
                                src="/ojo.png"
                                alt="Show Password"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        <div className="password-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmar Contraseña"
                                required
                            />
                            <img
                                src="/ojo.png"
                                alt="Show Password"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>
                        <div className="button-container">
                            <div className="remember-me">
                                <input type="checkbox" id="rememberMe" />
                                <label htmlFor="rememberMe">Recuérdame</label>
                            </div>
                            <button type="submit">Registrarse</button>
                        </div>
                    </form>
                    {message && <p className="error-message">{message}</p>}
                    <p className="register-link">
                        ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
                    </p>
                </div>
                <div className="register-right">
                    <img src="/portada.webp" alt="Register Illustration" />
                </div>
            </div>
        </div>
    );
};

export default Register;
