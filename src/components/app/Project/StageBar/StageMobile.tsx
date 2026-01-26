import React, { useState } from "react";
import { Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { fallbackColors, stageColors } from "../../../common/colors";

interface Stage {
  id?: number;
  stageNo?: number;
  stageName: string;
  stageNameShort: string;
}

interface StageMobileProps {
  stages: Stage[];
  currentStage: number;
  projectMaxStage?: number;
  projectStatusName?: string;
}

const StageMobile: React.FC<StageMobileProps> = ({
  stages,
  currentStage,
  projectMaxStage,
  projectStatusName,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);

  const handleStageClick = (index: number) =>
    setSelectedStageIndex((prev) => (prev === index ? null : index));

  const handleSubmitStage = () => console.log("Submit stage", currentStage);

  return (
    <Box width="100%" mt={2}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        {stages.map((stage, index) => {
          const color = stageColors[index + 1] ?? fallbackColors;
          const nextColor = stageColors[index + 2] ?? color;
          const isCompleted = index + 1 < currentStage;
          const isActive = index + 1 === currentStage;

          return (
            <React.Fragment key={index}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={42}
                height={42}
                borderRadius="50%"
                bgcolor={isActive || isCompleted ? color.bg : color.inactiveBg}
                color={isActive || isCompleted ? color.color : color.inactiveColor}
                fontSize={16}
                fontWeight="bold"
                border={`3px solid ${isActive || isCompleted ? color.border : color.inactiveBorder}`}
                sx={{ flexShrink: 0, cursor: "pointer" }}
                onClick={() => handleStageClick(index)}
              >
                {isCompleted ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : index + 1}
              </Box>

              {index < stages.length - 1 && (
                <Box
                  flexGrow={1}
                  height={5}
                  sx={{
                    background: `linear-gradient(to right, ${color.border}, ${nextColor.inactiveBorder})`,
                    borderRadius: 2,
                    marginLeft: "-18px",
                    marginRight: "-18px",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {selectedStageIndex !== null && (() => {
        const color = stageColors[selectedStageIndex + 1] ?? fallbackColors;
        const isCompleted = selectedStageIndex + 1 < currentStage;
        const isActive = selectedStageIndex + 1 === currentStage;

        const bg = isActive || isCompleted ? color.bg : color.inactiveBg;
        const border = isActive || isCompleted ? color.border : color.inactiveBorder;
        const fontColor = isActive || isCompleted ? color.color : color.inactiveColor;

        return (
          <Box p={2} mt={2} borderRadius={2} bgcolor={bg} color={fontColor} border={`1px solid ${border}`}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Box fontWeight="bold">
                Stage {stages[selectedStageIndex].stageNo || selectedStageIndex + 1}
              </Box>
              <Box sx={{ cursor: "pointer", fontWeight: "bold", fontSize: 16 }} onClick={() => setSelectedStageIndex(null)}>
                ✕
              </Box>
            </Box>
            <Box fontWeight="bold" mb={0.5}>{stages[selectedStageIndex].stageNameShort}</Box>
            <Box>{stages[selectedStageIndex].stageName}</Box>
          </Box>
        );
      })()}

      {currentStage <= stages.length &&
        !(projectMaxStage && currentStage > projectMaxStage) &&
        projectStatusName !== "Closed" && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Box
              onClick={handleSubmitStage}
              sx={{
                bgcolor: "#43a047",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "25px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
              }}
            >
              SUBMIT STAGE {currentStage}
            </Box>
          </Box>
        )}
    </Box>
  );
};

export default StageMobile;
