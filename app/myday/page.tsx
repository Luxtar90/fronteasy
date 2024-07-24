'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { EventInput } from '@fullcalendar/core';
import Layout from '../components/layout'; // Importa el Layout
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './myday.css';

const MySwal = withReactContent(Swal);

const MyDayPage: React.FC = () => {
  const [tasks, setTasks] = useState<EventInput[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
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
          title: task.title ?? '', // Usar un string vacío como valor por defecto
          start,
          end,
          description: task.description ?? '', // Usar un string vacío como valor por defecto
          completed: task.completed,
          completionPercentage: task.completionPercentage ?? 0, // Usar 0 como valor por defecto
          previousCompletionPercentage: task.previousCompletionPercentage ?? task.completionPercentage ?? 0, // Usar completionPercentage como valor por defecto
        };
      });
      setTasks(events);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleToggleComplete = async (task: EventInput) => {
    if (!task.id) return;

    setLoadingTaskId(task.id);

    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas marcar la tarea "${task.title}" como completada?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) {
      setLoadingTaskId(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/tasks/${task.id}/toggle-completion`, {
        completed: !task.completed,
        completionPercentage: task.completed ? task.previousCompletionPercentage : 100,
        previousCompletionPercentage: task.completionPercentage,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTask = response.data.task;
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask._id ? { ...t, completed: updatedTask.completed, completionPercentage: updatedTask.completionPercentage, previousCompletionPercentage: updatedTask.previousCompletionPercentage } : t))
      );
      MySwal.fire({
        title: 'Completada',
        text: 'La tarea ha sido marcada como completada.',
        icon: 'success',
        customClass: {
          confirmButton: 'swal2-confirm',
        },
        buttonsStyling: false,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el estado de la tarea.',
        icon: 'error',
        customClass: {
          confirmButton: 'swal2-confirm',
        },
        buttonsStyling: false,
      });
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task =>
    (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="myday-container">
        <div className="content">
          <div className="header">
            <input
              type="text"
              placeholder="Buscar"
              className="search-bar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="user-icons">
              {/* Añadir iconos de usuario aquí */}
            </div>
          </div>
          <div className="task-list">
            <h2>Mi día ({filteredTasks.filter(task => !task.completed).length})</h2>
            <div className="task-list-items">
              {filteredTasks.filter(task => !task.completed).map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Inicio: {task.start ? new Date(task.start as string).toLocaleString() : 'No definido'}</p>
                    <p>Fin: {task.end ? new Date(task.end as string).toLocaleString() : 'No definido'}</p>
                    <p>Progreso: {task.completionPercentage}%</p>
                  </div>
                  <div className="task-status">
                    <button
                      className={`complete-btn ${task.completed ? 'completed' : ''}`}
                      onClick={() => handleToggleComplete(task)}
                      disabled={loadingTaskId === task.id}
                    >
                      {loadingTaskId === task.id ? <div className="spinner"></div> : <FontAwesomeIcon icon={faCheckCircle} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyDayPage;
