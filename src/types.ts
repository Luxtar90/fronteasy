// src/types.ts
export interface Task {
  _id: string;
  title: string;
  description: string;
  start?: string;
  end?: string;
  completed: boolean;
  completionPercentage?: number; // Añadir esta línea
  color?: string; // Añadir esta línea
}
