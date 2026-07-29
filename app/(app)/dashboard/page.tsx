import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { GreetingCard } from "@/components/dashboard/greeting-card";
import { GoalsSummary } from "@/components/dashboard/goals-summary";
import { HabitsToday } from "@/components/dashboard/habits-today";
import { TasksToday } from "@/components/dashboard/tasks-today";
import { WeeklyChart, type WeeklyPoint } from "@/components/dashboard/weekly-chart";
import { todayISO } from "@/lib/utils";

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: goals }, { data: habits }, { data: tasks }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", user!.id)
      .eq("status", "activo")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase.from("habits").select("*").eq("user_id", user!.id).eq("archived", false),
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user!.id)
      .eq("due_date", todayISO())
      .order("priority", { ascending: true }),
  ]);

  const { data: todayLogs } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", user!.id)
    .eq("completed_on", todayISO());

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString().slice(0, 10);

  const [{ data: weekLogs }, { data: weekTasks }] = await Promise.all([
    supabase
      .from("habit_logs")
      .select("completed_on")
      .eq("user_id", user!.id)
      .gte("completed_on", sevenDaysAgoISO),
    supabase
      .from("tasks")
      .select("due_date")
      .eq("user_id", user!.id)
      .eq("completed", true)
      .gte("due_date", sevenDaysAgoISO),
  ]);

  const weeklyData: WeeklyPoint[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    return {
      day: WEEKDAY_LABELS[d.getDay()],
      habitos: weekLogs?.filter((l) => l.completed_on === iso).length ?? 0,
      tareas: weekTasks?.filter((t) => t.due_date === iso).length ?? 0,
    };
  });

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "ahí";

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="space-y-6 p-6">
        <GreetingCard name={firstName} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <GoalsSummary goals={goals ?? []} />
          <HabitsToday habits={habits ?? []} completedIds={(todayLogs ?? []).map((l) => l.habit_id)} />
          <TasksToday tasks={tasks ?? []} />
        </div>

        <WeeklyChart data={weeklyData} />
      </div>
    </div>
  );
}
