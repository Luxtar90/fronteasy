'use client';

import React, { useState } from 'react';
import axios from '../../../src/axiosConfig';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import './resetpassword.css';

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
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
            const response = await axios.post('/auth/reset-password', { token, newPassword });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            setMessage('Error al restablecer la contraseña');
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
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
                    {message && <p className="error-message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
