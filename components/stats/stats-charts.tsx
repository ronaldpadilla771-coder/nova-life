"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const TOOLTIP_STYLE = {
  backgroundColor: "#18181B",
  border: "1px solid #27272A",
  borderRadius: 12,
  fontSize: 12,
};

export function HabitCompletionChart({ data }: { data: { name: string; rate: number; color: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumplimiento de hábitos (30 días)</CardTitle>
      </CardHeader>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, "Cumplimiento"]} />
            <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function TasksProductivityChart({ data }: { data: { day: string; completadas: number; pendientes: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productividad semanal</CardTitle>
      </CardHeader>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis dataKey="day" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="completadas" name="Completadas" fill="#22C55E" radius={[6, 6, 0, 0]} />
            <Bar dataKey="pendientes" name="Pendientes" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function GoalsStatusChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivos por estado</CardTitle>
      </CardHeader>
      {total === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Sin datos suficientes todavía.</p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
