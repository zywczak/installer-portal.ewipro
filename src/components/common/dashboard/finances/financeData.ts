
export interface FinanceData {
  status: boolean;
  overdueBalance: string;
  overduePaymentRequired: boolean;
  overusedCreditPaymentRequired: boolean;
  outstandingBalance: string;
  creditLimit: string;
  remainingLimit: string;
  hidden: boolean;
}

export interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartConfig {
  data: ChartDataItem[];
  colors: string[];
}