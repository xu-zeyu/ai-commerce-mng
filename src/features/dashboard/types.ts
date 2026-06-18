export interface DashboardStat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

export interface SalesPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface DashboardOverview {
  stats: DashboardStat[];
  sales: SalesPoint[];
}
