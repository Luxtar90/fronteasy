// app/tasks/TaskForm.tsx
'use client';

import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import './taskform.css';

const TaskForm: React.FC<{ onTaskAdded: () => void }> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/tasks',
        { title, description, start: startDate, end: endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onTaskAdded();
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="date-inputs">
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Añadir Tarea</button>
    </form>
  );
};

export default TaskForm;
