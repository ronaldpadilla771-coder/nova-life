import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(2, "El título es demasiado corto").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  category: z.string().max(50).optional().or(z.literal("")),
  term: z.enum(["anual", "mensual", "semanal"]),
  target_value: z.coerce.number().min(1, "Debe ser mayor a 0"),
  current_value: z.coerce.number().min(0).default(0),
  color: z.string().min(4),
  due_date: z.string().optional().or(z.literal("")),
});
export type GoalInput = z.infer<typeof goalSchema>;

export const habitSchema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto").max(60),
  icon: z.string().max(4).default("✨"),
  color: z.string().min(4),
  frequency: z.enum(["diario", "semanal"]),
  target_days_per_week: z.coerce.number().min(1).max(7),
});
export type HabitInput = z.infer<typeof habitSchema>;

export const journalSchema = z.object({
  entry_date: z.string(),
  mood: z.enum(["genial", "bien", "normal", "mal", "terrible"]),
  content: z.string().max(4000).optional().or(z.literal("")),
  learnings: z.string().max(2000).optional().or(z.literal("")),
  gratitude: z.string().max(2000).optional().or(z.literal("")),
});
export type JournalInput = z.infer<typeof journalSchema>;

export const taskSchema = z.object({
  title: z.string().min(2, "El título es demasiado corto").max(150),
  notes: z.string().max(1000).optional().or(z.literal("")),
  priority: z.enum(["alta", "media", "baja"]),
  due_date: z.string().optional().or(z.literal("")),
  due_time: z.string().optional().or(z.literal("")),
  reminder: z.boolean().default(false),
});
export type TaskInput = z.infer<typeof taskSchema>;

export const transactionSchema = z.object({
  type: z.enum(["ingreso", "gasto", "ahorro"]),
  category: z.string().min(2, "Indica una categoría").max(50),
  amount: z.coerce.number().positive("Debe ser mayor a 0"),
  description: z.string().max(300).optional().or(z.literal("")),
  occurred_on: z.string(),
});
export type TransactionInput = z.infer<typeof transactionSchema>;

export const authSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
export type AuthInput = z.infer<typeof authSchema>;

export const registerSchema = authSchema.extend({
  full_name: z.string().min(2, "Introduce tu nombre"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
