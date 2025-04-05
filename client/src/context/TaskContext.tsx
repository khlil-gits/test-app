import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api, Task, CreateTaskDto, UpdateTaskDto } from "../lib/api";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskDto) => Promise<void>;
  updateTask: (id: number, task: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (task: CreateTaskDto) => {
    setIsLoading(true);
    try {
      const newTask = await api.createTask(task);
      setTasks([...tasks, newTask]);
      setError(null);
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: number, taskUpdate: UpdateTaskDto) => {
    setIsLoading(true);
    try {
      const updatedTask = await api.updateTask(id, taskUpdate);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      setError(null);
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setIsLoading(true);
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
