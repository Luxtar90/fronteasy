// TaskList.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from '../../src/axiosConfig';
import TaskItem from './TaskItem';
import './task.css'; // Asegúrate de ajustar el CSS

interface Task {
  _id: string;
  title: string;
  description: string;
  start: string;
  end: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="task-list">
      <h2>Tareas</h2>
      <div className="task-list-scroll">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
