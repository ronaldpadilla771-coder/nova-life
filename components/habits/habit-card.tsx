"use client";

import { motion } from "framer-motion";
import { Flame, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/database";

const WEEKDAY_LABELS = ["D", "L", "M", "X", "J", "V", "S"];

export function HabitCard({
  habit,
  loggedDates,
  streak,
  onToggleDate,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  loggedDates: Set<string>;
  streak: number;
  onToggleDate: (isoDate: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="card-hover">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
              style={{ backgroundColor: `${habit.color}22` }}
            >
              {habit.icon}
            </div>
            <div>
              <h3 className="font-semibold">{habit.name}</h3>
              <p className="text-xs text-muted capitalize">{habit.frequency}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={onEdit} className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-foreground">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={onDelete} className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1.5 text-sm">
          <Flame className={cn("h-4 w-4", streak > 0 ? "text-warning" : "text-muted")} />
          <span className="font-medium">{streak}</span>
          <span className="text-muted">{streak === 1 ? "día seguido" : "días seguidos"}</span>
        </div>

        <div className="flex justify-between gap-1">
          {last7.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const done = loggedDates.has(iso);
            return (
              <button
                key={iso}
                onClick={() => onToggleDate(iso)}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-[10px] text-muted">{WEEKDAY_LABELS[d.getDay()]}</span>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: done ? habit.color : "transparent",
                    borderColor: done ? habit.color : "rgba(255,255,255,0.1)",
                    color: done ? "#09090B" : "#71717A",
                  }}
                >
                  {d.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
