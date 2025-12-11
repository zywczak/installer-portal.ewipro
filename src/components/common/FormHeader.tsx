import { Typography, Stack } from "@mui/material";
import React from "react";

interface FormHeaderProps {
  title: string;
  description?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description }) => (
  <Stack spacing={1}>
    <Typography variant="h5" fontWeight="bold">
      {title}
    </Typography>
    {description && (
      <Typography variant="body2">{description}</Typography>
    )}
  </Stack>
);

export default FormHeader;
