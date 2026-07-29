"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { taskSchema, type TaskInput } from "@/lib/validations";
import type { Task } from "@/types/database";

export function TaskFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskInput) => Promise<void>;
  initial?: Task | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: "media", reminder: false },
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              title: initial.title,
              notes: initial.notes ?? "",
              priority: initial.priority,
              due_date: initial.due_date ?? "",
              due_time: initial.due_time ?? "",
              reminder: initial.reminder,
            }
          : { title: "", notes: "", priority: "media", due_date: "", due_time: "", reminder: false }
      );
    }
  }, [open, initial, reset]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar tarea" : "Nueva tarea"}>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
        className="space-y-4"
      >
        <div>
          <label className="label-field">Título</label>
          <Input placeholder="Ej. Enviar informe semanal" {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label-field">Notas</label>
          <Textarea placeholder="Detalles adicionales (opcional)" {...register("notes")} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label-field">Prioridad</label>
            <Select {...register("priority")}>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Select>
          </div>
          <div>
            <label className="label-field">Fecha</label>
            <Input type="date" {...register("due_date")} />
          </div>
          <div>
            <label className="label-field">Hora</label>
            <Input type="time" {...register("due_time")} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="h-4 w-4 rounded accent-brand-blue" {...register("reminder")} />
          Activar recordatorio
        </label>

        <Button type="submit" loading={isSubmitting} className="w-full">
          {initial ? "Guardar cambios" : "Crear tarea"}
        </Button>
      </form>
    </Modal>
  );
}
