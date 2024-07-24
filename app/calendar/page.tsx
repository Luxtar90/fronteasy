'use client';

import React, { useState, useEffect } from 'react';
import CalendarComponent from '../tasks/CalendarComponent'; // Ajuste de la ruta de importación
import { useRouter } from 'next/navigation';
import axios from '../../src/axiosConfig';
import { EventInput } from '@fullcalendar/core';
import Layout from '../components/layout'; // Asegúrate de que esta ruta sea correcta
import '../tasks/CalendarComponent.css';

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<EventInput[]>([]);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const events = response.data.map((task: any) => ({
        id: task._id,
        title: `${task.title} (${task.completionPercentage || 0}%)`,
        start: task.start,
        end: task.end,
        description: task.description,
        completed: task.completed,
        color: task.color, // Añadir color aquí
      }));
      setTasks(events);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Layout>
      <div className="content">
        <CalendarComponent tasks={tasks} />
      </div>
    </Layout>
  );
};

export default CalendarPage;
