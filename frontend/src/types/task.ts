export type TaskType = "daily" | "temporary" | "ongoing";

export interface Task {
  _id: string;
  title: string;
  type: TaskType;

  deadline?: string | null;

  progress: number;

  // DAILY TASK FIELDS
  dailyReminderTime?: string | null;
  completedToday?: boolean;
  lastCompletedAt?: string | null;
  streak?: number;

  // NON-DAILY REMINDERS
  reminderAt?: string | null;
  notified?: boolean;
}
