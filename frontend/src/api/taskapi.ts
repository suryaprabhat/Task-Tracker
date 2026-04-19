import api from "./axios";

// CREATE
export async function createTask(task: {
  title: string;
  type: "daily" | "temporary" | "ongoing";
  deadline?: string | null;
  dailyReminderTime?: string | null;
  reminderAt?: string | null;
  progress?: number;
}) {
  const res = await api.post("/tasks", task);
  return res.data;
}

// GET ALL
export async function getTasks() {
  const res = await api.get("/tasks");
  return res.data;
}

// PATCH (complete daily)
export async function completeTask(id: string) {
  const res = await api.patch(`/tasks/${id}`);
  return res.data;
}

// DELETE
export async function deleteTask(id: string) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}
