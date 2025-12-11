import React, { useState } from "react";
import {
  TextField,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  TextFieldProps,
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
  helperText?: string;
  InputProps?: TextFieldProps["InputProps"]; 
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
  InputProps,
  showPasswordToggle = false,
  size = "medium",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <>
      <TextField
        label={placeholder}
        placeholder={placeholder}
        fullWidth
        variant="outlined"
        type={showPassword && isPasswordField ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        disabled={disabled}
        size={size}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,
          endAdornment:
            showPasswordToggle && isPasswordField ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          ...InputProps,
        }}
        InputLabelProps={{
          shrink: !!value,
          sx: { left: !!value ? 0 : icon ? 32 : 0 },
        }}
        sx={{
          // backgroundColor: "#f5f5f5",
          height: size === "small" ? 40 : 56,
        }}
      />
      {error && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ color: "error.main", pl: 1, mt: 0.5 }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 12 }}>{error}</Typography>
        </Stack>
      )}
    </>
  );
};


export default FormTextField;
