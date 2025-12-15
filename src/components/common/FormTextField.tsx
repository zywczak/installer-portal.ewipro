// import React, { useState } from "react";
// import {
//   TextField,
//   Stack,
//   Typography,
//   InputAdornment,
//   IconButton,
//   TextFieldProps,
// } from "@mui/material";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// interface FormTextFieldProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder: string;
//   error?: string | null;
//   icon?: React.ReactNode;
//   type?: string;
//   disabled?: boolean;
//   helperText?: string;
//   InputProps?: TextFieldProps["InputProps"]; 
//   showPasswordToggle?: boolean;
//   size?: "small" | "medium";
// }

// const FormTextField: React.FC<FormTextFieldProps> = ({
//   value,
//   onChange,
//   placeholder,
//   error,
//   icon,
//   type = "text",
//   disabled = false,
//   InputProps,
//   showPasswordToggle = false,
//   size = "medium",
// }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const isPasswordField = type === "password";

//   return (
//     <>
//       <TextField
//         label={placeholder}
//         placeholder={placeholder}
//         fullWidth
//         variant="outlined"
//         type={showPassword && isPasswordField ? "text" : type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         error={!!error}
//         disabled={disabled}
//         size={size}
//         InputProps={{
//           startAdornment: icon ? (
//             <InputAdornment 
//               position="start" 
//               sx={{ ml: 1.5 }} // ← przesunięcie ikony w prawo
//             >
//               {icon}
//             </InputAdornment>
//           ) : undefined,
//           endAdornment:
//             showPasswordToggle && isPasswordField ? (
//               <InputAdornment position="end">
//                 <IconButton
//                   onClick={() => setShowPassword(!showPassword)}
//                   edge="end"
//                   size="small"
//                 >
//                   {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                 </IconButton>
//               </InputAdornment>
//             ) : undefined,
//           ...InputProps,
//         }}
//         InputLabelProps={{
//           shrink: !!value,
//           sx: { left: !!value ? 0 : icon ? 32 : 0 },
//         }}
//         sx={{
//           '& .MuiOutlinedInput-root': {
//             borderRadius: '16px',
//             backgroundColor: 'white',
//             padding: 0,
//             '& .MuiInputBase-input': { padding: '16px 0px' },
//             '& .MuiOutlinedInput-notchedOutline': {
//               borderRadius: '16px',
//             },
//           },
//           '& .MuiInputAdornment-root': {
//             marginRight: '12px',
//             paddingLeft: 0,
//           },
//           height: size === "small" ? 40 : 56,
//         }}
//       />
//       {error && (
//         <Stack
//           direction="row"
//           alignItems="center"
//           spacing={0.5}
//           sx={{ color: "error.main", pl: 1, mt: 0.5 }}
//         >
//           <ErrorOutlineIcon sx={{ fontSize: 14 }} />
//           <Typography sx={{ fontSize: 12 }}>{error}</Typography>
//         </Stack>
//       )}
//     </>
//   );
// };

// export default FormTextField;






















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
  const hasStartIcon = !!icon;
  const hasEndIcon = showPasswordToggle && isPasswordField;

  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        label={placeholder}
        type={isPasswordField && showPasswordToggle ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        disabled={disabled}
        size={size}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,
          endAdornment: showPasswordToggle && isPasswordField ? (
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
          sx: {
            left: !!value ? 0 : icon ? 38 : 0,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'white',
            padding: 0,
            '& .MuiInputBase-input': {
              padding: '16px 0px',
              paddingLeft: hasStartIcon ? 0 : '16px',
              paddingRight: hasEndIcon ? 0 : '16px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: '16px',
            },
          },
          '& .MuiInputAdornment-root': {
            marginRight: '12px',
            paddingLeft: hasStartIcon ? '16px' : 0,
          },
          height: size === "small" ? 40 : 56,
        }}
      />
      {error && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
          <ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default FormTextField;






















// import React from "react";
// import { TextField, InputAdornment, IconButton } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// interface FormTextFieldProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   type?: string;
//   error?: string | null;
//   icon?: React.ReactNode;
//   showPasswordToggle?: boolean;
// }

// const FormTextField: React.FC<FormTextFieldProps> = ({
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   error,
//   icon,
//   showPasswordToggle = false,
// }) => {
//   const [showPassword, setShowPassword] = React.useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

//   const isPassword = type === "password";
//   const inputType = isPassword && showPasswordToggle ? (showPassword ? "text" : "password") : type;

//   return (
//     <TextField
//       value={value}
//       onChange={handleChange}
//       placeholder={placeholder}
//       type={inputType}
//       error={!!error}
//       helperText={error}
//       fullWidth
//       InputProps={{
//         startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
//         endAdornment: isPassword && showPasswordToggle ? (
//           <InputAdornment position="end">
//             <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         ) : undefined,
//       }}
//     />
//   );
// };

// export default FormTextField;
