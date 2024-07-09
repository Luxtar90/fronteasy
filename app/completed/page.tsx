// app/completed/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faHome, faCheckCircle, faCalendarAlt, faPlus, faUndo, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { EventInput } from '@fullcalendar/core';
import './completedTasks.css';

const CompletedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<EventInput[]>([]);
  const router = useRouter();

  const isValidDate = (date: any): boolean => {
    return !isNaN(Date.parse(date));
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const events = response.data.map((task: any) => {
        const start = isValidDate(task.start) ? new Date(task.start) : null;
        const end = isValidDate(task.end) ? new Date(task.end) : null;
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

  const handleUndoTask = async (taskId: string | undefined) => {
    if (!taskId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/tasks/${taskId}/toggle-completion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error undoing task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string | undefined) => {
    if (!taskId) return;
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.');
    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="completedtasks-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="TaskEase Logo" />
        </div>
        <nav className="nav-vertical">
          <a onClick={() => router.push('/myday')} className="nav-item">
            <FontAwesomeIcon icon={faHome} /> Mi día
          </a>
          <a onClick={() => router.push('/tasks')} className="nav-item">
            <FontAwesomeIcon icon={faTasks} /> Tareas
          </a>
          <a onClick={() => router.push('/completed')} className="nav-item active">
            <FontAwesomeIcon icon={faCheckCircle} /> Completadas
          </a>
          <a onClick={() => router.push('/calendar')} className="nav-item">
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
          <h2>Completadas ({tasks.filter(task => task.completed).length})</h2>
          <div className="task-list-items">
            {tasks.filter(task => task.completed).map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Inicio: {task.start ? new Date(task.start as string).toLocaleString() : 'No definido'}</p>
                  <p>Fin: {task.end ? new Date(task.end as string).toLocaleString() : 'No definido'}</p>
                </div>
                <div className="task-actions">
                  {task.id && (
                    <>
                      <button onClick={() => handleUndoTask(task.id)}>
                        <FontAwesomeIcon icon={faUndo} /> Devolver
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                      </button>
                    </>
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

export default CompletedTasksPage;
