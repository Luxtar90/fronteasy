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
          <div className="profile-row">
            <div className="profile-field">
              <label>Nombres:</label>
              <input type="text" value={profile.firstName} readOnly />
              <button onClick={() => setEditingField('firstName')}>Editar</button>
            </div>
            <div className="profile-field">
              <label>Apellidos:</label>
              <input type="text" value={profile.lastName} readOnly />
              <button onClick={() => setEditingField('lastName')}>Editar</button>
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-field">
              <label>Teléfono:</label>
              <input type="text" value={profile.phone} readOnly />
              <button onClick={() => setEditingField('phone')}>Editar</button>
            </div>
            <div className="profile-field">
              <label>Usuario:</label>
              <input type="text" value={profile.username} readOnly />
              <button onClick={() => setEditingField('username')}>Editar</button>
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-field">
              <label>Correo Electrónico:</label>
              <input type="text" value={profile.email} readOnly />
              <button onClick={() => setEditingField('email')}>Editar</button>
            </div>
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
        <div className="button-container">
          <button className="save-btn">Guardar cambios</button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
