import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import TaskItem from "./TaskItem";

type Props = {
  title: string;
  tasks: any[];
  onUpdate: () => void;
};

export default function TaskSection({ title, tasks, onUpdate }: Props) {
  const styles =
    title === "Daily Tasks"
      ? "border-l-amber-400 text-amber-600"
      : title === "Temporary Tasks"
      ? "border-l-blue-400 text-blue-600"
      : "border-l-violet-400 text-violet-600";

  return (
    <Card className={`bg-white border-l-4 ${styles} shadow-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-700">
            {title}
          </CardTitle>
          <span className="text-xs text-slate-400">
            {tasks.length}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            No tasks here
          </p>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdate={onUpdate}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
