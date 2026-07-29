"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

export function Topbar({ title }: { title: string }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-background/70 px-6 py-4 backdrop-blur-xl">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium capitalize">{formatDate(now)}</p>
        <p className="text-xs text-muted">
          {now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </header>
  );
}
