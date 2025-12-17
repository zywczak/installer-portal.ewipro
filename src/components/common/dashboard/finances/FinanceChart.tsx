import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { ChartConfig, FinanceData } from "./financeData";


interface FinanceChartProps {
  data: FinanceData;
  chartConfig: ChartConfig;
}

export const FinanceChart: React.FC<FinanceChartProps> = ({ data, chartConfig }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: 200, height: 200, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartConfig.data}
            innerRadius="65%"
            outerRadius="95%"
            paddingAngle={1}
            dataKey="value"
            stroke="none"
            strokeWidth={0}
            startAngle={90}
            endAngle={450}
            cornerRadius={6}
          >
            {chartConfig.data.map((entry, index) => (
              <Cell key={index} fill={chartConfig.colors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          £{data.creditLimit}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
          {t("views.dashboard.statements.assumedCreditLimit")}
        </Typography>
      </Box>
    </Box>
  );
};