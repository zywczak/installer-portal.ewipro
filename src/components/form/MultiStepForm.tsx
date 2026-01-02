// import React from "react";
// import { Box, Divider, Typography, } from "@mui/material";
// import StepInput from "./step/StepInput";
// import StepNavigation from "./step/StepNavigation";
// import StepHeader from "../calculator/header/StepHeader";
// import SubStep from "./step/SubStep";
// import { Step } from "./types";
// import HelpModal from "../help/HelpModal";

// interface MultiStepFormProps {
//   currentStep: number;
//   totalSteps: number;
//   parentStep: Step;
//   skipStepIds: number[];
//   onNext: (
//     values: Record<string, string | number | Record<string, any>>,
//     triggerStepId?: number,
//     selectedOptionId?: number
//   ) => void;
//   onPrev: () => void;
//   onOptionChange: (optionId: number, stepId: number) => void;
//   isMobile?: boolean;
// }

// const MultiStepForm: React.FC<MultiStepFormProps> = ({
//   currentStep,
//   totalSteps,
//   parentStep,
//   skipStepIds,
//   onNext,
//   onPrev,
//   onOptionChange,
//   isMobile = false,
// }) => {
//   const isFirst = currentStep === 0;
//   const isLast = currentStep === totalSteps - 1;

//   const [errors, setErrors] = React.useState<Record<number, boolean>>({});

//   const [values, setValues] = React.useState<Record<number, string | number>>({});
//   const [jsonValues, setJsonValues] = React.useState<
//     Record<string, string | number | Record<string, any>>
//   >({});
//   const [helpClickedSteps, setHelpClickedSteps] = React.useState<Record<number, boolean>>({});
//   const [openHelp, setOpenHelp] = React.useState(false);

//   const isStepComplete = React.useMemo(() => {
//     const allSteps = [parentStep, ...(parentStep.substeps || [])];
//     return allSteps.every(step => {
//       if (!step.required) return true;
//       return values[step.id] !== undefined && values[step.id] !== "" && !errors[step.id];
//     });
//   }, [values, errors, parentStep]);

//   const handleChange = (stepId: number, value: string | number, optionId?: number) => {
//     setValues(prev => {
//       const newValues = { ...prev, [stepId]: value };

//       setJsonValues(prevJson => {
//         const updatedJson = { ...prevJson };

//         const stepJson = updateJsonValues(parentStep, newValues);
//         return { ...updatedJson, ...stepJson };
//       });

//       return newValues;
//     });

//     if (optionId !== undefined) {
//       const allSteps = [parentStep, ...(parentStep.substeps || [])];
//       const step = allSteps.find(s => s.id === stepId);

//       step?.conditions?.forEach(cond => {
//         if (cond.trigger_option === optionId) {
//           cond.skip_steps.forEach(skipStepId => {
//             const skipStep = allSteps.find(s => s.id === skipStepId);
//             if (!skipStep?.json_key) return;

//             if (parentStep.json_key && parentStep.substeps?.some(s => s.id === skipStepId)) {
//               setJsonValues(prev => {
//                 const key = String(parentStep.json_key);
//                 const nested = { ...((prev[key] as Record<string, any>) || {}) };
//                 delete nested[String(skipStep.json_key)];
//                 return { ...prev, [key]: nested };
//               });
//             } else {
//               setJsonValues(prev => {
//                 const key = String(skipStep.json_key);
//                 const updated = { ...prev };
//                 delete updated[key];
//                 return updated;
//               });
//             }

//             setValues(prevValues => {
//               const updatedValues = { ...prevValues };
//               delete updatedValues[skipStepId];
//               return updatedValues;
//             });
//           });
//         }
//       });
//     }

//     if (optionId !== undefined) onOptionChange(optionId, stepId);
//   };

//   const updateJsonValues = (
//     step: Step,
//     valueMap: Record<number, string | number>
//   ): Record<string, any> => {
//     let result: Record<string, any> = {};

//     const stepValue = valueMap[step.id];

//     if (step.json_key !== undefined) {
//       if (step.input_type === "radio") {
//         const selectedOption = step.options?.find(o => o.option_value === stepValue);
//         if (selectedOption?.json_value !== undefined) {
//           result[step.json_key] = selectedOption.json_value;
//         }
//       } else if (step.input_type === "text" || step.input_type === "number") {
//         result[step.json_key] = stepValue;
//       }
//     }

//     if (step.substeps?.length) {
//       const nested: Record<string, any> = {};
//       for (const sub of step.substeps) {
//         const subJson = updateJsonValues(sub, valueMap);
//         if (sub.json_key && subJson[sub.json_key] !== undefined) {
//           nested[sub.json_key] = subJson[sub.json_key];
//         } else {
//           Object.assign(nested, subJson);
//         }
//       }

//       if (step.json_key) {
//         result[step.json_key] = { ...(result[step.json_key] || {}), ...nested };
//       } else {
//         result = { ...result, ...nested };
//       }
//     }

//     return result;
//   };

//   const handleNextClick = () => {
//     const allSteps = [parentStep, ...(parentStep.substeps || [])];

//     for (let step of allSteps) {
//       if (step.required && !values[step.id]) {
//         alert(`${step.step_name} is required`);
//         return;
//       }
//     }

//     let triggerStepId: number | undefined;
//     let selectedOptionId: number | undefined;

//     if (parentStep.conditions) {
//       parentStep.conditions.forEach(cond => {
//         const option = parentStep.options?.find(o => o.id === cond.trigger_option);
//         if (option && values[parentStep.id] === option.option_value) {
//           triggerStepId = cond.trigger_step;
//           selectedOptionId = cond.trigger_option;
//         }
//       });
//     }

//     const stepJson = updateJsonValues(parentStep, values);

//     const finalJson = { ...jsonValues, ...stepJson };

//     console.log("📦 JSON wysyłany do onNext:", finalJson);

//     setJsonValues(finalJson);
//     onNext(finalJson, triggerStepId, selectedOptionId);
//   };

//   const handlePrevClick = () => {
//     const allSteps = [parentStep, ...(parentStep.substeps || [])];

//     setJsonValues(prevJson => {
//       const updatedJson = { ...prevJson };

//       if (parentStep.json_key) {
//         delete updatedJson[parentStep.json_key];
//       } else {
//         allSteps.forEach(step => {
//           if (step.json_key) delete updatedJson[step.json_key];
//         });
//       }

//       console.log("JSON po cofaniu:", updatedJson);
//       return updatedJson;
//     });

//     onPrev();
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         flex: isMobile ? "1 1 100%" : "0 0 45%",
//       }}
//     >
//       <Box>

//         <StepInput
//           step={parentStep}
//           value={values[parentStep.id] || ""}
//           onChange={(val, optionId) => handleChange(parentStep.id, val, optionId)}
//           onErrorChange={(hasError) =>
//             setErrors(prev => ({ ...prev, [parentStep.id]: hasError }))
//           }
//           isMobile={isMobile}
//         />

//         {(parentStep.substeps || [])
//           .sort((a, b) => a.order - b.order)
//           .map((sub) => {
//             const value = values[sub.id] || "";

//             if (isLast && (sub.input_type === "text" || sub.input_type === "number")) {
//               return (
//                 <StepInput
//                   key={sub.id}
//                   step={sub}
//                   label={sub.step_name}
//                   value={value}
//                   onChange={(val) => handleChange(sub.id, val)}
//                   onErrorChange={(hasError) =>
//                     setErrors(prev => ({ ...prev, [sub.id]: hasError }))
//                   }
//                   isMobile={isMobile}
//                 />
//               );
//             }

//             return (
//               <SubStep
//                 key={sub.id}
//                 step={sub}
//                 value={values[sub.id] || ""}
//                 onChange={handleChange}
//                 valuesMap={values}
//                 isMobile={isMobile}
//               />
//             );
//           })}
//       </Box>

//       <StepNavigation
//         isFirst={isFirst}
//         isLast={isLast}
//         onPrev={handlePrevClick}
//         onNext={handleNextClick}
//         isStepComplete={isStepComplete}
//         isMobile={isMobile}
//       />
      
//       <HelpModal
//         open={openHelp}
//         onClose={() => setOpenHelp(false)}
//         helpSections={parentStep.help || []}
//         isMobile={isMobile}
//       />
//     </Box>
//   );
// };

// export default MultiStepForm;