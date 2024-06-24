// app/tasks/TaskItem.tsx
'use client';

import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Task } from '../../src/types';
import './task.css';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup';

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

  const handleToggleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/tasks/${task._id}/status`, { completed: !task.completed }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskUpdated(response.data);
    } catch (error) {
      console.error('Error updating task status:', error);
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
