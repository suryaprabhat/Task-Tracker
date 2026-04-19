import type { Task } from "../types/task";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Trash2, Flame, CheckCircle2, Circle, Briefcase, Home, Heart, Landmark, GraduationCap, Folder, AlertCircle } from "lucide-react";
import { completeTask, deleteTask } from "../api/taskapi";

type Props = {
  task: Task;
  onUpdate: () => void;
};

const typeConfig = {
  daily: {
    accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
    bar: "bg-gradient-to-r from-amber-400 to-orange-500",
    badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    dot: "bg-amber-400",
  },
  temporary: {
    accent: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    bar: "bg-gradient-to-r from-blue-400 to-cyan-500",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  ongoing: {
    accent: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    bar: "bg-gradient-to-r from-violet-400 to-purple-500",
    badge: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
    dot: "bg-violet-400",
  },
};

const categoryIcons: Record<string, any> = {
  Work: Briefcase,
  Personal: Home,
  Health: Heart,
  Finance: Landmark,
  Education: GraduationCap,
  Other: Folder,
};

const priorityStyles: Record<string, string> = {
  Low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  High: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function TaskItem({ task, onUpdate }: Props) {
  const isDaily = task.type === "daily";
  const cfg = typeConfig[task.type] ?? typeConfig.ongoing;
  const CategoryIcon = categoryIcons[task.category] || Folder;

  const handleComplete = async () => {
    if (task.completedToday) return;
    try {
      await completeTask(task._id);
      confetti({ particleCount: 80, spread: 60 });
      toast.success("Daily task completed 🔥");
      onUpdate();
    } catch (err: any) {
      const msg =
        err?.response?.status === 409
          ? "Already completed today!"
          : err?.response?.data?.error || "Could not complete task.";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      toast.success("Task deleted");
      onUpdate();
    } catch {
      toast.error("Failed to delete task.");
    }
  };

  const progress = isDaily ? (task.completedToday ? 100 : 0) : task.progress ?? 0;

  return (
    <div
      className={`relative rounded-xl border bg-gradient-to-br ${cfg.accent} backdrop-blur-sm p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.005] group`}
    >
      {/* Top row: dot + title + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`mt-0.5 flex-shrink-0 h-2 w-2 rounded-full ${cfg.dot}`} />
          <p
            className={`text-sm font-medium leading-snug truncate ${
              task.completedToday ? "line-through text-slate-500" : "text-slate-100"
            }`}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
            <CategoryIcon className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{task.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-tighter ${priorityStyles[task.priority]}`}>
            {task.priority}
          </div>
          {/* Daily complete toggle */}
          {isDaily && (
            <button
              onClick={handleComplete}
              disabled={task.completedToday}
              title={task.completedToday ? "Completed today!" : "Mark as done"}
              className="text-slate-400 hover:text-amber-400 disabled:text-amber-400 transition-colors cursor-pointer disabled:cursor-default"
            >
              {task.completedToday ? (
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Delete — appears on hover */}
          <button
            onClick={handleDelete}
            title="Delete task"
            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all duration-200 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Streak badge */}
      {isDaily && (task.streak ?? 0) > 0 && (
        <div className={`mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
          <Flame className="h-3 w-3 text-orange-400" />
          <span>{task.streak} day streak</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-700/60 overflow-hidden">
        <div
          className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {progress > 0 && (
        <p className="mt-1 text-right text-[10px] text-slate-500 font-medium">
          {progress}%
        </p>
      )}
    </div>
  );
}
