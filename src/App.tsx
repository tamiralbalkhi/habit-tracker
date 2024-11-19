import React, { useState, useEffect } from 'react';
import { Task, TaskFrequency } from './types';
import { AddTask } from './components/AddTask';
import { TaskList } from './components/TaskList';
import { WeeklyReport } from './components/WeeklyReport';
import { ClipboardList } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (title: string, frequency: TaskFrequency) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      frequency,
      completed: false,
      createdAt: new Date().toISOString(),
      missedDates: [],
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const groupedTasks = {
    daily: tasks.filter(task => task.frequency === 'daily'),
    weekly: tasks.filter(task => task.frequency === 'weekly'),
    monthly: tasks.filter(task => task.frequency === 'monthly'),
    adhoc: tasks.filter(task => task.frequency === 'adhoc'),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center space-x-3 mb-8">
          <ClipboardList className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">Habit Tracker</h1>
        </div>

        <AddTask onAddTask={handleAddTask} />
        
        <WeeklyReport tasks={tasks} />

        <div className="mt-8 space-y-6">
          {(Object.entries(groupedTasks) as [TaskFrequency, Task[]][]).map(([frequency, tasks]) => (
            <TaskList
              key={frequency}
              frequency={frequency}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;