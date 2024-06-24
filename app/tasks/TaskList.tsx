// app/tasks/TaskList.tsx
'use client';

import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import { Task } from '../../src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup';
import './tasklist.css';

const TaskList: React.FC<{
  tasks: Task[];
  onTaskDeleted: (taskId: string) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}> = ({ tasks, onTaskDeleted, onTaskUpdated }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleToggleCompletion = async (taskId: string) => {
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
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.')) {
      const token = localStorage.getItem('token');
      await axios.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskDeleted(taskId);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onTaskUpdated(updatedTask);
    setEditingTask(null);
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
            <button onClick={() => handleToggleCompletion(task._id)}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
            <button onClick={() => handleEditTask(task)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => handleDeleteTask(task._id)}>
              <FontAwesomeIcon icon={faTrashAlt} />
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
