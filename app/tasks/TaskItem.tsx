import React, { useState, useEffect } from 'react';
import axios from '../../src/axiosConfig';
import { Task } from '../../src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './taskitem.css';

const MySwal = withReactContent(Swal);

const TaskItem: React.FC<{
  task: Task;
  onTaskDeleted: (taskId: string) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}> = ({ task, onTaskDeleted, onTaskUpdated }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [editingTask]);

  const handleToggleCompletion = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/tasks/${task._id}/toggle-completion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onTaskUpdated(response.data);
      MySwal.fire('Completada', '¡Bien hecho! Has logrado completar la tarea. Se guardará en completadas por si la necesitas.', 'success');
    } catch (error) {
      console.error('Error toggling task completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
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

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/tasks/${task._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onTaskDeleted(task._id);
        MySwal.fire('Eliminada', 'La tarea ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error deleting task:', error);
        MySwal.fire('Error', 'Hubo un problema al eliminar la tarea.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTask = () => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onTaskUpdated(updatedTask);
    setEditingTask(null);
    MySwal.fire('Actualizada', 'La tarea se ha actualizado correctamente.', 'success');
  };

  return (
    <>
      <div className={`task-item ${task.completed ? 'completed' : ''}`}>
        <div className="task-content">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Inicio: {task.start ? new Date(task.start).toLocaleString() : 'No definido'}</p>
          <p>Fin: {task.end ? new Date(task.end).toLocaleString() : 'No definido'}</p>
          <p>Porcentaje de completitud: {task.completionPercentage || 0}%</p> {/* Añadir completionPercentage */}
        </div>
        <div className="task-actions">
          <button 
            onClick={handleToggleCompletion} 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? <div className="spinner"></div> : <FontAwesomeIcon icon={faCheckCircle} />}
          </button>
          <button 
            onClick={handleEditTask} 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button 
            onClick={handleDeleteTask} 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? <div className="spinner"></div> : <FontAwesomeIcon icon={faTrashAlt} />}
          </button>
        </div>
      </div>
      {editingTask && (
        <div className="modal" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <EditTaskPopup
              task={editingTask}
              onClose={() => setEditingTask(null)}
              onUpdate={handleUpdateTask}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;
