import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Manager</h1>
      <p className="text-gray-600 mb-8">Current Date: 2025-04-05</p>
      <TaskForm />
      <TaskList />
    </main>
  );
}