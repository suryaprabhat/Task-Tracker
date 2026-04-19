import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { createTask } from "../api/taskapi";
import { toast } from "sonner";
import { PlusCircle, AlarmClock, CalendarDays, Tag, Loader2, Briefcase, Home, Heart, Landmark, GraduationCap, Folder, Zap } from "lucide-react";

type Props = {
  onTaskAdded: () => void;
};

export default function AddTask({ onTaskAdded }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"daily" | "temporary" | "ongoing">("daily");
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("Medium");
  
  // States map nicely to our unified form but vary in requirement
  const [deadline, setDeadline] = useState("");
  const [dailyReminderTime, setDailyReminderTime] = useState(""); // HH:MM for daily
  const [reminderOption, setReminderOption] = useState("none");
  const [customReminder, setCustomReminder] = useState("");
  const [loading, setLoading] = useState(false);

  const toUTC = (local: string) =>
    local ? new Date(local).toISOString() : null;

  const computeReminderAt = (): string | null => {
    if (reminderOption === "none") return null;
    if (reminderOption === "custom") {
      if (!customReminder) return null;
      return toUTC(customReminder);
    }
    if (!deadline) return null; // shouldn't happen unless ongoing + preset selected
    const offsetMinutes = Number(reminderOption);
    const d = new Date(deadline);
    d.setMinutes(d.getMinutes() - offsetMinutes);
    return d.toISOString();
  };

  const addTask = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title.");
      return;
    }

    // Type-specific validation
    if (type === "temporary" && !deadline) {
      toast.error("Please set a deadline for temporary tasks.");
      return;
    }

    if (deadline && new Date(deadline) <= new Date()) {
      toast.error("Deadline must be in the future.");
      return;
    }

    let payload: any = {
      title: title.trim(),
      type,
      category,
      priority,
      progress: 0,
    };

    if (type === "daily") {
      // For daily tasks, only dailyReminderTime matters
      payload.dailyReminderTime = dailyReminderTime || null;
    } else {
      // For temp / ongoing tasks, we check deadline and computes reminderAt
      if (reminderOption === "custom" && !customReminder) {
        toast.error("Please set a custom reminder time.");
        return;
      }
      
      if (reminderOption !== "none" && reminderOption !== "custom" && !deadline) {
        toast.error("Please set a deadline to use this relative reminder, or pick a custom reminder time.");
        return;
      }

      const reminderAt = computeReminderAt();
      if (reminderOption !== "none" && !reminderAt) {
        toast.error("Invalid reminder time.");
        return;
      }

      if (reminderAt && new Date(reminderAt) <= new Date()) {
        toast.error(
          reminderOption === "custom"
            ? "Custom reminder time must be in the future."
            : `Deadline is too soon for a "${reminderOption === "60" ? "1 hour" : "1 day"}" reminder — pick a later deadline or use a custom reminder time.`
        );
        return;
      }

      payload.deadline = deadline ? toUTC(deadline) : null;
      payload.reminderAt = reminderAt;
    }

    try {
      setLoading(true);
      await createTask(payload);

      toast.success("Task added! 🎯");

      // Reset fields
      setTitle("");
      setType("daily");
      setCategory("Other");
      setPriority("Medium");
      setDeadline("");
      setDailyReminderTime("");
      setReminderOption("none");
      setCustomReminder("");

      onTaskAdded();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to create task.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // The submit button is ready when the title is present, and if it's a temporary task, a deadline is present.
  const isReady = !!title.trim() && (type !== "temporary" || !!deadline);

  return (
    <div className="flex flex-col gap-5">
      {/* Task Title */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <Tag className="h-3.5 w-3.5 text-indigo-400" />
          Task Title
        </label>
        <Input
          placeholder="What do you need to accomplish?"
          value={title}
          className="h-11 bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:border-indigo-500/50 rounded-lg transition-all"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isReady && addTask()}
        />
      </div>

      {/* Category & Priority Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <span className="text-indigo-400">◈</span>
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Work">💼 Work</SelectItem>
              <SelectItem value="Personal">🏠 Personal</SelectItem>
              <SelectItem value="Health">❤️ Health</SelectItem>
              <SelectItem value="Finance">💰 Finance</SelectItem>
              <SelectItem value="Education">🎓 Education</SelectItem>
              <SelectItem value="Other">📁 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Priority
          </label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">🔵 Low</SelectItem>
              <SelectItem value="Medium">🟡 Medium</SelectItem>
              <SelectItem value="High">🔴 High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Type Row */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <span className="text-amber-400">◈</span>
          Task Type
        </label>
        <Select value={type} onValueChange={(v) => {
          setType(v as any);
          setReminderOption("none"); // Reset reminder when changing type
          setDeadline("");
          setCustomReminder("");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">🌅 Daily (Re-occurs every day)</SelectItem>
            <SelectItem value="temporary">⏳ Temporary (Has a firm deadline)</SelectItem>
            <SelectItem value="ongoing">♾ Ongoing (No rigid deadline)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row handling dynamic timing options */}
      {type === "daily" ? (
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <AlarmClock className="h-3.5 w-3.5 text-purple-400" />
            Daily Reminder Time (Optional)
          </label>
          <Input
            type="time"
            value={dailyReminderTime}
            className="h-10 bg-slate-800/60 border-slate-700 text-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:border-indigo-500/50 rounded-lg [color-scheme:dark] transition-all"
            onChange={(e) => setDailyReminderTime(e.target.value)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
              Deadline {type === "ongoing" && "(Optional)"}
            </label>
            <Input
              type="datetime-local"
              value={deadline}
              className="h-10 bg-slate-800/60 border-slate-700 text-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:border-indigo-500/50 rounded-lg [color-scheme:dark] transition-all"
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <AlarmClock className="h-3.5 w-3.5 text-purple-400" />
              Reminder
            </label>
            <Select value={reminderOption} onValueChange={setReminderOption}>
              <SelectTrigger>
                <SelectValue placeholder="When to remind you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">🔕 No reminder</SelectItem>
                <SelectItem value="60">🔔 1 hour before</SelectItem>
                <SelectItem value="1440">📅 1 day before</SelectItem>
                <SelectItem value="custom">✏️ Custom time</SelectItem>
              </SelectContent>
            </Select>

            {reminderOption === "custom" && (
              <Input
                type="datetime-local"
                value={customReminder}
                className="mt-2 h-10 bg-slate-800/60 border-slate-700 text-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500/60 rounded-lg [color-scheme:dark] transition-all"
                onChange={(e) => setCustomReminder(e.target.value)}
              />
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={addTask}
        disabled={!isReady || loading}
        className="h-11 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding…
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4" />
            Add Task
          </>
        )}
      </Button>
    </div>
  );
}
