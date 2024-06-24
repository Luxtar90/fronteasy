// app/tasks/TaskItem.tsx
'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup';
import './task.css';
import { Task } from '../../src/types'; // Importa el tipo Task

interface TaskItemProps {
  task: Task;
  onTaskDeleted: (taskId: string) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskDeleted, onTaskUpdated }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea? Una vez eliminada, no se puede recuperar.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/tasks/${task._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onTaskDeleted(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleUpdate = (updatedTask: Task) => {
    setShowPopup(false);
    onTaskUpdated(updatedTask);
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <button className="edit-button" onClick={() => setShowPopup(true)}>
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button className="delete-button" onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      {showPopup && <EditTaskPopup task={task} onClose={() => setShowPopup(false)} onUpdate={handleUpdate} />}
    </div>
  );
};

export default TaskItem;
