'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { EventInput } from '@fullcalendar/core';
import Layout from '../components/layout'; // Asegúrate de que esta ruta sea correcta
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './completedTasks.css';

const MySwal = withReactContent(Swal);

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
          completionPercentage: task.completionPercentage, // Añadir completionPercentage
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

    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta tarea será marcada como incompleta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, devolver',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary',
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/tasks/${taskId}/toggle-completion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchTasks();
      MySwal.fire('Devuelta', 'La tarea ha sido marcada como incompleta.', 'success');
    } catch (error) {
      console.error('Error undoing task:', error);
      MySwal.fire('Error', 'Hubo un problema al devolver la tarea.', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string | undefined) => {
    if (!taskId) return;

    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminada, no se puede recuperar la tarea.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary',
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTasks();
      MySwal.fire('Eliminada', 'La tarea ha sido eliminada.', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      MySwal.fire('Error', 'Hubo un problema al eliminar la tarea.', 'error');
    }
  };

  return (
    <Layout>
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
                  <p>Progreso: {task.completionPercentage}%</p> {/* Mostrar porcentaje de completitud */}
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
    </Layout>
  );
};

export default CompletedTasksPage;
