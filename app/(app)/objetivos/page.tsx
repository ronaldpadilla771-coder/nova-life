"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Target } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalFormModal } from "@/components/goals/goal-form-modal";
import { createClient } from "@/lib/supabase/client";
import type { Goal, Term } from "@/types/database";
import type { GoalInput } from "@/lib/validations";

export default function ObjetivosPage() {
  const supabase = createClient();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Term | "todos">("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  const loadGoals = async () => {
    const { data } = await supabase.from("goals").select("*").order("created_at", { ascending: false });
    setGoals(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: GoalInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      ...values,
      description: values.description || null,
      category: values.category || null,
      due_date: values.due_date || null,
    };

    if (editing) {
      await supabase.from("goals").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("goals").insert({ ...payload, user_id: user.id });
    }
    setEditing(null);
    await loadGoals();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este objetivo?")) return;
    await supabase.from("goals").delete().eq("id", id);
    await loadGoals();
  };

  const filteredGoals = filter === "todos" ? goals : goals.filter((g) => g.term === filter);

  return (
    <div>
      <Topbar title="Objetivos" />
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Select value={filter} onChange={(e) => setFilter(e.target.value as Term | "todos")} className="w-40">
            <option value="todos">Todos</option>
            <option value="anual">Anuales</option>
            <option value="mensual">Mensuales</option>
            <option value="semanal">Semanales</option>
          </Select>
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Nuevo objetivo
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Cargando objetivos...</p>
        ) : filteredGoals.length === 0 ? (
          <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Target className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">Todavía no tienes objetivos en esta categoría.</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Crear objetivo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={() => {
                    setEditing(goal);
                    setModalOpen(true);
                  }}
                  onDelete={() => handleDelete(goal.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <GoalFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
