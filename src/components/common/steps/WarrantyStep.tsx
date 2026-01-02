import React, { useEffect } from "react";
import {
  Typography,
  Stack,
  Box,
  MenuItem,
  TextField
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FormData } from "./types";

interface WarrantyStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function WarrantyStep({ formData, setFormData }: WarrantyStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectStyle = {
    '.MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      boxShadow: 'none',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' },
      padding: '0 !important', 
    },
    '.MuiInputBase-input': {
      padding: '16px 14px',
      height: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
    '.MuiInputLabel-root': {
      display: 'none',
    },
    mb: 0, 
  };
  
  const CustomSelectIcon = (props: any) => (
    <ArrowForwardIosIcon 
      {...props} 
      sx={{ 
        fontSize: '1rem', 
        color: 'gray', 
        pointerEvents: 'none', 
        mr: 1 
      }} 
    />
  );
  
  const renderValue = (title: string, value: string) => {
      const displayValue = value || 'Choose'; 

      return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 4 }}>
              <Typography variant="body1" color="text.primary" fontWeight={500}>
                  {title}
              </Typography>
              <Typography variant="body1" color={displayValue === 'Choose' ? 'text.secondary' : 'text.primary'}>
                  {displayValue}
              </Typography>
          </Box>
      );
  };
  
  const warrantyPeriods = ["2", "3", "5", "10", "15", "25", "DSW"];

  useEffect(() => {
  const invalidPeriods = ["15", "25"];

  const shouldReset =
    invalidPeriods.includes(formData.warrantyPeriod) &&
    (formData.warrantyProvider === "None" || formData.system === "Render Only");

  if (shouldReset) {
    setFormData(prev => ({
      ...prev,
      warrantyPeriod: ""
    }));
  }
}, [formData.system, formData.warrantyProvider]);


  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Warranty
      </Typography>
      
      <Stack
  direction="row"
  sx={{
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    gap: 2
  }}
>
  <TextField
    select
    label="Warranty 3rd party provider"
    name="warrantyProvider"
    value={formData.warrantyProvider}
    onChange={handleChange}
    SelectProps={{
      IconComponent: CustomSelectIcon,
      displayEmpty: true,
      renderValue: (value) =>
        renderValue("Warranty 3rd party provider", value as string),
    }}
    sx={{
      ...selectStyle,
      flexGrow: 1,
      minWidth: 200,
      maxWidth: "100%",
      '.MuiOutlinedInput-root': {
        ...selectStyle['.MuiOutlinedInput-root'],
        borderRadius: "16px",
      },
    }}
  >
    {["None", "SWIGA", "IAA", "Quality Mark", "Other"].map((opt) => (
      <MenuItem key={opt} value={opt}>
        {opt}
      </MenuItem>
    ))}
  </TextField>

  <TextField
    select
    label="Warranty period"
    name="warrantyPeriod"
    value={formData.warrantyPeriod}
    onChange={handleChange}
    SelectProps={{
      IconComponent: CustomSelectIcon,
      displayEmpty: true,
      renderValue: (value) => renderValue("Warranty period", value as string),
    }}
    sx={{
      ...selectStyle,
      flexGrow: 1,
      minWidth: 150,
      maxWidth: "100%",
      '.MuiOutlinedInput-root': {
        ...selectStyle['.MuiOutlinedInput-root'],
        borderRadius: "16px",
      },
    }}
  >
    {warrantyPeriods.map((opt) => {
      const isDisabled =
        (formData.warrantyProvider === "None" || formData.system === "Render Only") &&
        (opt === "15" || opt === "25");

      return (
        <MenuItem key={opt} value={opt} disabled={isDisabled}>
          {opt}
        </MenuItem>
      );
    })}
  </TextField>
</Stack>

    </Box>
  );
}