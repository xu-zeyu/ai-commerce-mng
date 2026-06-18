import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { getDashboardOverview } from "@/features/dashboard/api/get-dashboard-overview";
import { DASHBOARD_FALLBACK } from "@/features/dashboard/data/fallback";

export default async function DashboardPage() {
  // Server First：优先服务端取数，接口未就绪时回退占位数据。
  const data = await getDashboardOverview().catch(() => DASHBOARD_FALLBACK);

  return <DashboardView data={data} />;
}
