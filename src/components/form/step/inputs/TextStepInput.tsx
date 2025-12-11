import React, { useState } from "react";
import { TextField, useTheme } from "@mui/material";
import { StepInputProps } from "../StepInput";

const TextStepInput: React.FC<StepInputProps> = ({
  step,
  value,
  onChange,
  onErrorChange,
  label,
}) => {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (step.validation_regex) {
      const regex = new RegExp(step.validation_regex);
      const valid = regex.test(val);
      setIsValid(valid);
      setError(valid ? null : "Niepoprawny format");
      onErrorChange?.(!valid);
    } else {
      setIsValid(true);
      setError(null);
      onErrorChange?.(false);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const getBorderColor = () => {
    if (error) return theme.palette.error.main;
    if (isFocused) return theme.palette.primary.main;
    if (isValid) return theme.palette.secondary.main;
    return theme.palette.divider;
  };

  return (
    <TextField
      fullWidth
      type="text"
      value={value}
      label={label || step.step_name}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={!!error}
      helperText={error || " "}
      variant="outlined"
      InputLabelProps={{
            sx: {
              top: "20px",
              left: 14,
              transform: "translateY(-50%)",
              fontSize: "14px",
              transition: "all 0.2s ease",
              "&.MuiInputLabel-shrink": {
                top: 10,
                left: 14,
                transform: "translateY(-100%) scale(0.85)",
              },
            },
          }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 40,
          "& input": {
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
          },
          "& fieldset": {
            borderColor: getBorderColor(),
            transition: "border-color 0.3s ease",
          },
          "&:hover fieldset": {
            borderColor: isFocused
              ? theme.palette.warning.main
              : theme.palette.text.primary,
          },
          "&.Mui-focused fieldset": {
            borderColor: getBorderColor(),
          },
        },
      }}
    />
  );
};

export default TextStepInput;
