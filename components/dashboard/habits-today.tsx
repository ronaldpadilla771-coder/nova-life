"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Repeat, Check } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { todayISO, cn } from "@/lib/utils";
import type { Habit } from "@/types/database";

export function HabitsToday({
  habits,
  completedIds,
}: {
  habits: Habit[];
  completedIds: string[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [pending, setPending] = useState<string | null>(null);
  const [done, setDone] = useState(new Set(completedIds));

  const toggle = async (habitId: string) => {
    setPending(habitId);
    const isDone = done.has(habitId);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (isDone) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("completed_on", todayISO());
      setDone((prev) => {
        const next = new Set(prev);
        next.delete(habitId);
        return next;
      });
    } else {
      await supabase.from("habit_logs").insert({
        habit_id: habitId,
        user_id: user.id,
        completed_on: todayISO(),
      });
      setDone((prev) => new Set(prev).add(habitId));
    }
    setPending(null);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-4 w-4 text-brand-green" />
          Hábitos de hoy
        </CardTitle>
      </CardHeader>

      {habits.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Crea tu primer hábito para empezar.</p>
      ) : (
        <div className="space-y-2">
          {habits.map((habit) => {
            const isDone = done.has(habit.id);
            return (
              <button
                key={habit.id}
                onClick={() => toggle(habit.id)}
                disabled={pending === habit.id}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border border-white/[0.06] px-3 py-2.5 text-sm transition-all duration-200",
                  isDone ? "bg-brand-green/10 border-brand-green/30" : "bg-white/[0.02] hover:bg-white/[0.05]"
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{habit.icon}</span>
                  <span className={cn(isDone && "text-muted line-through")}>{habit.name}</span>
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                    isDone ? "border-brand-green bg-brand-green text-white" : "border-white/20"
                  )}
                >
                  {isDone && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
