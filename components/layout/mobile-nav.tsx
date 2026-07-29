"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Repeat,
  CheckSquare,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/objetivos", label: "Metas", icon: Target },
  { href: "/habitos", label: "Hábitos", icon: Repeat },
  { href: "/tareas", label: "Tareas", icon: CheckSquare },
  { href: "/finanzas", label: "Finanzas", icon: Wallet },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="glass-strong fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/[0.06] px-2 py-2 md:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-colors",
              active ? "text-brand-blue" : "text-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
