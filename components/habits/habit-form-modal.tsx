"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { habitSchema, type HabitInput } from "@/lib/validations";
import type { Habit } from "@/types/database";

const ICONS = ["✨", "💪", "📚", "🧘", "💧", "🏃", "🥗", "😴", "🎯", "🧠"];
const COLORS = ["#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

export function HabitFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: HabitInput) => Promise<void>;
  initial?: Habit | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: { icon: "✨", color: COLORS[0], frequency: "diario", target_days_per_week: 7 },
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              name: initial.name,
              icon: initial.icon,
              color: initial.color,
              frequency: initial.frequency,
              target_days_per_week: initial.target_days_per_week,
            }
          : { name: "", icon: "✨", color: COLORS[0], frequency: "diario", target_days_per_week: 7 }
      );
    }
  }, [open, initial, reset]);

  const icon = watch("icon");
  const color = watch("color");

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar hábito" : "Nuevo hábito"}>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
        className="space-y-4"
      >
        <div>
          <label className="label-field">Nombre</label>
          <Input placeholder="Ej. Meditar 10 minutos" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label-field">Icono</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((i) => (
              <button
                type="button"
                key={i}
                onClick={() => setValue("icon", i)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-base transition-colors"
                style={{
                  borderColor: icon === i ? "#FAFAFA" : "rgba(255,255,255,0.08)",
                  background: icon === i ? "rgba(255,255,255,0.08)" : "transparent",
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Frecuencia</label>
            <Select {...register("frequency")}>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
            </Select>
          </div>
          <div>
            <label className="label-field">Días por semana</label>
            <Input type="number" min={1} max={7} {...register("target_days_per_week")} />
          </div>
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
                  borderColor: color === c ? "#FAFAFA" : "transparent",
                  transform: color === c ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          {initial ? "Guardar cambios" : "Crear hábito"}
        </Button>
      </form>
    </Modal>
  );
}
