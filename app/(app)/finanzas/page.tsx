"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Landmark } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { FinanceSummary } from "@/components/finance/finance-summary";
import { TransactionList } from "@/components/finance/transaction-list";
import { TransactionFormModal } from "@/components/finance/transaction-form-modal";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import type { Transaction, FinancialGoal } from "@/types/database";
import type { TransactionInput } from "@/lib/validations";

export default function FinanzasPage() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financialGoal, setFinancialGoal] = useState<FinancialGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: "", target_amount: "" });

  const loadData = async () => {
    const [{ data: tx }, { data: goal }] = await Promise.all([
      supabase.from("transactions").select("*").order("occurred_on", { ascending: false }).limit(50),
      supabase.from("financial_goals").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    setTransactions(tx ?? []);
    setFinancialGoal(goal ?? null);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: TransactionInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("transactions").insert({
      ...values,
      description: values.description || null,
      user_id: user.id,
    });
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id);
    await loadData();
  };

  const handleCreateGoal = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !goalForm.title || !goalForm.target_amount) return;
    await supabase.from("financial_goals").insert({
      user_id: user.id,
      title: goalForm.title,
      target_amount: Number(goalForm.target_amount),
      current_amount: 0,
    });
    setGoalForm({ title: "", target_amount: "" });
    await loadData();
  };

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "ingreso").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "gasto").reduce((s, t) => s + t.amount, 0);
    const savings = transactions.filter((t) => t.type === "ahorro").reduce((s, t) => s + t.amount, 0);
    return { income, expenses, savings };
  }, [transactions]);

  return (
    <div>
      <Topbar title="Finanzas" />
      <div className="space-y-6 p-6">
        {loading ? (
          <p className="text-sm text-muted">Cargando finanzas...</p>
        ) : (
          <>
            <FinanceSummary {...totals} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4 flex justify-end">
                  <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Nuevo movimiento
                  </Button>
                </div>
                <TransactionList transactions={transactions} onDelete={handleDelete} />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-brand-blue" />
                    Meta económica
                  </CardTitle>
                </CardHeader>

                {financialGoal ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">{financialGoal.title}</p>
                    <Progress
                      value={(financialGoal.current_amount / (financialGoal.target_amount || 1)) * 100}
                      color="#3B82F6"
                    />
                    <p className="text-xs text-muted">
                      {formatCurrency(financialGoal.current_amount)} de {formatCurrency(financialGoal.target_amount)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">Define una meta de ahorro para hacer seguimiento.</p>
                    <Input
                      placeholder="Ej. Fondo de emergencia"
                      value={goalForm.title}
                      onChange={(e) => setGoalForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Cantidad objetivo (€)"
                      value={goalForm.target_amount}
                      onChange={(e) => setGoalForm((f) => ({ ...f, target_amount: e.target.value }))}
                    />
                    <Button onClick={handleCreateGoal} className="w-full">
                      Crear meta
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>

      <TransactionFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
