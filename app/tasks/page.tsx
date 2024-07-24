'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const fetchTasks = useCallback(async () => {
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
        localStorage.removeItem('token'); // Remove the invalid token
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, pathname]);

  const handleTaskAdded = useCallback(() => {
    fetchTasks();
    setShowModal(false);
  }, [fetchTasks]);

  const handleTaskDeleted = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    fetchTasks(); // Fetch tasks to update calendar after deletion
  }, [fetchTasks]);

  const handleTaskUpdated = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    fetchTasks(); // Fetch tasks to update calendar after update
  }, [fetchTasks]);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  const handleOverlayClick = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    router.push('/login');
  }, [router]);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  if (showLoadingScreen) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="pencil">
            <div className="pencil__ball-point"></div>
            <div className="pencil__cap"></div>
            <div className="pencil__cap-base"></div>
            <div className="pencil__middle"></div>
            <div className="pencil__eraser"></div>
          </div>
          <div className="line"></div>
        </div>
        <p>Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div className="taskpage-container">
      <header className="header-bar">
        <div className="menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} size="2x" />
        </div>
        <div className="logo">TaskEase</div>
        <div className="logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
        </div>
      </header>
      <div className={`overlay ${sidebarVisible ? 'visible' : ''}`} onClick={handleOverlayClick}></div>
      <aside className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <div className="sidebar-logo">
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
      </aside>
      <main className="content">
        <div className="task-list-container">
          <div className="section-header">
            <FontAwesomeIcon icon={faTasks} />
            <h3>Tareas</h3>
          </div>
          <TaskList tasks={tasks.filter(task => !task.completed)} onTaskDeleted={handleTaskDeleted} onTaskUpdated={handleTaskUpdated} />
        </div>
        <div className="calendar-container">
          <div className="section-header">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <h3>Calendario</h3>
          </div>
          <CalendarComponent tasks={tasks.filter(task => !task.completed).map(task => ({
            id: task._id,
            title: `${task.title} (${task.completionPercentage || 0}%)`,
            start: task.start,
            end: task.end,
            description: task.description,
            color: task.color
          }))} />
        </div>
      </main>
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
