import React from "react";
import { Box } from "@mui/material";
import DesktopStageStep from "./DesktopStageStep";

interface Stage {
  id?: number;
  stageNo?: number;
  stageName: string;
  stageNameShort: string;
}

interface StageDesktopProps {
  stages: Stage[];
  currentStage: number;
  projectMaxStage?: number;
  projectStatusName?: string;
}

export const StageDesktop: React.FC<StageDesktopProps> = ({
  stages,
  currentStage,
  projectMaxStage,
  projectStatusName,
}) => {
  const handleSubmitStage = () => console.log("Submit stage:", currentStage);

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      gap={1}
      mt={2}
      width="calc(100% - 38px)"
    >
      {stages.map((stage, index) => (
        <DesktopStageStep
          key={stage.id || `stage-${index}`}
          stage={stage}
          index={index}
          totalStages={stages.length}
          currentStage={currentStage}
          projectMaxStage={projectMaxStage}
          projectStatusName={projectStatusName}
          onSubmit={handleSubmitStage}
        />
      ))}
    </Box>
  );
};
