// app/EditTaskPopup/EditTaskPopup.tsx
'use client';

import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import './EditTaskPopup.css'; // Asegúrate de que el archivo CSS exista
import { Task } from '../../src/types';

interface EditTaskPopupProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({ task, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [start, setStart] = useState(task.start ? new Date(task.start).toISOString().slice(0, 16) : '');
  const [end, setEnd] = useState(task.end ? new Date(task.end).toISOString().slice(0, 16) : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/tasks/${task._id}`, { title, description, start, end }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="edit-task-popup">
      <div className="popup-content">
        <h2>Editar Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Inicio</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fin</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Actualizar</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPopup;
