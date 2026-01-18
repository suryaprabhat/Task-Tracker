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

import { API_BASE_URL } from "../config";

type Props = {
  onTaskAdded: () => void;
};

export default function AddTask({ onTaskAdded }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] =
    useState<"daily" | "temporary" | "ongoing">("daily");
  const [deadline, setDeadline] = useState("");
  const [reminderOption, setReminderOption] = useState("60"); // minutes
  const [customReminder, setCustomReminder] = useState("");

  const toUTC = (local: string) =>
    local ? new Date(local).toISOString() : null;

  const computeReminderAt = () => {
    if (reminderOption === "custom") {
      return toUTC(customReminder);
    }

    const offsetMinutes = Number(reminderOption);
    const d = new Date(deadline);
    d.setMinutes(d.getMinutes() - offsetMinutes);
    return d.toISOString();
  };

  const addTask = async () => {
    if (!title || !deadline) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    const reminderAt = computeReminderAt();
    if (!reminderAt) return alert("Invalid reminder time");

    const res = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        type,
        deadline: toUTC(deadline),
        reminderAt,
        progress: 0,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to create task");
      return;
    }

    setTitle("");
    setDeadline("");
    setCustomReminder("");
    onTaskAdded();
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Select value={type} onValueChange={(v) => setType(v as any)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="temporary">Temporary</SelectItem>
          <SelectItem value="ongoing">Ongoing</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <Select
        value={reminderOption}
        onValueChange={setReminderOption}
      >
        <SelectTrigger>
          <SelectValue placeholder="Reminder time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="60">1 hour before</SelectItem>
          <SelectItem value="1440">1 day before</SelectItem>
          <SelectItem value="custom">Custom time</SelectItem>
        </SelectContent>
      </Select>

      {reminderOption === "custom" && (
        <Input
          type="datetime-local"
          value={customReminder}
          onChange={(e) => setCustomReminder(e.target.value)}
        />
      )}

      <Button onClick={addTask}>Add Task</Button>
    </div>
  );
}
