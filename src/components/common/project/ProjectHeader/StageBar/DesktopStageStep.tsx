import React from "react";
import { Box, Typography } from "@mui/material";
import { fallbackColors, stageColors } from "../../../colors";

interface Stage {
  id?: number;
  stageNo?: number;
  stageName: string;
  stageNameShort: string;
}

interface StageStepProps {
  stage: Stage;
  index: number;
  totalStages: number;
  currentStage: number;
  projectMaxStage?: number;
  projectStatusName?: string;
  onSubmit: () => void;
}

const DesktopStageStep: React.FC<StageStepProps> = ({
  stage,
  index,
  totalStages,
  currentStage,
  projectMaxStage,
  projectStatusName,
  onSubmit,
}) => {
  const color = stageColors[index + 1] ?? fallbackColors;

  const isCompleted = index + 1 < currentStage;
  const isActive = index + 1 === currentStage;
  const isLast = index === totalStages - 1;

  const opacity = !isActive && !isCompleted ? 0.35 : 1;
  const scale = !isActive && !isCompleted ? 0.92 : 1;

  const showSubmit =
    isActive &&
    !isLast &&
    !(projectMaxStage && currentStage > projectMaxStage) &&
    projectStatusName !== "Closed";

  return (
    <Box
      sx={{
        flexGrow: 1,
        flexBasis: 0,
        height: "80px",
        position: "relative",
        backgroundColor: color.border,
        boxSizing: "border-box",
        opacity,
        transform: `scale(${scale})`,
        transition: "all 0.3s ease",
        zIndex: totalStages - index,
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 0,
          height: 0,
          borderLeft: `40px solid ${color.border}`,
          borderTop: "40px solid transparent",
          borderBottom: "40px solid transparent",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          right: "-40px",
          bottom: 0,
          width: 0,
          height: 0,
          borderLeft: `40px solid ${color.border}`,
          borderTop: "40px solid transparent",
          borderBottom: "40px solid transparent",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "2px",
          bottom: "2px",
          left: 0,
          right: 0,
          paddingLeft: "40px",
          paddingRight: "1px",
          backgroundColor: color.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            zIndex: 99,
            left: 0,
            bottom: "1px",
            width: 0,
            height: 0,
            borderLeft: "37px solid white",
            borderTop: "37px solid transparent",
            borderBottom: "37px solid transparent",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            right: "-37px",
            bottom: 0,
            width: 0,
            height: 0,
            borderLeft: `38px solid ${color.bg}`,
            borderTop: "38px solid transparent",
            borderBottom: "38px solid transparent",
          },
        }}
      >
        <Box textAlign="center" width="100%">
          <Typography fontWeight="bold" fontSize={13} color={color.color}>
            {isLast ? "" : `Stage ${index + 1}`}
          </Typography>
          <Typography fontWeight="bold" fontSize={18} color={color.color} lineHeight={1}>
            {stage.stageNameShort}
          </Typography>
          <Typography fontSize={11} color={color.color} lineHeight={1}>
            {stage.stageName}
          </Typography>
        </Box>
      </Box>

      {showSubmit && (
        <Box position="absolute" top={-15} right={-10} zIndex={99}>
          <Box
            component="button"
            onClick={onSubmit}
            sx={{
              backgroundColor: "#d9534f",
              border: "0px solid",
              px: 2,
              py: 1,
              color: "white",
              fontFamily: "'Open Sans', sans-serif",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "7px",
              transition: "all 0.2s linear",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#c9302c",
                boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
              },
            }}
          >
            Submit
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DesktopStageStep;
