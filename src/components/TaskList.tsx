import React from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Task, TaskFrequency } from '../types';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  frequency: TaskFrequency;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, frequency, onToggleTask, onDeleteTask }: TaskListProps) {
  const frequencyTitle = {
    daily: 'Daily Tasks',
    weekly: 'Weekly Tasks',
    monthly: 'Monthly Tasks',
    adhoc: 'Ad-hoc Tasks'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{frequencyTitle[frequency]}</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500 italic">No tasks added yet</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {task.completedAt
                    ? `Completed ${format(new Date(task.completedAt), 'MMM d, yyyy')}`
                    : `Created ${format(new Date(task.createdAt), 'MMM d, yyyy')}`}
                </span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}