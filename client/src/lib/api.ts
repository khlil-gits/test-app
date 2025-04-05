import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const api = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  },

  // Get a specific task
  getTask: async (id: number): Promise<Task> => {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (task: CreateTaskDto): Promise<Task> => {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id: number, task: UpdateTaskDto): Promise<Task> => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, task);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/tasks/${id}`);
  },
};
