"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export interface WeeklyPoint {
  day: string;
  habitos: number;
  tareas: number;
}

export function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-brand-blue" />
          Progreso semanal
        </CardTitle>
      </CardHeader>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHabitos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTareas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis dataKey="day" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181B",
                border: "1px solid #27272A",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "#FAFAFA" }}
            />
            <Area
              type="monotone"
              dataKey="habitos"
              name="Hábitos"
              stroke="#22C55E"
              fill="url(#colorHabitos)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="tareas"
              name="Tareas"
              stroke="#3B82F6"
              fill="url(#colorTareas)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
