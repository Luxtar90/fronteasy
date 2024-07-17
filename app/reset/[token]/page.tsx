'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import './resetpassword.css';

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const router = useRouter();
    const { token } = useParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden',
            });
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, { token, newPassword });
            Swal.fire({
                icon: 'success',
                title: 'Contraseña Actualizada',
                text: 'Tu contraseña ha sido actualizada correctamente.',
            });

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error) {
            let message = 'Error al restablecer la contraseña';
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    message = 'El token es inválido o ya ha sido usado';
                } else if (error.response.status === 404) {
                    message = 'El token no se encontró';
                }
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-box">
                <div className="reset-header">
                    <img src="/logo.png" alt="Logo" className="logo" />
                    <h2>Restablecer Contraseña</h2>
                    <p>Ingresa tu nueva contraseña</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input"
                            placeholder="Nueva Contraseña"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="input"
                            placeholder="Confirmar Nueva Contraseña"
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Restablecer Contraseña</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
