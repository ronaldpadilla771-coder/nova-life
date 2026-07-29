"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckSquare } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { cn, priorityColor } from "@/lib/utils";
import type { Task } from "@/types/database";

export function TasksToday({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [pending, setPending] = useState<string | null>(null);

  const toggle = async (task: Task) => {
    setPending(task.id);
    await supabase.from("tasks").update({ completed: !task.completed }).eq("id", task.id);
    setPending(null);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-brand-purple" />
          Tareas de hoy
        </CardTitle>
      </CardHeader>

      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No tienes tareas para hoy. 🎉</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggle(task)}
              disabled={pending === task.id}
              className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-sm transition-all duration-200 hover:bg-white/[0.05]"
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border-2",
                    task.completed ? "border-brand-blue bg-brand-blue" : "border-white/20"
                  )}
                />
                <span className={cn(task.completed && "text-muted line-through")}>{task.title}</span>
              </span>
              <Badge style={{ color: priorityColor(task.priority) }}>{task.priority}</Badge>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
