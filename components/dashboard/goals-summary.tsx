import Link from "next/link";
import { Target, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Goal } from "@/types/database";

export function GoalsSummary({ goals }: { goals: Goal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand-blue" />
          Objetivos principales
        </CardTitle>
        <Link href="/objetivos" className="btn-ghost text-xs">
          Ver todos <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      {goals.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          Aún no tienes objetivos. Crea el primero desde la sección Objetivos.
        </p>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const pct = Math.min(
              100,
              Math.round((goal.current_value / (goal.target_value || 1)) * 100)
            );
            return (
              <div key={goal.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-muted">{pct}%</span>
                </div>
                <Progress value={pct} color={goal.color} />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
