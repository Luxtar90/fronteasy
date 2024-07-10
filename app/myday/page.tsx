// app/myday/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faHome, faCheckCircle, faCalendarAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../../src/axiosConfig';
import { EventInput } from '@fullcalendar/core';
import Layout from '../components/layout'; // Importa el Layout
import './myday.css';

const MyDayPage: React.FC = () => {
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
        };
      });
      setTasks(events);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleToggleComplete = async (task: EventInput) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/tasks/${task.id}/status`, { completed: !task.completed }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTask = response.data;
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask._id ? { ...t, completed: updatedTask.completed } : t))
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Layout>
      <div className="myday-container">
        <div className="content">
          <div className="header">
            <input type="text" placeholder="Buscar" className="search-bar" />
            <div className="user-icons">
              {/* Añadir iconos de usuario aquí */}
            </div>
          </div>
          <div className="task-list">
            <h2>Mi día ({tasks.filter(task => !task.completed).length})</h2>
            <div className="task-list-items">
              {tasks.filter(task => !task.completed).map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Inicio: {task.start ? new Date(task.start as string).toLocaleString() : 'No definido'}</p>
                    <p>Fin: {task.end ? new Date(task.end as string).toLocaleString() : 'No definido'}</p>
                  </div>
                  <div className="task-status">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyDayPage;
