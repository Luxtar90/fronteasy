// app/tasks/TaskList.tsx
'use client';

import React from 'react';
import TaskItem from './TaskItem';
import './task.css';
import { Task } from '../../src/types'; // Importa el tipo Task

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: (taskId: string) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskDeleted, onTaskUpdated }) => {
  return (
    <div className="task-list">
      <h2>Tareas</h2>
      <div className="task-list-scroll">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onTaskDeleted={onTaskDeleted} onTaskUpdated={onTaskUpdated} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
