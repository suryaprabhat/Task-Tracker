import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import AddTask from "../components/AddTask";
import TaskSection from "../components/TaskSection";
import { useAuth } from "../context/AuthContext";

type Task = {
  _id: string;
  title: string;
  type: "daily" | "temporary" | "ongoing";
  deadline?: string;
  progress?: number;
};

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.ok ? await res.json() : [];
      setTasks(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-sm border">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Task Tracker
            </h1>
            <p className="text-sm text-slate-500">
              Build habits. Track progress. Stay consistent.
            </p>
          </div>

          <button
            onClick={logout}
            className="text-sm font-medium text-slate-500 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>

        {/* ADD TASK */}
        <Card className="bg-white border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-700">
              Add a new task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddTask onTaskAdded={fetchTasks} />
          </CardContent>
        </Card>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-10 text-slate-400">
            Loading tasks…
          </div>
        ) : tasks.length === 0 ? (
          <Card className="bg-white border shadow-sm">
            <CardContent className="py-14 text-center">
              <p className="text-slate-700 font-medium">
                No tasks yet
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Add your first task above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <TaskSection
              title="Daily Tasks"
              tasks={tasks.filter(t => t.type === "daily")}
              onUpdate={fetchTasks}
            />
            <TaskSection
              title="Temporary Tasks"
              tasks={tasks.filter(t => t.type === "temporary")}
              onUpdate={fetchTasks}
            />
            <TaskSection
              title="Ongoing Tasks"
              tasks={tasks.filter(t => t.type === "ongoing")}
              onUpdate={fetchTasks}
            />
          </>
        )}
      </div>
    </div>
  );
}
