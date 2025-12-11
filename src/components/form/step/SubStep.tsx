import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import StepInput from "./StepInput";
import { Step } from "../types";

interface SubStepProps {
  step: Step;
  value: string | number;
  onChange: (stepId: number, value: string | number, optionId?: number) => void;
  valuesMap?: Record<number, string | number>;
  isMobile?: boolean;
}

const SubStep: React.FC<SubStepProps> = ({
  step,
  value,
  onChange,
  valuesMap = {},
  isMobile = false,
}) => {
  const theme = useTheme();
  const isInlineInput =
    step.input_type === "text" || step.input_type === "number";

  return (
    <Box
      sx={{
        mt: isMobile ? 0.5 : 0.8,
        p: isMobile ? 0.3 : 0.5,
        borderRadius: isMobile ? 1 : 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        display: isInlineInput ? "flex" : "block",
        alignItems: isInlineInput ? "center" : "stretch",
        gap: isInlineInput ? (isMobile ? 1 : 2) : 1,
        pr: isMobile ? 0.5 : 1,
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        fontSize={isMobile ? "12px" : "14px"}
        sx={{
          flexShrink: 0,
          width: isInlineInput ? (isMobile ? "50%" : "57%") : "100%",
          color: theme.palette.text.primary,
          mb: isInlineInput ? 0 : (isMobile ? 0.3 : 0.5),
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        {step.step_name}
      </Typography>

      <Box
        sx={{
          flexGrow: isInlineInput ? 1 : 0,
          width: isInlineInput ? (isMobile ? "50%" : "43%") : "100%",
        }}
      >
        <StepInput
          step={step}
          value={value}
          onChange={(val, optionId) => onChange(step.id, val, optionId)}
          isSubstep
          label={!isInlineInput ? step.step_name : undefined}
          isMobile={isMobile}
        />
      </Box>

      {(step.substeps || [])
        .sort((a, b) => a.order - b.order)
        .map((sub) => (
          <SubStep
            key={sub.id}
            step={sub}
            value={valuesMap[sub.id] || ""}
            onChange={onChange}
            valuesMap={valuesMap}
            isMobile={isMobile}
          />
        ))}
    </Box>
  );
};

export default SubStep;