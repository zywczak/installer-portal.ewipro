import { ChartConfig, FinanceData } from "./financeData";

export const calculateChartData = (data: FinanceData): ChartConfig => {
  const remaining = Number.parseFloat(data.remainingLimit);
  const spent = Number.parseFloat(data.outstandingBalance);
  const overdueAmount = Number.parseFloat(data.overdueBalance);

  if (overdueAmount > 0) {
    const usedWithoutOverdue = Math.max(0, spent - overdueAmount);
    return {
      data: [
        { name: "Used", value: usedWithoutOverdue },
        { name: "Overdue", value: overdueAmount },
        { name: "Remaining", value: remaining },
      ],
      colors: ["#EF5350", "#D32F2F", "#4CAF50"],
    };
  }

  return {
    data: [
      { name: "Used", value: spent },
      { name: "Remaining", value: remaining },
    ],
    colors: ["#EF5350", "#4CAF50"],
  };
};