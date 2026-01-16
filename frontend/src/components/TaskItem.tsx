import type { Task } from "../types/task";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type Props = {
  task: Task;
  onUpdate: () => void;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TaskItem({ task, onUpdate }: Props) {
  const isDaily = task.type === "daily";
  const token = localStorage.getItem("token");

  const completeDaily = async () => {
    if (!token || task.completedToday) return;

    const res = await fetch(
      `${API_BASE_URL}/api/tasks/${task._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast.error("Could not complete task");
      return;
    }

    confetti({ particleCount: 80, spread: 60 });
    toast.success("Daily task completed 🔥");
    onUpdate();
  };

  const deleteTask = async () => {
    if (!token) return;

    const res = await fetch(
      `${API_BASE_URL}/api/tasks/${task._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Task deleted");
    onUpdate();
  };

  const progress =
    isDaily ? (task.completedToday ? 100 : 0) : task.progress ?? 0;

  return (
    <div className="rounded-lg border bg-slate-50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          {task.title}
        </p>

        <div className="flex items-center gap-3">
          {isDaily && (
            <input
              type="checkbox"
              checked={task.completedToday ?? false}
              onChange={completeDaily}
              disabled={task.completedToday}
              className="accent-amber-500 scale-125"
            />
          )}

          <button
            onClick={deleteTask}
            className="text-xs text-slate-400 hover:text-red-500 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {isDaily && (
        <p className="text-xs text-slate-500 mt-1">
          🔥 Streak: <strong>{task.streak ?? 0}</strong> days
        </p>
      )}

      <div className="mt-3 h-2 w-full rounded bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-amber-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
