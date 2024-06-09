'use client';
import React from 'react';

interface Task {
  _id: string;
  title: string;
  description: string;
}

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      {/* Otros campos que quieras mostrar */}
    </div>
  );
};

export default TaskItem;
