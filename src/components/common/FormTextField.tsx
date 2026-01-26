import React, { useState } from "react";
import {
  TextField,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface FormTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string | null;
  icon?: React.ReactNode;
  type?: string;
  disabled?: boolean;
  slotInputProps?: any;
  showPasswordToggle?: boolean;
  size?: "small" | "medium";
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
  icon,
  type = "text",
  disabled = false,
  slotInputProps,
  showPasswordToggle = false,
  size = "medium",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const shouldShowPasswordToggle = isPasswordField && showPasswordToggle;

  let inputType = type; 
  if (isPasswordField && showPasswordToggle) { 
    inputType = showPassword ? "text" : "password"; 
  }

  const startAdornment = icon ? (
    <InputAdornment position="start">{icon}</InputAdornment>
  ) : undefined;

  const endAdornment = shouldShowPasswordToggle ? (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPassword((prev) => !prev)}
        edge="end"
        size="small"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  ) : undefined;

  const labelLeft = !value && icon ? 38 : 0;

  const inputPaddingLeft = icon ? 0 : "16px";
  const inputPaddingRight = shouldShowPasswordToggle ? 0 : "16px";

  // ===== Render =====
  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        label={placeholder}
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={Boolean(error)}
        disabled={disabled}
        size={size}
        slotProps={{
          input: {
            startAdornment,
            endAdornment,
            ...slotInputProps,
          },
          inputLabel: {
            shrink: Boolean(value),
            sx: { left: labelLeft },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "white",
            padding: 0,
            "& .MuiInputBase-input": {
              padding: "16px 0px",
              paddingLeft: inputPaddingLeft,
              paddingRight: inputPaddingRight,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "16px",
            },
          },
          "& .MuiInputAdornment-root": {
            marginRight: "12px",
            paddingLeft: icon ? "16px" : 0,
          },
          height: size === "small" ? 40 : 56,
        }}
      />

      {error && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
          <ErrorOutlineIcon sx={{ fontSize: 16, color: "error.main" }} />
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default FormTextField;
