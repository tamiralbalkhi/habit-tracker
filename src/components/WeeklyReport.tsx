import React from 'react';
import { Task } from '../types';
import { BarChart, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';

interface WeeklyReportProps {
  tasks: Task[];
}

interface TaskProgress {
  task: Task;
  completedDays: number;
  totalDays: number;
  percentage: number;
}

export function WeeklyReport({ tasks }: WeeklyReportProps) {
  const startDate = startOfWeek(new Date());
  const endDate = endOfWeek(new Date());
  const daysInWeek = eachDayOfInterval({ start: startDate, end: endDate });

  const completedTasks = tasks.filter((task) => task.completed).length;
  const missedTasks = tasks.reduce((acc, task) => acc + task.missedDates.length, 0);
  const totalTasks = tasks.length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getTaskProgress = (task: Task): TaskProgress => {
    let completedDays = 0;
    const totalDays = task.frequency === 'daily' ? 7 : 
                      task.frequency === 'weekly' ? 1 : 
                      task.frequency === 'monthly' ? 1 : 0;

    if (task.frequency === 'daily') {
      daysInWeek.forEach(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const wasCompletedOnDay = task.completedAt && 
          format(parseISO(task.completedAt), 'yyyy-MM-dd') === dayStr;
        if (wasCompletedOnDay) completedDays++;
      });
    } else if (task.frequency === 'weekly' || task.frequency === 'monthly') {
      if (task.completed) completedDays = 1;
    }

    return {
      task,
      completedDays,
      totalDays,
      percentage: totalDays ? Math.round((completedDays / totalDays) * 100) : 0
    };
  };

  const taskProgress = tasks
    .filter(task => task.frequency !== 'adhoc')
    .map(getTaskProgress)
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Weekly Report</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
      </p>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-medium text-green-700">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">{completedTasks}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-medium text-red-700">Missed</h3>
          </div>
          <p className="text-2xl font-bold text-red-700">{missedTasks}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-2">Completion Rate</h3>
          <p className="text-2xl font-bold text-blue-700">{completionRate}%</p>
        </div>
      </div>

      {/* Task Progress */}
      {taskProgress.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Task Progress</h3>
          </div>
          <div className="space-y-4">
            {taskProgress.map(({ task, completedDays, totalDays, percentage }) => (
              <div key={task.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{task.title}</span>
                  <span className="text-sm text-gray-500">
                    {completedDays}/{totalDays} {task.frequency === 'daily' ? 'days' : 'times'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium text-gray-500">{percentage}% complete</span>
                  {task.frequency === 'daily' && (
                    <span className={`text-sm font-medium ${
                      percentage === 100 ? 'text-green-600' :
                      percentage >= 80 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {percentage === 100 ? 'Perfect week!' :
                       percentage >= 80 ? 'Almost there!' :
                       'Needs attention'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}