"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DashboardStat } from "../types";

export function StatCard({ stat }: { stat: DashboardStat }) {
  const isUp = stat.trend === "up";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight">
          {stat.value}
        </span>
        <span
          className={
            isUp
              ? "rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
              : "rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
          }
        >
          {stat.delta}
        </span>
      </CardContent>
    </Card>
  );
}
