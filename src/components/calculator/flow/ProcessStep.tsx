import React from "react";
import { Box, Typography } from "@mui/material";

type StepStatus = "disabled" | "enabled" | "current";

interface ProcessStepProps {
  order: number;
  status: StepStatus;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ order, status }) => {
  const getColorStyles = (status: StepStatus) => {
    switch (status) {
      case "enabled":
        return {
          bg: "#8B959A",
          text: "#ffffff",
          border: "none",
        };
      case "current":
        return {
          bg: "#438E44",
          text: "#ffffff",
          border: "none",
        };
      case "disabled":
      default:
        return {
          bg: "#EEEEEE",
          text: "#c4c4c4",
          border: "2px solid #ffffff",
        };
    }
  };

  const colors = getColorStyles(status);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: colors.bg,
        color: colors.text,
        boxSizing: "border-box",
        border: "2px solid #ffffff",
        flexShrink: 0,
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
            fontWeight: "700",
            fontSize: "16px",
            lineHeight: 1 
        }}
      >
        {order}
      </Typography>
    </Box>
  );
};

export default ProcessStep;