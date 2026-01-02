import React from "react";
import { Typography, TextField, Stack, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, parseISO } from "date-fns";
import { enGB } from 'date-fns/locale';

interface FormData {
  occupierName: string;
  startDate: string;
}

interface GeneralInfoStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function GeneralInfoStep({ formData, setFormData }: GeneralInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    setFormData((prev) => ({ ...prev, startDate: dateString }));
  };

  const startDateObject = formData.startDate ? parseISO(formData.startDate) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mb: 4, fontFamily: 'Inter, sans-serif' }}>
       <Typography variant="h6" fontWeight={600} mb={2}>
          General info
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row', }} sx={{gap: 2}}>
          <TextField
            fullWidth
            label="Property occupier name"
            placeholder="Property occupier name"
            name="occupierName"
            value={formData.occupierName}
            onChange={handleChange}
            InputLabelProps={{ shrink: !!formData.occupierName }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: 'white',
                padding: 0,
                '& .MuiInputBase-input': { padding: '16px 14px' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: '16px',
                },
              },
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
  <DatePicker
    label="Start Date"
    value={startDateObject}
    onChange={handleDateChange}
    enableAccessibleFieldDOMStructure={false}
    slots={{ textField: TextField }}
    slotProps={{
      textField: {
        fullWidth: true,
        name: "startDate",
        InputLabelProps: { shrink: true },
        inputProps: { 
          pattern: "\\d{2}/\\d{2}/\\d{4}",
        },
        sx: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'white',
            padding: 0,
            '& .MuiInputBase-input': { padding: '16px 14px' },
            '& .MuiOutlinedInput-notchedOutline': { borderRadius: '16px' },
          },
          '& .MuiInputAdornment-root': {
            marginRight: '12px',
            paddingLeft: 0,
          },
        },
      },
      desktopPaper: {
        sx: {
          '& .MuiPickersDay-root.Mui-selected': {
            backgroundColor: 'rgb(25, 118, 210)',
            color: 'white',
            borderRadius: '50%',
          },
          '& .MuiPickersDay-root.Mui-selected:hover': {
            backgroundColor: 'rgb(25, 118, 210)',
          },
          '& .MuiSvgIcon-root': {
            color: 'rgba(0, 0, 0, 0.54)',
          },
        }
      }
    }}
  />
</LocalizationProvider>

        </Stack>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          mt={1} 
          sx={{ textAlign: 'right' }}
        >
          No worry if you don't know the exact date. You'll be able to change it later.
        </Typography>
      </Box>
    </LocalizationProvider>
  );
}