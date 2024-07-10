'use client';

import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import CalendarComponent from './CalendarComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faPlus, faHome, faCalendarAlt, faCheckCircle, faUser, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { useRouter, usePathname } from 'next/navigation';
import './task.css';
import { Task } from '../../src/types';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      if (error.response && error.response.status === 401) {
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [pathname]);

  const handleTaskAdded = () => {
    fetchTasks();
    setShowModal(false); 
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleOverlayClick = () => {
    setSidebarVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="taskpage-container">
      <div className="header-bar">
        <div className="logo">TaskEase</div>
        <div className="menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} size="2x" />
        </div>
        <div className="logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </div>
      </div>
      <div className={`overlay ${sidebarVisible ? 'visible' : ''}`} onClick={handleOverlayClick}></div>
      <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <div className="logo">
          <FontAwesomeIcon icon={faTasks} /> TaskEase
        </div>
        <nav className="nav">
          <a onClick={() => router.push('/myday')} className="nav-item">
            <FontAwesomeIcon icon={faHome} /> Mi día
          </a>
          <a href="/tasks" className="nav-item active">
            <FontAwesomeIcon icon={faTasks} /> Tareas
          </a>
          <a href="/completed" className="nav-item">
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
        <div className="task-list-container">
          <h3>
            <FontAwesomeIcon icon={faTasks} /> Tareas
          </h3>
          <TaskList tasks={tasks.filter(task => !task.completed)} onTaskDeleted={handleTaskDeleted} onTaskUpdated={handleTaskUpdated} />
        </div>
        <div className="calendar-container">
          <h3>
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
          </h3>
          <CalendarComponent tasks={tasks} />
        </div>
      </div>
      <button className="floating-button" onClick={openModal}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Añadir Tarea</h3>
              <span className="close" onClick={closeModal}>&times;</span>
            </div>
            <TaskForm onTaskAdded={handleTaskAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
