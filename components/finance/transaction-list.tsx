"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types/database";

const TYPE_COLOR: Record<string, string> = {
  ingreso: "#22C55E",
  gasto: "#EF4444",
  ahorro: "#8B5CF6",
};

const TYPE_SIGN: Record<string, string> = {
  ingreso: "+",
  gasto: "-",
  ahorro: "+",
};

export function TransactionList({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos recientes</CardTitle>
      </CardHeader>

      {transactions.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Todavía no registraste movimientos.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium capitalize">{t.category}</p>
                <p className="text-xs text-muted">
                  {formatDate(t.occurred_on, { weekday: undefined, day: "numeric", month: "short" })}
                  {t.description ? ` · ${t.description}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: TYPE_COLOR[t.type] }}>
                  {TYPE_SIGN[t.type]}
                  {formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => onDelete(t.id)}
                  className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
