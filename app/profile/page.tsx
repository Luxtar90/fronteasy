// app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from '../../src/axiosConfig';
import Layout from '../components/layout'; // Asegúrate de que esta ruta sea correcta
import './profile.css';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    username: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/auth/profile', profile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
  };

  return (
    <Layout>
      <div className="profile-container">
        <h2>Perfil</h2>
        {!editing ? (
          <div className="profile-info">
            <p><strong>Nombres:</strong> {profile.firstName}</p>
            <p><strong>Apellidos:</strong> {profile.lastName}</p>
            <p><strong>Teléfono:</strong> {profile.phone}</p>
            <p><strong>Usuario:</strong> {profile.username}</p>
            <p><strong>Correo Electrónico:</strong> {profile.email}</p>
            <button className="btn" onClick={() => setEditing(true)}>Editar Información</button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form">
            <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} placeholder="Nombres" required />
            <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Apellidos" required />
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} placeholder="Teléfono" required />
            <input type="text" name="username" value={profile.username} onChange={handleChange} placeholder="Usuario" required />
            <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Correo Electrónico" required />
            <button type="submit" className="btn">Actualizar Perfil</button>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </Layout>
  );
};

export default ProfilePage;
