import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...opts,
  }).format(d);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function priorityColor(priority: "alta" | "media" | "baja") {
  switch (priority) {
    case "alta":
      return "#EF4444";
    case "media":
      return "#F59E0B";
    default:
      return "#22C55E";
  }
}

export function moodEmoji(mood: string) {
  const map: Record<string, string> = {
    genial: "😄",
    bien: "🙂",
    normal: "😐",
    mal: "🙁",
    terrible: "😞",
  };
  return map[mood] ?? "🙂";
}
