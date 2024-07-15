// app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from '../../src/axiosConfig';
import Layout from '../components/layout'; // Ajusta la ruta si es necesario
import EditModal from '../components/EditModal';
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
  const [error, setError] = useState(false);
  const [editingField, setEditingField] = useState<keyof typeof profile | null>(null);

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
        console.error('Error al obtener el perfil:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (updatedValue: string) => {
    try {
      const token = localStorage.getItem('token');
      const updatedProfile = { ...profile, [editingField!]: updatedValue };
      await axios.put('/auth/profile', updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(updatedProfile);
      setMessage('Perfil actualizado con éxito');
      setError(false);
      setEditingField(null);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setMessage('Error al actualizar el perfil');
      setError(true);
    }
  };

  return (
    <Layout>
      <div className="profile-container">
        <h2>Perfil</h2>
        <div className="profile-info">
          <div className="profile-field">
            <span>Nombres:</span>
            <span>{profile.firstName}</span>
            <button onClick={() => setEditingField('firstName')}>Edita</button>
          </div>
          <div className="profile-field">
            <span>Apellidos:</span>
            <span>{profile.lastName}</span>
            <button onClick={() => setEditingField('lastName')}>Edita</button>
          </div>
          <div className="profile-field">
            <span>Teléfono:</span>
            <span>{profile.phone}</span>
            <button onClick={() => setEditingField('phone')}>Edita</button>
          </div>
          <div className="profile-field">
            <span>Usuario:</span>
            <span>{profile.username}</span>
            <button onClick={() => setEditingField('username')}>Edita</button>
          </div>
          <div className="profile-field">
            <span>Correo Electrónico:</span>
            <span>{profile.email}</span>
            <button onClick={() => setEditingField('email')}>Edita</button>
          </div>
        </div>
        {message && <p className={`message ${error ? 'error' : 'success'}`}>{message}</p>}
        {editingField && (
          <EditModal
            field={editingField}
            currentValue={profile[editingField]}
            onSave={handleUpdate}
            onCancel={() => setEditingField(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
