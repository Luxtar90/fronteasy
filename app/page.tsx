'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './homepage.css'; // Asegúrate de que el archivo CSS exista en esta ubicación
import axios from 'axios'; // Asegúrate de tener axios configurado correctamente

const HomePage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data'); // Cambia esto por la URL de tu API
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const goToPage = (path: string) => {
    router.push(path);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="homepage-container">
      <header className="header">
        <div className="logo-container">
          <img src="/logo.png" alt="TaskEase Logo" className="logo" />
          <span className="logo-text">TaskEase</span>
        </div>
        <nav className="nav">
          <button className="nav-button" onClick={() => goToPage('/login')}>Contactar a ventas</button>
          <button className="nav-button primary" onClick={() => goToPage('/register')}>Ir a mi cuenta</button>
        </nav>
      </header>
      <div className="content">
        <h1>Mantente organizado y eficiente con una plataforma robusta de gestión de tareas</h1>
        <p>Planifica, gestiona y monitorea todas las tareas de tu equipo en un solo software flexible. Elige qué te gustaría gestionar.</p>
        <div className="features">
          <span>✔️ Gestión de tareas</span>
          <span>✔️ Pendientes</span>
          <span>✔️ Herramientas de colaboración</span>
          <span>✔️ Seguimiento del tiempo</span>
          <span>✔️ Automatización de tareas</span>
          <span>✔️ Seguimiento de tareas</span>
          <span>✔️ Gantt y cronograma</span>
          <span>✔️ Planificación de tareas</span>
          <span>✔️ Gestión de tareas recurrentes</span>
        </div>
        <button className="cta-button" onClick={() => goToPage('/register')}>Empezar ahora</button>
        <p className="cta-note">Gratis para siempre. No se necesita tarjeta de crédito.</p>
      </div>
      <footer className="footer">
        <p>Con la confianza de +225.000 clientes de todo el mundo</p>
        <div className="logos">
          <img src="/path-to-logo1.png" alt="Logo 1" />
          <img src="/path-to-logo2.png" alt="Logo 2" />
          <img src="/path-to-logo3.png" alt="Logo 3" />
          <img src="/path-to-logo4.png" alt="Logo 4" />
          <img src="/path-to-logo5.png" alt="Logo 5" />
          <img src="/path-to-logo6.png" alt="Logo 6" />
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
