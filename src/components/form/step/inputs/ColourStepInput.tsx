import React from "react";
import { Box } from "@mui/material";
import { StepInputProps } from "../StepInput";

const ColourStepInput: React.FC<StepInputProps> = ({
  step,
  value,
  onChange,
  label,
}) => {
  const colourOptions = step.options || [];

  const handleSelect = (optionId: number, colour: string) => {
    onChange(colour, optionId);
  };

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box display="flex" gap={1} flexWrap="wrap" >
        {colourOptions.map((opt) => {
          const isSelected = value === opt.json_value;
          return (
            <Box
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.json_value!)}
              sx={{
                width: 50,
                height: 50,
                borderRadius: 1,
                cursor: "pointer",
                border: isSelected ? "3px solid #000" : "1px solid #ccc",
                backgroundColor: opt.json_value,
                transition: "all 0.2s ease",
                "&:hover": { borderColor: "#000" },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ColourStepInput;
