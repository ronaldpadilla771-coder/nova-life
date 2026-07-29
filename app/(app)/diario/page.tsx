"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Heart } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/journal/mood-selector";
import { createClient } from "@/lib/supabase/client";
import { journalSchema, type JournalInput } from "@/lib/validations";
import { formatDate, moodEmoji, todayISO } from "@/lib/utils";
import type { JournalEntry } from "@/types/database";

export default function DiarioPage() {
  const supabase = createClient();
  const [history, setHistory] = useState<JournalEntry[]>([]);
  const [saved, setSaved] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<JournalInput>({
    resolver: zodResolver(journalSchema),
    defaultValues: { entry_date: todayISO(), mood: "bien", content: "", learnings: "", gratitude: "" },
  });

  const loadData = async () => {
    const { data: today } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("entry_date", todayISO())
      .maybeSingle();

    if (today) {
      reset({
        entry_date: today.entry_date,
        mood: today.mood,
        content: today.content ?? "",
        learnings: today.learnings ?? "",
        gratitude: today.gratitude ?? "",
      });
    }

    const { data: past } = await supabase
      .from("journal_entries")
      .select("*")
      .order("entry_date", { ascending: false })
      .limit(14);
    setHistory(past ?? []);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: JournalInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("journal_entries").upsert(
      {
        user_id: user.id,
        entry_date: todayISO(),
        mood: values.mood,
        content: values.content || null,
        learnings: values.learnings || null,
        gratitude: values.gratitude || null,
      },
      { onConflict: "user_id,entry_date" }
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    await loadData();
  };

  return (
    <div>
      <Topbar title="Diario" />
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-purple" />
                Entrada de hoy · <span className="capitalize font-normal text-muted">{formatDate(new Date())}</span>
              </CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label-field">¿Cómo te sientes hoy?</label>
                <Controller
                  control={control}
                  name="mood"
                  render={({ field }) => <MoodSelector value={field.value} onChange={field.onChange} />}
                />
              </div>

              <div>
                <label className="label-field">¿Qué ha pasado hoy?</label>
                <Textarea placeholder="Escribe libremente sobre tu día..." {...register("content")} />
              </div>

              <div>
                <label className="label-field flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Aprendizajes
                </label>
                <Textarea placeholder="¿Qué aprendiste hoy?" {...register("learnings")} />
              </div>

              <div>
                <label className="label-field flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5" /> Agradecimientos
                </label>
                <Textarea placeholder="¿Por qué estás agradecido hoy?" {...register("gratitude")} />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" loading={isSubmitting}>
                  Guardar entrada
                </Button>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-brand-green"
                  >
                    Guardado ✓
                  </motion.span>
                )}
              </div>
            </form>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial reciente</CardTitle>
          </CardHeader>
          {history.length === 0 ? (
            <p className="text-sm text-muted">Aún no hay entradas anteriores.</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted">
                    <span className="capitalize">{formatDate(entry.entry_date, { weekday: "short", day: "numeric", month: "short" })}</span>
                    <span>{moodEmoji(entry.mood)}</span>
                  </div>
                  {entry.content && <p className="line-clamp-2 text-sm text-muted">{entry.content}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
