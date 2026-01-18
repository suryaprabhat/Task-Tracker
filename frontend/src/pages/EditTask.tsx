import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type Props = {
  task: any;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditTask({ task, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(task.title);
  const [deadline, setDeadline] = useState(
    task.deadline ? task.deadline.slice(0, 16) : ""
  );
  const [remindAt, setRemindAt] = useState(
    task.remindAt ? task.remindAt.slice(0, 16) : ""
  );

  const token = localStorage.getItem("token");

  const save = async () => {
    const res = await fetch(
      `http://:5000/api/tasks/${task._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          deadline: new Date(deadline).toISOString(),
          remindAt: new Date(remindAt).toISOString(),
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to update task");
      return;
    }

    onUpdated();
    onClose();
  };

  return (
    <div className="p-4 border rounded space-y-3 bg-background">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />

      <Input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <Input
        type="datetime-local"
        value={remindAt}
        onChange={(e) => setRemindAt(e.target.value)}
      />

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}
