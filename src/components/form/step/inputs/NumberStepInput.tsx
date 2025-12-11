import React from "react";
import { TextField, useTheme } from "@mui/material";
import { StepInputProps } from "../StepInput";

const NumberStepInput: React.FC<StepInputProps> = ({ step, value, onChange }) => {
  const theme = useTheme();
  const [localValue, setLocalValue] = React.useState(value || "");

  React.useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setLocalValue(val);
    }
  };

  const handleBlur = () => {
    if (localValue === "") {
      onChange("");
      return;
    }

    const numericValue = Number(localValue);
    onChange(numericValue < 0 ? 0 : numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <TextField
      fullWidth
      type="text"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={step.placeholder || ""}
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 0 }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 40,
          "& fieldset": { borderColor: theme.palette.divider },
          "&:hover fieldset": { borderColor: theme.palette.primary.main },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
          },
        },
        "& input": {
          textAlign: "center",
        },
      }}
    />
  );
};

export default NumberStepInput;
