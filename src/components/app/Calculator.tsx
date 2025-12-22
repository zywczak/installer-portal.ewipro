import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Card, Paper, Typography } from "@mui/material";
import FormWrapper from "../form/FormWrapper";
import ProcessFlow from "../calculator/flow/ProcessFlow";
import ResultsTable from "../result/ResultsTable";
import HousePreview from "../calculator/HousePreview";
import Loading from "../calculator/Loading";
import { StepsResponse } from "../form/types";
import StepHeader from "../calculator/header/StepHeader";
import EwiproLogo from "../../assets/EWI-Pro-Render-Systems.png";
import Form from "../calculator/form/Form";
import HelpModal from "../calculator/form/help/HelpModal";
import ActionButton from "../calculator/form/buttons/actionButton";
import HelpButton from "../calculator/header/helpButton";

const Calculator: React.FC = () => {
  const [stepsData, setStepsData] = useState<StepsResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [skipStepIds, ] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isMobileView, setIsMobileView] = useState(
  window.innerWidth <= 700
);

useEffect(() => {
  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 700);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const [values, setValues] = useState<Record<number, string | number>>({});
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const [openHelp, setOpenHelp] = useState(false);
  const [helpClickedSteps, setHelpClickedSteps] = useState<Record<number, boolean>>({});
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [isStepComplete, setIsStepComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const handlers = (window as any).__multiStepFormHandlers;
      if (handlers?.isStepComplete !== undefined) {
        setIsStepComplete(handlers.isStepComplete);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  const handleOptionChange = (optionId: number, stepId: number) => {
    setSelectedOptions(prev => {
      const stepOptions = stepsData?.steps.find(s => s.id === stepId)?.options?.map(o => o.id) || [];
      const filtered = prev.filter(opt => !stepOptions.includes(opt));
      return [...filtered, optionId];
    });
  };

  useEffect(() => {
    axios
      .get<StepsResponse>("http://localhost:8000/api/form-steps-with-options/")
      .then((res) => setStepsData(res.data))
      .catch((err) => console.error("Error fetching steps:", err));
  }, []);

  if (!stepsData) return <Loading />;

  const parentSteps = stepsData.steps
    .filter(step => !step.parent)
    .sort((a, b) => a.order - b.order);

  const handleNext = (
    values?: Record<string, string | number | Record<string, any>>,
    triggerStepId?: number,
    selectedOptionId?: number
  ) => {
    let nextStep = currentStep + 1;

    while (nextStep < parentSteps.length) {
      const step = parentSteps[nextStep];

      const shouldSkip = parentSteps
        .slice(0, nextStep)
        .some(prevStep =>
          prevStep.conditions?.some(cond =>
            cond.skip_steps.includes(step.id) &&
            selectedOptions.includes(cond.trigger_option)
          )
        );

      if (!shouldSkip) break;
      nextStep++;
    }

    setCurrentStep(Math.min(nextStep, parentSteps.length - 1));
  };

  const handlePrev = () => {
    let prevStep = currentStep - 1;

    while (prevStep >= 0) {
      const step = parentSteps[prevStep];

      const shouldSkip = parentSteps
        .slice(0, prevStep)
        .some(prevStep2 => 
          prevStep2.conditions?.some(cond =>
            cond.skip_steps.includes(step.id) &&
            selectedOptions.includes(cond.trigger_option)
          )
        );

      if (!shouldSkip) break;
      prevStep--;
    }

    setCurrentStep(Math.max(prevStep, 0));
  };

  const parentStep = parentSteps[currentStep];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === parentSteps.length - 1;

  const handleNextClick = () => {
    const handlers = (window as any).__multiStepFormHandlers;
    if (handlers?.handleNextClick) {
      handlers.handleNextClick();
    }
  };

  const handlePrevClick = () => {
    const handlers = (window as any).__multiStepFormHandlers;
    if (handlers?.handlePrevClick) {
      handlers.handlePrevClick();
    }
  };

  return (
    <>
      <Box sx={{ textAlign: "center", py: "16px" }}>
        <Typography sx={{ fontSize: isMobileView ? "32px" : "48px", fontWeight: "extraLight", mb: "8px" }}>
          Quote smarter.
        </Typography>
        <Typography sx={{  fontSize: isMobileView ? "32px" : "48px", fontWeight: 700 }}>
          Use Material Calculator
        </Typography>
      

      </Box>
      {/* <FormWrapper onMobileChange={setIsMobileView}> */}
       <Card
        ref={cardRef}
        elevation={0}
        sx={{
            position: 'relative',
            m: "auto",
            my: "24px",
            pb: isMobileView ? "24px" : "0px",
            width: isMobileView ? '100%' : '1225px',
            height: isMobileView ? null : '680px',
            boxSizing: 'border-box',
            borderRadius: "20px",
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
        }}
        >
        {isMobileView ? null : <ProcessFlow currentStep={currentStep} totalSteps={parentSteps.length} />}

        <Box
        sx={{
            display: isMobileView ? 'block' : 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: "24px",
            }}
        >
            <StepHeader
                stepIndex={currentStep + 1}
                stepName={parentStep.step_name}
                maxSteps={parentSteps.length}
                helpAvailable={!!parentStep.help?.length}
                onHelpClick={() => {
                    console.log("Help clicked! Opening modal...", parentStep.help);
                    setOpenHelp(true);
                    setHelpClickedSteps((prev) => ({ ...prev, [parentStep.id]: true }));
                }}
                isMobile={isMobileView}
            />
            <Form
                currentStep={currentStep}
                totalSteps={parentSteps.length}
                parentStep={parentStep}
                skipStepIds={skipStepIds}
                onNext={handleNext}
                onPrev={handlePrev}
                onOptionChange={(option) => handleOptionChange(option.id, option.stepId)}
                isMobile={isMobileView}
                values={values}
                setValues={setValues}
                errors={errors}
                setErrors={setErrors}
                selectedOptions={selectedOptions}
                stepsData={stepsData}
            />
        </Box>
        {isMobileView ?
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          px: '24px', 
          mt: '24px' 
        }}>
          <Box sx={{ visibility: isFirstStep ? 'hidden' : 'visible' }}>
            <ActionButton onClick={handlePrevClick} variant="prev" />
          </Box>
          
          <Box sx={{ visibility: !!parentStep.help?.length ? 'visible' : 'hidden' }}>
            <HelpButton 
              helpAvailable={true}
              onHelpClick={() => {
                setOpenHelp(true);
                setHelpClickedSteps((prev) => ({ ...prev, [parentStep.id]: true }));
              }}
            />
          </Box>
          
          <Box>
            {isLastStep ? (
              <ActionButton variant="send" onClick={handleNextClick} disabled={!isStepComplete} />
            ) : (
              <ActionButton onClick={handleNextClick} variant="next" disabled={!isStepComplete} />
            )}
          </Box>
        </Box> : 
        <Box sx={{ display: 'flex', justifyContent: 'flex-end',  mr: "24px", mt: "24px" }}>
            <img 
            src={EwiproLogo} 
            alt="Ewipro Logo" 
            style={{ height: "40px" }} 
            />
        </Box>}
        <HelpModal
          open={openHelp}
          onClose={() => setOpenHelp(false)}
          helpSections={parentStep.help || []}
          isMobile={isMobileView}
          container={cardRef.current}
        />
      </Card>
      {/* </FormWrapper> */}
    </>
  );
};

export default Calculator;