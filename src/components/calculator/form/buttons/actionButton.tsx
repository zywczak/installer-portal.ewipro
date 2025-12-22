import React from "react";
import { Button } from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";

interface ActionButtonProps {
  onClick: () => void;
  variant?: "next" | "prev" | "send" | "nextStep";
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  variant = "next",
  disabled = false,
}) => {
  const isNext = variant === "next";
  const isPrev = variant === "prev";
  const isSend = variant === "send";
  const isNextStep = variant === "nextStep";

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: disabled ? "#BDBDBD" : "#438E44",
        width: isNextStep ? "202px" : "99px",
        borderRadius: "999px",
        textTransform: "none",
        fontSize: "16px",
        fontWeight: 700,
        boxShadow: "none",
        color: "#fff",
        "&.Mui-disabled": {
          backgroundColor: "#BDBDBD",
          color: "#fff",
          opacity: 0.7,
        },
      }}
      startIcon={
        isPrev ? <ArrowCircleLeftOutlinedIcon sx={{ fontSize: 20 }} /> : undefined
      }
      endIcon={
        isNext || isNextStep
          ? <ArrowCircleRightOutlinedIcon sx={{ fontSize: 20 }} />
          : undefined
      }
    >
      {isPrev && "Prev"}
      {isNext && "Next"}
      {isSend && "Send"}
      {isNextStep && "Next step"}
    </Button>
  );
};

export default ActionButton;
