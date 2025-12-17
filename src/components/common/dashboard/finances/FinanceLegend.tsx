import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FinanceData } from "./financeData";
import { FINANCE_COLORS } from "./financeColors";

interface FinanceLegendProps {
  data: FinanceData;
}

export const FinanceLegend: React.FC<FinanceLegendProps> = ({ data }) => {
  const { t } = useTranslation();

  const remaining = parseFloat(data.remainingLimit);
  const spent = parseFloat(data.outstandingBalance);
  const overdueAmount = parseFloat(data.overdueBalance);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1.5,
      }}
    >
      {/* Remaining Credit Limit */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: FINANCE_COLORS.GREEN,
            borderRadius: "50%",
          }}
        />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            £{remaining.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
            {t("views.dashboard.statements.remainingCreditLimit")}
          </Typography>
        </Box>
      </Box>

      {/* Used (Outstanding Balance) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            backgroundColor: FINANCE_COLORS.LIGHT_RED,
            borderRadius: "50%",
          }}
        />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            £{spent.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
            {t("views.dashboard.statements.outstandingBalance")}
          </Typography>
        </Box>
      </Box>

      {/* Overdue Amount */}
      {overdueAmount > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: FINANCE_COLORS.DARK_RED,
              borderRadius: "50%",
            }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              £{overdueAmount.toFixed(2)}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
              {t("views.dashboard.statements.overdueAmount")}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};