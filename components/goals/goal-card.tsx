"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Goal } from "@/types/database";

const TERM_LABELS: Record<string, string> = {
  anual: "Anual",
  mensual: "Mensual",
  semanal: "Semanal",
};

export function GoalCard({
  goal,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const pct = Math.min(100, Math.round((goal.current_value / (goal.target_value || 1)) * 100));

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="card-hover">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <Badge>{TERM_LABELS[goal.term]}</Badge>
              {goal.category && <Badge>{goal.category}</Badge>}
            </div>
            <h3 className="font-semibold">{goal.title}</h3>
            {goal.description && <p className="mt-1 text-sm text-muted">{goal.description}</p>}
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

        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted">
            {goal.current_value} / {goal.target_value}
          </span>
          <span className="font-medium">{pct}%</span>
        </div>
        <Progress value={pct} color={goal.color} />

        {goal.due_date && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(goal.due_date, { weekday: undefined, day: "numeric", month: "short", year: "numeric" })}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
