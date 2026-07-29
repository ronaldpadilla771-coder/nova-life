"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { transactionSchema, type TransactionInput } from "@/lib/validations";
import { todayISO } from "@/lib/utils";

export function TransactionFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionInput) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "gasto", occurred_on: todayISO() },
  });

  useEffect(() => {
    if (open) reset({ type: "gasto", occurred_on: todayISO(), category: "", amount: undefined, description: "" });
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Nuevo movimiento">
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
        className="space-y-4"
      >
        <div>
          <label className="label-field">Tipo</label>
          <Select {...register("type")}>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
            <option value="ahorro">Ahorro</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Categoría</label>
            <Input placeholder="Nómina, ocio..." {...register("category")} />
            {errors.category && <p className="mt-1 text-xs text-danger">{errors.category.message}</p>}
          </div>
          <div>
            <label className="label-field">Cantidad (€)</label>
            <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
            {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-field">Fecha</label>
          <Input type="date" {...register("occurred_on")} />
        </div>

        <div>
          <label className="label-field">Descripción</label>
          <Input placeholder="Opcional" {...register("description")} />
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          Guardar movimiento
        </Button>
      </form>
    </Modal>
  );
}
