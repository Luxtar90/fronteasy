'use client';

import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Task } from '../../src/types';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './task.css';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup';

const MySwal = withReactContent(Swal);

interface TaskItemProps {
  task: Task;
  onTaskDeleted: (taskId: string) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskDeleted, onTaskUpdated }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = async () => {
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
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/tasks/${task._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onTaskDeleted(task._id);
        toast.success('Tarea eliminada correctamente');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const handleUpdate = (updatedTask: Task) => {
    setShowPopup(false);
    onTaskUpdated(updatedTask);
    toast.success('Tarea actualizada correctamente');
  };

  const handleToggleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/tasks/${task._id}/status`, { completed: !task.completed }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskUpdated(response.data);
      toast.success('Estado de la tarea actualizado');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error al actualizar el estado de la tarea');
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <div className="task-actions">
        <button onClick={handleToggleComplete} className="complete-button">
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
        <button className="edit-button" onClick={() => setShowPopup(true)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="delete-button" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
      {showPopup && <EditTaskPopup task={task} onClose={() => setShowPopup(false)} onUpdate={handleUpdate} />}
    </div>
  );
};

export default TaskItem;
