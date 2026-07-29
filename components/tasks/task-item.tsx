"use client";

import { motion } from "framer-motion";
import { Bell, CalendarDays, Clock, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, priorityColor } from "@/lib/utils";
import type { Task } from "@/types/database";

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover flex items-start gap-3 p-4"
    >
      <button
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.completed ? "border-brand-blue bg-brand-blue" : "border-white/20"
        )}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("truncate text-sm font-medium", task.completed && "text-muted line-through")}>
            {task.title}
          </p>
          <Badge style={{ color: priorityColor(task.priority) }}>{task.priority}</Badge>
        </div>
        {task.notes && <p className="mt-1 text-xs text-muted line-clamp-1">{task.notes}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          {task.due_date && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(task.due_date, { weekday: undefined, day: "numeric", month: "short" })}
            </span>
          )}
          {task.due_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.due_time.slice(0, 5)}
            </span>
          )}
          {task.reminder && (
            <span className="flex items-center gap-1 text-brand-purple">
              <Bell className="h-3 w-3" /> Recordatorio
            </span>
          )}
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
    </motion.div>
  );
}
