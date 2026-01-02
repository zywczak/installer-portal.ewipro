import { ChartConfig, FinanceData } from "./financeData";
import { FINANCE_COLORS } from "./financeColors";

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
      colors: [FINANCE_COLORS.LIGHT_RED, FINANCE_COLORS.DARK_RED, FINANCE_COLORS.GREEN],
    };
  }

  return {
    data: [
      { name: "Used", value: spent },
      { name: "Remaining", value: remaining },
    ],
    colors: [FINANCE_COLORS.LIGHT_RED, FINANCE_COLORS.GREEN],
  };
};