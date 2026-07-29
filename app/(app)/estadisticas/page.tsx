"use client";

import { useEffect, useState } from "react";
import { Flame, ListChecks, Percent } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { HabitCompletionChart, TasksProductivityChart, GoalsStatusChart } from "@/components/stats/stats-charts";
import { createClient } from "@/lib/supabase/client";
import type { Goal, Habit, HabitLog, Task } from "@/types/database";

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function computeStreak(dates: Set<string>) {
  let streak = 0;
  const cursor = new Date();
  const todayISO = new Date().toISOString().slice(0, 10);
  if (!dates.has(todayISO)) cursor.setDate(cursor.getDate() - 1);
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function EstadisticasPage() {
  const supabase = createClient();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyISO = thirtyDaysAgo.toISOString().slice(0, 10);

      const [{ data: h }, { data: l }, { data: t }, { data: g }] = await Promise.all([
        supabase.from("habits").select("*").eq("archived", false),
        supabase.from("habit_logs").select("*").gte("completed_on", thirtyISO),
        supabase.from("tasks").select("*"),
        supabase.from("goals").select("*"),
      ]);
      setHabits(h ?? []);
      setLogs(l ?? []);
      setTasks(t ?? []);
      setGoals(g ?? []);
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) {
    return (
      <div>
        <Topbar title="Estadísticas" />
        <p className="p-6 text-sm text-muted">Cargando estadísticas...</p>
      </div>
    );
  }

  const habitCompletionData = habits.map((h) => {
    const count = logs.filter((l) => l.habit_id === h.id).length;
    return { name: h.name, rate: Math.min(100, Math.round((count / 30) * 100)), color: h.color };
  });

  const bestStreak = habits.reduce((max, h) => {
    const dates = new Set(logs.filter((l) => l.habit_id === h.id).map((l) => l.completed_on));
    return Math.max(max, computeStreak(dates));
  }, 0);

  const weeklyTaskData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const dayTasks = tasks.filter((t) => t.due_date === iso);
    return {
      day: WEEKDAY_LABELS[d.getDay()],
      completadas: dayTasks.filter((t) => t.completed).length,
      pendientes: dayTasks.filter((t) => !t.completed).length,
    };
  });

  const goalsStatusData = [
    { name: "Activos", value: goals.filter((g) => g.status === "activo").length, color: "#3B82F6" },
    { name: "Completados", value: goals.filter((g) => g.status === "completado").length, color: "#22C55E" },
    { name: "Pausados", value: goals.filter((g) => g.status === "pausado").length, color: "#71717A" },
  ];

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const productivityRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div>
      <Topbar title="Estadísticas" />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Flame className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted">Mejor racha activa</p>
              <p className="text-xl font-semibold">{bestStreak} días</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/10">
              <Percent className="h-5 w-5 text-brand-purple" />
            </div>
            <div>
              <p className="text-xs text-muted">Productividad general</p>
              <p className="text-xl font-semibold">{productivityRate}%</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10">
              <ListChecks className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-xs text-muted">Tareas completadas</p>
              <p className="text-xl font-semibold">
                {completedTasksCount} / {totalTasksCount}
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TasksProductivityChart data={weeklyTaskData} />
          <GoalsStatusChart data={goalsStatusData} />
        </div>

        <HabitCompletionChart data={habitCompletionData} />
      </div>
    </div>
  );
}
