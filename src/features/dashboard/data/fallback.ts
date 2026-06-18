import type { DashboardOverview } from "../types";

/** 占位演示数据，后端接口就绪后由 getDashboardOverview 替换。 */
export const DASHBOARD_FALLBACK: DashboardOverview = {
  stats: [
    { label: "今日销售额", value: "¥128,430", delta: "+12.5%", trend: "up" },
    { label: "订单数", value: "1,284", delta: "+8.2%", trend: "up" },
    { label: "客单价", value: "¥99.9", delta: "+3.1%", trend: "up" },
    { label: "退款率", value: "1.8%", delta: "-0.4%", trend: "down" },
  ],
  sales: [
    { month: "1月", revenue: 42000, orders: 420 },
    { month: "2月", revenue: 51000, orders: 480 },
    { month: "3月", revenue: 48000, orders: 460 },
    { month: "4月", revenue: 61000, orders: 590 },
    { month: "5月", revenue: 73000, orders: 690 },
    { month: "6月", revenue: 84000, orders: 760 },
  ],
};
