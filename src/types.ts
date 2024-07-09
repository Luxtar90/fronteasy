// src/types.ts
export interface Task {
  _id: string;
  title: string;
  description: string;
  start?: string;  // Asegúrate de que estos campos estén presentes
  end?: string;    // Asegúrate de que estos campos estén presentes
  completed: boolean;
}
