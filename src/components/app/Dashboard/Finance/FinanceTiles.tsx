import React from "react";
import { Box, Card, CardContent, CircularProgress, useMediaQuery } from "@mui/material";
import Ewistore from "../../../assets/ewistore.svg";
import { useFinanceData } from "./useFinanceData";
import { calculateChartData } from "./chartUtils";
import { FinanceChart } from "./FinanceChart";
import { FinanceLegend } from "./FinanceLegend";

const FinanceTiles: React.FC = () => {
  const { data, loading } = useFinanceData();
  const isWide = useMediaQuery("(min-width:520px)");

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!data || data.hidden) return null;

  const chartConfig = calculateChartData(data);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card
        sx={{
          width: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          px: 2,
          overflow: "visible",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -16,
            left: 16,
            px: 1,
            backgroundColor: "white",
          }}
        >
          <img src={Ewistore} alt="Ewi Store" style={{ height: 32 }} />
        </Box>

        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: isWide ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <FinanceChart data={data} chartConfig={chartConfig} />
            <FinanceLegend data={data} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinanceTiles;