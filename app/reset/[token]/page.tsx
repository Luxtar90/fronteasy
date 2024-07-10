'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import './resetpassword.css';

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { token } = useParams();

    console.log("Token:", token);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, { token, newPassword });
            setMessage(response.data.message);
            setSuccess(true);

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    setMessage('El token es inválido o ya ha sido usado');
                } else if (error.response.status === 404) {
                    setMessage('El token no se encontró');
                } else {
                    setMessage('Error al restablecer la contraseña');
                }
            } else {
                setMessage('Error al restablecer la contraseña');
            }
        }
    };

    return (
        <div className="reset-password-container">
            <div className={`reset-password-box ${success ? 'success' : ''}`}>
                <h2>Restablecer Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Restablecer Contraseña</button>
                    {message && <p className={`message ${success ? 'success' : 'error'}`}>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
