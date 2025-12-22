import React from 'react';
import { Box } from '@mui/material';
import ProcessStep from './ProcessStep';

interface ProcessFlowProps {
  currentStep: number;
  totalSteps: number;
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => {
    let status: "disabled" | "enabled" | "current" = "disabled";
    if (i < currentStep) status = "enabled";
    else if (i === currentStep) status = "current";

    return {
      order: i + 1,
      status,
    };
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(to bottom, #EEEEEE 0%, #EEEEEE 50%, transparent 50%, transparent 100%)`,
        pr: "54px",
        py: "26px",
        pl: "272px",
      }}
    >
      {steps.map((step) => (
        <Box key={step.order} sx={{ mx: 1 }}>
          <ProcessStep
            order={step.order}
            status={step.status}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProcessFlow;
