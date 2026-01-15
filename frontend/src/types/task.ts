export type TaskType = "daily" | "temporary" | "ongoing";

export interface Task {
  _id: string;
  title: string;
  type: TaskType;

  deadline?: string;

  progress: number;

  // DAILY TASK FIELDS
  completedToday?: boolean;
  lastCompletedAt?: string;
  streak?: number;
}
