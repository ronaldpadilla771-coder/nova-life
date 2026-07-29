"use client";

import { cn } from "@/lib/utils";
import type { Mood } from "@/types/database";

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "genial", emoji: "😄", label: "Genial" },
  { value: "bien", emoji: "🙂", label: "Bien" },
  { value: "normal", emoji: "😐", label: "Normal" },
  { value: "mal", emoji: "🙁", label: "Mal" },
  { value: "terrible", emoji: "😞", label: "Terrible" },
];

export function MoodSelector({ value, onChange }: { value: Mood; onChange: (m: Mood) => void }) {
  return (
    <div className="flex justify-between gap-2">
      {MOODS.map((m) => (
        <button
          type="button"
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 text-xs font-medium transition-all",
            value === m.value
              ? "border-brand-purple/50 bg-brand-purple/10 text-foreground"
              : "border-white/[0.06] bg-white/[0.02] text-muted hover:bg-white/[0.05]"
          )}
        >
          <span className="text-xl">{m.emoji}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}
