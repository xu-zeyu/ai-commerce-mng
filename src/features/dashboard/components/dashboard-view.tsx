import { StatCard } from "./stat-card";
import { SalesChart } from "./sales-chart";
import type { DashboardOverview } from "../types";

export function DashboardView({ data }: { data: DashboardOverview }) {
  return (
    <div className="mx-auto flex max-w-6xl animate-fade-in flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">概览</h1>
        <p className="text-sm text-muted-foreground">
          金晗跨境电商 · 经营数据一览
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <SalesChart data={data.sales} />
    </div>
  );
}
