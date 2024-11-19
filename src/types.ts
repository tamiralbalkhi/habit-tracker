export type TaskFrequency = 'daily' | 'weekly' | 'monthly' | 'adhoc';

export interface Task {
  id: string;
  title: string;
  frequency: TaskFrequency;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  missedDates: string[];
}

export interface TaskGroup {
  frequency: TaskFrequency;
  tasks: Task[];
}