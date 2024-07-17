import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import { Task } from '../../src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './tasklist.css';

const MySwal = withReactContent(Swal);

const TaskList: React.FC<{
  tasks: Task[];
  onTaskDeleted: (taskId: string) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}> = ({ tasks, onTaskDeleted, onTaskUpdated }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const handleToggleCompletion = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/tasks/${taskId}/toggle-completion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      );
      onTaskUpdated(updatedTasks.find(task => task._id === taskId)!);
      MySwal.fire('Completada', '¡Bien hecho! Has logrado completar la tarea. Se guardará en completadas por si la necesitas.', 'success');
    } catch (error) {
      console.error('Error toggling task completion:', error);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
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
      setLoadingTaskId(taskId);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onTaskDeleted(taskId);
        MySwal.fire('Eliminada', 'La tarea ha sido eliminada.', 'success');
      } catch (error) {
        console.error('Error deleting task:', error);
        MySwal.fire('Error', 'Hubo un problema al eliminar la tarea.', 'error');
      } finally {
        setLoadingTaskId(null);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onTaskUpdated(updatedTask);
    setEditingTask(null);
    MySwal.fire('Actualizada', 'La tarea se ha actualizado correctamente.', 'success');
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-content">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Inicio: {task.start ? new Date(task.start).toLocaleString() : 'No definido'}</p>
            <p>Fin: {task.end ? new Date(task.end).toLocaleString() : 'No definido'}</p>
          </div>
          <div className="task-actions">
            <button 
              onClick={() => handleToggleCompletion(task._id)} 
              disabled={loadingTaskId === task._id}
              className={loadingTaskId === task._id ? 'loading' : ''}
            >
              {loadingTaskId === task._id ? <div className="spinner"></div> : <FontAwesomeIcon icon={faCheckCircle} />}
            </button>
            <button 
              onClick={() => handleEditTask(task)} 
              disabled={loadingTaskId === task._id}
              className={loadingTaskId === task._id ? 'loading' : ''}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button 
              onClick={() => handleDeleteTask(task._id)} 
              disabled={loadingTaskId === task._id}
              className={loadingTaskId === task._id ? 'loading' : ''}
            >
              {loadingTaskId === task._id ? <div className="spinner"></div> : <FontAwesomeIcon icon={faTrashAlt} />}
            </button>
          </div>
        </div>
      ))}
      {editingTask && (
        <EditTaskPopup
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default TaskList;
