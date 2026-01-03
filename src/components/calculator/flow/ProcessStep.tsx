import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";


type StepStatus = "disabled" | "enabled" | "current" | "clickable";

interface ProcessStepProps {
  order: number;
  status: StepStatus;
  stepName?: string;
  onClick: () => void;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ order, status, stepName, onClick }) => {
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
      case "clickable":
        return {
          bg: "#D0D0D0",
          text: "#666666",
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

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Tooltip title={stepName ? stripHtml(stepName) : ""} arrow>
    <Box
      onClick={status === "enabled" || status === "clickable" ? onClick : undefined}
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
        cursor: (status === "enabled" || status === "clickable") ? "pointer" : "default",
        transition: "transform 0.2s ease",
        '&:hover': (status === "enabled" || status === "clickable") ? {
          transform: "scale(1.1)",
        } : {},
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
    </Tooltip>
  );
};

export default ProcessStep;