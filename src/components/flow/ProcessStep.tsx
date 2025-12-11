import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

type StepStatus = "disabled" | "enabled" | "current";

interface ProcessStepProps {
  order: number;
  status: StepStatus;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ order, status }) => {
  const theme = useTheme();

  const getColorStyles = (status: StepStatus) => {
    switch (status) {
      case "disabled":
        return {
          bg: "#f5f5f5",
          text: "#bdbdbd",
          border:"#e0e0e0",
        };
      case "enabled":
        return {
          bg: "#DCF5DF",
          text: "#54A852",
          border: "#54A852",
        };
      case "current":
        return {
          bg: theme.palette.secondary.main,
          text: theme.palette.secondary.contrastText,
          border: theme.palette.secondary.dark,
        };
    }
  };

  const colors = getColorStyles(status);

  return (
    <Box sx={{ position: "relative",}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 20,
          bgcolor: colors.bg,
          color: colors.text,
          borderBottom: `2px solid ${colors.border}`,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {order}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProcessStep;
