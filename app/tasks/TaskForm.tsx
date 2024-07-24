import React, { useState } from 'react';
import axios from '../../src/axiosConfig';
import './taskform.css';
import { Task } from '../../src/types';

interface TaskFormProps {
  onTaskAdded: (newTask: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#1abc9c'); // Añadir estado para color
  const [completionPercentage, setCompletionPercentage] = useState(0); // Añadir estado para completionPercentage
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/tasks', { title, description, start, end, color, completionPercentage }, { // Enviar color y completionPercentage al backend
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onTaskAdded(response.data);
      setTitle('');
      setDescription('');
      setStart('');
      setEnd('');
      setColor('#1abc9c'); // Restablecer color
      setCompletionPercentage(0); // Restablecer completionPercentage
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <div className="form-group">
        <label>Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Porcentaje de completitud</label>
        <input
          type="number"
          value={completionPercentage}
          onChange={(e) => setCompletionPercentage(Number(e.target.value))}
          min="0"
          max="100"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? <div className="loader"></div> : 'Añadir Tarea'}
      </button>
    </form>
  );
};

export default TaskForm;
