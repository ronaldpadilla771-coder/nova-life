"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, CheckSquare } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TaskItem } from "@/components/tasks/task-item";
import { TaskFormModal } from "@/components/tasks/task-form-modal";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types/database";
import type { TaskInput } from "@/lib/validations";

type Filter = "todas" | "pendientes" | "completadas";

export default function TareasPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pendientes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const loadTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    setTasks(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: TaskInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      ...values,
      notes: values.notes || null,
      due_date: values.due_date || null,
      due_time: values.due_time || null,
    };

    if (editing) {
      await supabase.from("tasks").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("tasks").insert({ ...payload, user_id: user.id });
    }
    setEditing(null);
    await loadTasks();
  };

  const handleToggle = async (task: Task) => {
    await supabase.from("tasks").update({ completed: !task.completed }).eq("id", task.id);
    await loadTasks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await supabase.from("tasks").delete().eq("id", id);
    await loadTasks();
  };

  const filteredTasks = useMemo(() => {
    if (filter === "pendientes") return tasks.filter((t) => !t.completed);
    if (filter === "completadas") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div>
      <Topbar title="Tareas" />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="w-44">
            <option value="pendientes">Pendientes</option>
            <option value="completadas">Completadas</option>
            <option value="todas">Todas</option>
          </Select>
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Nueva tarea
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Cargando tareas...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
            <CheckSquare className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">No hay tareas en esta vista.</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Crear tarea
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggle(task)}
                  onEdit={() => {
                    setEditing(task);
                    setModalOpen(true);
                  }}
                  onDelete={() => handleDelete(task.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
