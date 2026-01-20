import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type FormTextFieldProps = TextFieldProps & {
  /** Default: true */
  fullWidth?: boolean;
};

const FormTextField = React.forwardRef<HTMLInputElement, FormTextFieldProps>(
  function FormTextField(
    { sx, fullWidth = true, ...props },
    ref
  ) {
    return (
      <TextField
        ref={ref}
        fullWidth={fullWidth}
        {...props}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'white',
            padding: 0,

            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: '16px',
            },
          },

          '& .MuiInputBase-input': {
            padding: '16px 14px',
          },

          ...sx,
        }}
      />
    );
  }
);

export default FormTextField;
