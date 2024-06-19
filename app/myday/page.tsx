'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faHome, faCheckCircle, faCalendarAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { EventInput } from '@fullcalendar/core';
import './myday.css';

const MyDayPage: React.FC = () => {
  const [tasks, setTasks] = useState<EventInput[]>([]);

  const isValidDate = (date: any): boolean => {
    return !isNaN(Date.parse(date));
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks'); // Ajusta la URL según tu API
      const events = response.data.map((task: any) => {
        const start = isValidDate(task.start) ? new Date(task.start) : new Date();
        const end = isValidDate(task.end) ? new Date(task.end) : new Date();
        return {
          id: task._id,
          title: task.title,
          start,
          end,
          description: task.description,
          completed: task.completed,
        };
      });
      setTasks(events);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="myday-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="TaskEase Logo" />
        </div>
        <nav className="nav-vertical">
          <a href="/" className="nav-item active">
            <FontAwesomeIcon icon={faHome} /> Mi día
          </a>
          <a href="/tasks" className="nav-item">
            <FontAwesomeIcon icon={faTasks} /> Tareas
          </a>
          <a href="/completed" className="nav-item">
            <FontAwesomeIcon icon={faCheckCircle} /> Completadas
          </a>
          <a href="/calendar" className="nav-item">
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
          </a>
        </nav>
        <button className="add-task-button">
          <FontAwesomeIcon icon={faPlus} /> Añadir Tarea
        </button>
      </div>
      <div className="content">
        <div className="header">
          <input type="text" placeholder="Buscar" className="search-bar" />
          <div className="user-icons">
            {/* Añadir iconos de usuario aquí */}
          </div>
        </div>
        <div className="task-list">
          <h2>Mi día ({tasks.length})</h2>
          <div className="task-list-items">
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="task-status">
                  {task.completed ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="completed" />
                  ) : (
                    <input type="checkbox" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDayPage;
