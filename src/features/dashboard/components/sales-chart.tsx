"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { SalesPoint } from "../types";

export function SalesChart({ data }: { data: SalesPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>销售趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#FFB84D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#revenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
