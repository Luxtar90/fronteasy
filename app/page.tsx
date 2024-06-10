// app/page.tsx
'use client';

import React from 'react';
import Layout from './layout';
import { useRouter } from 'next/navigation';
import './HomePage.css';

const HomePage: React.FC = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <Layout>
      <div className="homepage-container">
        <header className="header">
          <div className="logo">TaskEase</div>
          <nav className="nav">
            <button className="nav-button">Contactar a ventas</button>
            <button className="nav-button primary" onClick={goToLogin}>Ir a mi cuenta</button>
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
          <button className="cta-button" onClick={goToRegister}>Empezar ahora</button>
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
    </Layout>
  );
};

export default HomePage;
