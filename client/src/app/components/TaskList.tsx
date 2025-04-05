"use client";

import { useState } from "react";
import { useTaskContext } from "../providers";
import { UpdateTaskDto } from "../../lib/api";

export const TaskList = () => {
  const { tasks, isLoading, error, updateTask, deleteTask } = useTaskContext();
  const [editingTask, setEditingTask] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    const taskUpdate: UpdateTaskDto = {
      title: editingTask.title,
      description: editingTask.description || undefined,
    };

    await updateTask(editingTask.id, taskUpdate);
    setEditingTask(null);
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    await updateTask(id, { completed: !completed });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tasks</h2>

      {/* Edit Task Form */}
      {editingTask && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Edit Task</h3>
          <form onSubmit={handleUpdateTask}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Task Title"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Task Description (optional)"
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Update Task
              </button>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && !tasks.length && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {tasks.length === 0 && !isLoading ? (
        <p className="text-gray-500 text-center py-8">
          No tasks yet. Create one above!
        </p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-lg shadow-md">
              <h3
                className={`text-xl font-medium ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 mt-2">{task.description}</p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                Created: {new Date(task.createdAt).toLocaleString()}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                  className={`${
                    task.completed
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-3 py-1 rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-1`}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button
                  onClick={() =>
                    setEditingTask({
                      id: task.id,
                      title: task.title,
                      description: task.description || "",
                    })
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
