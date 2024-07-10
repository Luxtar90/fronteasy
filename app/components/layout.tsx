'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faHome, faCheckCircle, faCalendarAlt, faSignOutAlt, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import './layout.css'; // Asegúrate de que esta ruta sea correcta

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="layout-container">
      <div className="header-bar">
        <div className="logo">TaskEase</div>
        <div className="menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} size="2x" />
        </div>
        <div className="logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </div>
      </div>
      <div className={`overlay ${sidebarVisible ? 'visible' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <div className="logo">
          <FontAwesomeIcon icon={faTasks} /> TaskEase
        </div>
        <nav className="nav">
          <a onClick={() => router.push('/myday')} className="nav-item">
            <FontAwesomeIcon icon={faHome} /> Mi día
          </a>
          <a onClick={() => router.push('/tasks')} className="nav-item">
            <FontAwesomeIcon icon={faTasks} /> Tareas
          </a>
          <a onClick={() => router.push('/completed')} className="nav-item">
            <FontAwesomeIcon icon={faCheckCircle} /> Completadas
          </a>
          <a onClick={() => router.push('/calendar')} className="nav-item">
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
          </a>
          <a onClick={() => router.push('/profile')} className="nav-item">
            <FontAwesomeIcon icon={faUser} /> Perfil
          </a>
        </nav>
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
