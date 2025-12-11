import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, Paper } from "@mui/material";
import FormWrapper from "../form/FormWrapper";
import ProcessFlow from "../flow/ProcessFlow";
import MultiStepForm from "../form/MultiStepForm";
import ResultsTable from "../result/ResultsTable";
import HousePreview from "../preview/HousePreview";
import Loading from "../flow/Loading";
import { StepsResponse } from "../form/types";

const Form: React.FC = () => {
  const [stepsData, setStepsData] = useState<StepsResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [skipStepIds, ] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  
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
    values: Record<string, string | number | Record<string, any>>,
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

  return (
    <FormWrapper onMobileChange={setIsMobileView}>  
       <Card sx={{ border: "1px solid #e0e0e0", p: 2, width: '100%', boxSizing: 'border-box', borderRadius: 3 }}>  
        <ProcessFlow currentStep={currentStep} totalSteps={parentSteps.length} />
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobileView ? "column" : "row",
            gap: isMobileView ? 1 : 2,
            mt: isMobileView ? 1 : 2,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          <MultiStepForm
            currentStep={currentStep}
            totalSteps={parentSteps.length}
            parentStep={parentStep}
            skipStepIds={skipStepIds}
            onNext={handleNext}
            onPrev={handlePrev}
            onOptionChange={handleOptionChange}
            isMobile={isMobileView}
          />

          {currentStep === parentSteps.length - 1 ? (
            <ResultsTable isMobile={isMobileView} />
          ) : (
            <HousePreview
              selectedOptions={selectedOptions.filter((optId) => {
                const stepOfOption = stepsData.steps.find(step =>
                  step.options?.some(o => o.id === optId)
                );
                return stepOfOption && parentSteps
                  .slice(0, currentStep + 1)
                  .some(ps => ps.id === stepOfOption.id);
              })}
              colour={
                (() => {
                  const fifthOptionId = selectedOptions.find(optId => {
                    const step = stepsData.steps.find(s => s.options?.some(o => o.id === optId));
                    return step?.options?.some(o => o.id === optId && step.input_type === "colour");
                  });
                  const fifthOption = stepsData.steps
                    .flatMap(s => s.options || [])
                    .find(o => o.id === fifthOptionId);
                  return fifthOption?.json_value || "white";
                })()
              }
              isMobile={isMobileView}
            />
          )}
        </Box>
      </Card>
    </FormWrapper>
  );
};

export default Form;