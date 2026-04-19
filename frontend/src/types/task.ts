export type TaskType = "daily" | "temporary" | "ongoing";
export type CategoryType = "Work" | "Personal" | "Health" | "Finance" | "Education" | "Other";
export type PriorityType = "Low" | "Medium" | "High";

export interface Task {
  _id: string;
  title: string;
  type: TaskType;
  category: CategoryType;
  priority: PriorityType;

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
