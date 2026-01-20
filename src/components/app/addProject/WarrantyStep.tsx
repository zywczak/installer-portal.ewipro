import React, { useEffect } from "react";
import { Typography, Stack, Box, MenuItem } from "@mui/material";
import { FormData } from "./types";
import FormTextField from "./TextField";
import { CustomSelectIcon, renderValue } from "./FormSelectUtils";
import { useTranslation } from "react-i18next";

interface WarrantyStepProps {
  readonly formData: FormData;
  readonly setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function WarrantyStep({ formData, setFormData }: WarrantyStepProps) {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const warrantyPeriods = ["2", "3", "5", "10", "15", "25", "DSW"];

  useEffect(() => {
    const invalidPeriods = ["15", "25"];
    const shouldReset =
      invalidPeriods.includes(formData.warrantyPeriod) &&
      (formData.warrantyProvider === "None" || formData.system === "Render Only");
    if (shouldReset) setFormData((prev) => ({ ...prev, warrantyPeriod: "" }));
  }, [formData.system, formData.warrantyProvider]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        {t('views.newProject.warranty.header')}
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap={2} width="100%">
        <FormTextField
          select
          fullWidth={false}
          name="warrantyProvider"
          value={formData.warrantyProvider}
          onChange={handleChange}
          slotProps={{
            select: {
              IconComponent: CustomSelectIcon,
              displayEmpty: true,
              renderValue: (value: any) =>
                renderValue(t('views.newProject.warrantyProvider.title'), value as string),
            },
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
        >
          {["None", "SWIGA", "IAA", "Quality Mark", "Other"].map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </FormTextField>

        <FormTextField
          select
          fullWidth={false}
          name="warrantyPeriod"
          value={formData.warrantyPeriod}
          onChange={handleChange}
          slotProps={{
            select: {
              IconComponent: CustomSelectIcon,
              displayEmpty: true,
              renderValue: (value: any) =>
                renderValue(t('views.newProject.warrantyPeriod.title'), value as string),
            },
          }}
          sx={{ flexGrow: 1, minWidth: 150 }}
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
        </FormTextField>
      </Stack>
    </Box>
  );
}
