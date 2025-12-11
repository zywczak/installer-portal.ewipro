import React, { useEffect } from "react";
import {
  Typography,
  Stack,
  Box,
  MenuItem,
  TextField, // Używamy TextField, ale zmieniamy mu styl na minimalistyczny "wybieralny"
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

  // Minimalistyczny styl selektorów, który ma wyglądać jak interaktywny wiersz/przycisk
  const selectStyle = {
    '.MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: 'white', // Białe tło
      border: '1px solid #e0e0e0', // Delikatna ramka wokół całego pola (karty)
      boxShadow: 'none',
      '& fieldset': { border: 'none' }, // Ukrycie domyślnej ramki TextField
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
    // Ukrycie standardowej etykiety/labela, aby użyć tylko wartości i tekstu tytułowego
    '.MuiInputLabel-root': {
      display: 'none',
    },
    // Usunięcie marginesu dla ułożenia w Stack
    mb: 0, 
  };
  
  // Custom ikona strzałki dla Selecta
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
  
  // Custom Render Value dla wyświetlania tytułu + wartości
  const renderValue = (title: string, value: string) => {
      // Jeśli wartość jest pusta, wyświetl "Choose"
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
  
  // Lista opcji na lata gwarancji
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
      
      {/* Na desktopie (sm: 'row') elementy są obok siebie. Na mobile (xs: 'column') jeden pod drugim. */}
      <Stack
  direction="row"
  sx={{
    display: "flex",
    flexWrap: "wrap", // pozwala przenosić pola pod siebie jeśli nie mieszczą się w jednym wierszu
    width: "100%",
    gap: 2
  }}
>
  {/* 1. Warranty 3rd party provider */}
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
      minWidth: 200, // minimalna szerokość pola
      maxWidth: "100%", // nie wychodzi poza kontener
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

  {/* 2. Warranty period */}
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
      minWidth: 150, // minimalna szerokość pola
      maxWidth: "100%", // nie wychodzi poza kontener
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