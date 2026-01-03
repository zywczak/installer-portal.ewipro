import React from 'react';
import { Box } from '@mui/material';
import ProcessStep from './ProcessStep';
import { FormStep } from '../../../data/steps/stepsData';

interface ProcessFlowProps {
  currentStep: number;
  totalSteps: number;
  steps: FormStep[];
  onStepClick: (stepIndex: number) => void;
  completedSteps: Set<number>;
  isCurrentStepComplete: boolean;
  isCurrentStepRequired: boolean;
  selectedOptions: number[];
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({ currentStep, totalSteps, steps, onStepClick, completedSteps, isCurrentStepComplete, isCurrentStepRequired, selectedOptions }) => {
  // Funkcja sprawdzająca czy krok jest skipowany
  const isStepSkipped = (stepIndex: number) => {
    const step = steps[stepIndex];
    return steps
      .slice(0, stepIndex)
      .some(prevStep =>
        prevStep.conditions?.some(cond =>
          cond.skip_steps.includes(step.id) &&
          selectedOptions.includes(cond.trigger_option)
        )
      );
  };
  
  // Znajdź pierwszy nieukończony wymagany krok (pomijając skipowane)
  let firstIncompleteRequiredStep = totalSteps;
  for (let i = 0; i < totalSteps; i++) {
    const step = steps[i];
    const isRequired = step.required !== false;
    const isCompleted = completedSteps.has(i);
    const isCurrent = i === currentStep;
    const isSkipped = isStepSkipped(i);
    
    // Pomijamy skipowane kroki
    if (isSkipped) continue;
    
    if (isRequired && !isCompleted && !isCurrent) {
      firstIncompleteRequiredStep = i;
      break;
    }
  }
  
  const processSteps = Array.from({ length: totalSteps }, (_, i) => {
    let status: "disabled" | "enabled" | "current" | "clickable" = "disabled";
    const isSkipped = isStepSkipped(i);
    
    // Skipowane kroki są zawsze disabled
    if (isSkipped) {
      status = "disabled";
    } else if (i < currentStep) {
      status = "enabled";
    } else if (i === currentStep) {
      status = "current";
    } else if (i > currentStep) {
      // Dla kroków po aktualnym - sprawdź czy można do nich przejść
      // Znajdź pierwszy nie-skipowany krok po current
      let nextNonSkippedStep = currentStep + 1;
      while (nextNonSkippedStep < totalSteps && isStepSkipped(nextNonSkippedStep)) {
        nextNonSkippedStep++;
      }
      
      // Jeśli to jest pierwszy nie-skipowany krok po current
      if (i === nextNonSkippedStep) {
        // Clickable jeśli aktualny jest ukończony LUB nie jest wymagany
        if (isCurrentStepComplete || !isCurrentStepRequired) {
          status = "clickable";
        }
      } else if (i > nextNonSkippedStep && i <= firstIncompleteRequiredStep) {
        // Pozostałe kroki clickable do pierwszego nieukończonego wymaganego
        status = "clickable";
      }
    }

    return {
      order: i + 1,
      status,
      stepName: steps[i]?.step_name || '',
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
      {processSteps.map((step) => (
        <Box key={step.order} sx={{ mx: 1 }}>
          <ProcessStep
            order={step.order}
            status={step.status}
            stepName={step.stepName}
            onClick={() => onStepClick(step.order - 1)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProcessFlow;
