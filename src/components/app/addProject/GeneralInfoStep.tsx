import React from "react";
import { Typography, Stack, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, parseISO } from "date-fns";
import { enGB } from 'date-fns/locale';
import FormTextField from "./TextField";
import { useTranslation } from "react-i18next";

interface FormData {
  occupierName: string;
  startDate: string;
}

interface GeneralInfoStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function GeneralInfoStep(
  { formData, setFormData }: Readonly<GeneralInfoStepProps>
) {
  const { t } = useTranslation();
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
          {t('views.newProject.GeneralAddress.Header')}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row', }} sx={{ gap: 2 }}>
          <FormTextField
            label={t('views.newProject.GeneralAddress.Form.OccupierName.label')}
            name="occupierName"
            value={formData.occupierName}
            onChange={handleChange}
            slotProps={{
              inputLabel: { shrink: !!formData.occupierName },
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <DatePicker
              label={t('views.newProject.GeneralAddress.Form.StartDate.label')}
              value={startDateObject}
              onChange={handleDateChange}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: FormTextField }}
              slotProps={{
                textField: {
                  name: "startDate",
                  InputLabelProps: { shrink: true },
                  inputProps: {
                    pattern: String.raw`\d{2}/\d{2}/\d{4}`,
                  },
                  sx: {
                    '& .MuiInputAdornment-root': {
                      marginRight: '12px',
                      paddingLeft: 0,
                    },
                  },
                },
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
          {t('views.newProject.GeneralAddress.Form.StartDate.noWorry')}
        </Typography>
      </Box>
    </LocalizationProvider>
  );
}