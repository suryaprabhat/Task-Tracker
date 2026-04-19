import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import AddTask from "../components/AddTask";
import TaskSection from "../components/TaskSection";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../api/taskapi";
import type { Task } from "../types/task"; // Bug 6: use shared type, not a duplicate local one
import { LogOut, LayoutDashboard, ListTodo, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bug 3: wrapped in useCallback so the effect dependency array is stable
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      // 401 is handled by the axios interceptor → calls logout() → ProtectedRoute redirects
      if (err?.response?.status !== 401) {
        setError("Could not load tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []); // no deps — setLoading/setError/setTasks are stable setState refs

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, fetchTasks]); // Bug 3: fetchTasks is now stable via useCallback

  // Bug 4: pre-filter so we only render sections that have tasks
  const dailyTasks = tasks.filter((t) => t.type === "daily");
  const temporaryTasks = tasks.filter((t) => t.type === "temporary");
  const ongoingTasks = tasks.filter((t) => t.type === "ongoing");
  const hasAnyTasks = tasks.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-8 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[120px] opacity-70 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 backdrop-blur-xl px-6 py-5 shadow-2xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20">
              <LayoutDashboard className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 leading-tight">
                Task Tracker
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Build habits. Track progress. Stay consistent.
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 bg-slate-800/60 hover:bg-red-500/10 rounded-lg border border-slate-700/60 hover:border-red-500/30 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* ADD TASK */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-xl overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                <ListTodo className="h-4 w-4 text-indigo-400" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-200">
                New Task
              </CardTitle>
            </div>
            <div className="h-px bg-gradient-to-r from-indigo-500/20 via-slate-700/40 to-transparent mt-4" />
          </CardHeader>
          <CardContent className="pt-5">
            <AddTask onTaskAdded={fetchTasks} />
          </CardContent>
        </Card>

        {/* TASK LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <div className="h-8 w-8 rounded-full border-2 border-indigo-500/40 border-t-indigo-400 animate-spin" />
            <p className="text-sm">Loading your tasks…</p>
          </div>
        ) : error ? (
          <Card className="bg-slate-900/60 backdrop-blur-xl border-red-500/20 shadow-xl">
            <CardContent className="py-14 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-red-300 font-semibold">{error}</p>
              <button
                onClick={fetchTasks}
                className="mt-4 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : !hasAnyTasks ? (
          // Shows only when truly no tasks exist at all
          <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-xl">
            <CardContent className="py-16 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <ListTodo className="h-6 w-6 text-slate-500" />
              </div>
              <p className="text-slate-300 font-semibold text-base">No tasks yet</p>
              <p className="text-sm text-slate-500 mt-1.5">
                Add your first task above to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          // Bug 4: only render a section if it has ≥1 task — no empty "0 tasks" cards
          <div className="space-y-6">
            {dailyTasks.length > 0 && (
              <TaskSection
                title="Daily Tasks"
                tasks={dailyTasks}
                onUpdate={fetchTasks}
              />
            )}
            {temporaryTasks.length > 0 && (
              <TaskSection
                title="Temporary Tasks"
                tasks={temporaryTasks}
                onUpdate={fetchTasks}
              />
            )}
            {ongoingTasks.length > 0 && (
              <TaskSection
                title="Ongoing Tasks"
                tasks={ongoingTasks}
                onUpdate={fetchTasks}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
