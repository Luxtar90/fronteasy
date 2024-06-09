'use client';
import React, { useEffect, useState } from 'react';
import axios from '../../src/axiosConfig'; // Ajusta la ruta según tu estructura
import TaskItem from './TaskItem';

interface Task {
  _id: string;
  title: string;
  description: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
