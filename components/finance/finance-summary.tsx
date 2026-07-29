import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function FinanceSummary({
  income,
  expenses,
  savings,
}: {
  income: number;
  expenses: number;
  savings: number;
}) {
  const balance = income - expenses;

  const items = [
    { label: "Ingresos", value: income, icon: ArrowUpCircle, color: "#22C55E" },
    { label: "Gastos", value: expenses, icon: ArrowDownCircle, color: "#EF4444" },
    { label: "Ahorros", value: savings, icon: PiggyBank, color: "#8B5CF6" },
    { label: "Balance", value: balance, icon: Wallet, color: "#3B82F6" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="card-hover">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted">
            <item.icon className="h-4 w-4" style={{ color: item.color }} />
            {item.label}
          </div>
          <p className="text-xl font-semibold" style={{ color: item.color }}>
            {formatCurrency(item.value)}
          </p>
        </Card>
      ))}
    </div>
  );
}
