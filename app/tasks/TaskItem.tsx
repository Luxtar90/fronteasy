'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface Task {
  _id: string;
  title: string;
  description: string;
  start: string;
  end: string;
}

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <button className="edit-button">
        <FontAwesomeIcon icon={faEdit} />
      </button>
    </div>
  );
};

export default TaskItem;
