'use client';

import React, { useEffect, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import CalendarComponent from './CalendarComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faPlus, faHome, faCalendarAlt, faCheckCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { useRouter } from 'next/navigation';
import './task.css';
import { Task } from '../../src/types';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const reloadTasks = localStorage.getItem('reloadTasks');
    if (reloadTasks) {
      localStorage.removeItem('reloadTasks');
      window.location.reload();
    } else {
      fetchTasks();
    }
  }, []);

  const handleTaskAdded = () => {
    fetchTasks();
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
  };

  return (
    <div className="taskpage-container">
      <div className="sidebar">
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
        <div className="form-container">
          <h3>
            <FontAwesomeIcon icon={faPlus} /> Añadir Tarea
          </h3>
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>
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
    </div>
  );
};

export default TaskPage;
