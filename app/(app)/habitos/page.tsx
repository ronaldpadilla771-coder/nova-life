"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Repeat } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitFormModal } from "@/components/habits/habit-form-modal";
import { createClient } from "@/lib/supabase/client";
import { todayISO } from "@/lib/utils";
import type { Habit, HabitLog } from "@/types/database";
import type { HabitInput } from "@/lib/validations";

function computeStreak(dates: Set<string>) {
  let streak = 0;
  const cursor = new Date();
  // Si hoy no está marcado, empezamos a contar desde ayer.
  if (!dates.has(todayISO())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function HabitosPage() {
  const supabase = createClient();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  const loadData = async () => {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [{ data: habitsData }, { data: logsData }] = await Promise.all([
      supabase.from("habits").select("*").eq("archived", false).order("created_at", { ascending: false }),
      supabase
        .from("habit_logs")
        .select("*")
        .gte("completed_on", sixtyDaysAgo.toISOString().slice(0, 10)),
    ]);
    setHabits(habitsData ?? []);
    setLogs(logsData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: HabitInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editing) {
      await supabase.from("habits").update(values).eq("id", editing.id);
    } else {
      await supabase.from("habits").insert({ ...values, user_id: user.id });
    }
    setEditing(null);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este hábito y todo su historial?")) return;
    await supabase.from("habits").delete().eq("id", id);
    await loadData();
  };

  const handleToggleDate = async (habitId: string, isoDate: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const exists = logs.some((l) => l.habit_id === habitId && l.completed_on === isoDate);
    if (exists) {
      await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("completed_on", isoDate);
    } else {
      await supabase.from("habit_logs").insert({ habit_id: habitId, user_id: user.id, completed_on: isoDate });
    }
    await loadData();
  };

  return (
    <div>
      <Topbar title="Hábitos" />
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Nuevo hábito
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Cargando hábitos...</p>
        ) : habits.length === 0 ? (
          <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Repeat className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">Todavía no tienes hábitos.</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Crear hábito
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {habits.map((habit) => {
                const habitDates = new Set(
                  logs.filter((l) => l.habit_id === habit.id).map((l) => l.completed_on)
                );
                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    loggedDates={habitDates}
                    streak={computeStreak(habitDates)}
                    onToggleDate={(iso) => handleToggleDate(habit.id, iso)}
                    onEdit={() => {
                      setEditing(habit);
                      setModalOpen(true);
                    }}
                    onDelete={() => handleDelete(habit.id)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <HabitFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
