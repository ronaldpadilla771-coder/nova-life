"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { getRandomQuote } from "@/lib/quotes";

function getGreeting(hour: number) {
  if (hour < 6) return "Buenas noches";
  if (hour < 12) return "Buenos días";
  if (hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function GreetingCard({ name }: { name: string }) {
  const [quote, setQuote] = useState("");
  const [greeting, setGreeting] = useState("Hola");

  useEffect(() => {
    setQuote(getRandomQuote());
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card card-hover relative overflow-hidden p-6"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <p className="text-sm text-muted">{greeting},</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{name} 👋</h2>
      {quote && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-brand-purple" />
          <p className="text-sm italic text-muted">{quote}</p>
        </div>
      )}
    </motion.div>
  );
}
