"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { goalSchema, type GoalInput } from "@/lib/validations";
import type { Goal } from "@/types/database";

const COLORS = ["#3B82F6", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444"];

export function GoalFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: GoalInput) => Promise<void>;
  initial?: Goal | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      term: "mensual",
      color: COLORS[0],
      current_value: 0,
      target_value: 100,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              title: initial.title,
              description: initial.description ?? "",
              category: initial.category ?? "",
              term: initial.term,
              target_value: initial.target_value,
              current_value: initial.current_value,
              color: initial.color,
              due_date: initial.due_date ?? "",
            }
          : {
              title: "",
              description: "",
              category: "",
              term: "mensual",
              target_value: 100,
              current_value: 0,
              color: COLORS[0],
              due_date: "",
            }
      );
    }
  }, [open, initial, reset]);

  const selectedColor = watch("color");

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar objetivo" : "Nuevo objetivo"}>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
        className="space-y-4"
      >
        <div>
          <label className="label-field">Título</label>
          <Input placeholder="Ej. Correr una media maratón" {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label-field">Descripción</label>
          <Textarea placeholder="Detalles de tu objetivo (opcional)" {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Plazo</label>
            <Select {...register("term")}>
              <option value="anual">Anual</option>
              <option value="mensual">Mensual</option>
              <option value="semanal">Semanal</option>
            </Select>
          </div>
          <div>
            <label className="label-field">Categoría</label>
            <Input placeholder="Salud, carrera..." {...register("category")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Progreso actual</label>
            <Input type="number" step="any" {...register("current_value")} />
          </div>
          <div>
            <label className="label-field">Meta</label>
            <Input type="number" step="any" {...register("target_value")} />
            {errors.target_value && (
              <p className="mt-1 text-xs text-danger">{errors.target_value.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label-field">Fecha límite</label>
          <Input type="date" {...register("due_date")} />
        </div>

        <div>
          <label className="label-field">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setValue("color", c)}
                className="h-8 w-8 rounded-full border-2 transition-transform"
                style={{
                  backgroundColor: c,
                  borderColor: selectedColor === c ? "#FAFAFA" : "transparent",
                  transform: selectedColor === c ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          {initial ? "Guardar cambios" : "Crear objetivo"}
        </Button>
      </form>
    </Modal>
  );
}
