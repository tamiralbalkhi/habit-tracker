import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { TaskFrequency } from '../types';

interface AddTaskProps {
  onAddTask: (title: string, frequency: TaskFrequency) => void;
}

export function AddTask({ onAddTask }: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<TaskFrequency>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), frequency);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your task"
            required
            minLength={1}
            maxLength={100}
            aria-label="Task title input"
          />
        </div>
        <div>
          <label htmlFor="task-frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            id="task-frequency"
            value={frequency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFrequency(e.target.value as TaskFrequency)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Task frequency selection"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="adhoc">Ad-hoc</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!title.trim()}
          aria-label="Add new task"
        >
          <PlusCircle className="w-5 h-5 mr-2" aria-hidden="true" />
          Add Task
        </button>
      </div>
    </form>
  );
}