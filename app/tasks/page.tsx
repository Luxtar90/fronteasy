'use client';

import React, { useEffect, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import CalendarComponent from './CalendarComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faPlus, faHome, faCalendarAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { EventInput } from '@fullcalendar/core';
import { useRouter } from 'next/navigation'; // Importar useRouter para la navegación
import './task.css';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<EventInput[]>([]);
  const router = useRouter(); // Usar useRouter para la navegación

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      const events = response.data.map((task: any) => ({
        id: task._id,
        title: task.title,
        start: task.start,
        end: task.end,
      }));
      setTasks(events);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const goToMyDay = () => {
    router.push('/myday'); // Redirigir a la página MyDay
  };

  return (
    <div className="taskpage-container">
      <div className="sidebar">
        <div className="logo">
          <FontAwesomeIcon icon={faTasks} /> TaskEase
        </div>
        <nav className="nav">
          <a onClick={goToMyDay} className="nav-item">
            <FontAwesomeIcon icon={faHome} /> Mi día
          </a>
          <a href="/tasks" className="nav-item active">
            <FontAwesomeIcon icon={faTasks} /> Tareas
          </a>
          <a href="/completed" className="nav-item">
            <FontAwesomeIcon icon={faCheckCircle} /> Completadas
          </a>
          <a href="/calendar" className="nav-item">
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
          </a>
        </nav>
      </div>
      <div className="content">
        <div className="form-container">
          <h3>
            <FontAwesomeIcon icon={faPlus} /> Añadir Tarea
          </h3>
          <TaskForm />
        </div>
        <div className="task-list-container">
          <h3>
            <FontAwesomeIcon icon={faTasks} /> Tareas
          </h3>
          <TaskList />
        </div>
        <div className="calendar-container">
          <h3>
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
          </h3>
          <CalendarComponent tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
