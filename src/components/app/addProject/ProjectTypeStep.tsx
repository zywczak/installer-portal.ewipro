import React from "react";
import { Typography, Stack, Box, MenuItem } from "@mui/material";
import { FormData } from "./types";
import FormTextField from "./TextField";
import { CustomSelectIcon, renderValue } from "./FormSelectUtils";
import { useTranslation } from "react-i18next";

interface ProjectTypeStepProps {
  readonly formData: FormData;
  readonly setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function ProjectTypeStep({
  formData,
  setFormData,
}: ProjectTypeStepProps) {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fields = [
    { label: t('views.newProject.buildType.title'), name: "buildType", options: [t('views.newProject.buildType.newBuild'), t('views.newProject.buildType.retrofit')] },
    { label: t('views.newProject.substrateType.title'), name: "substrate", options: [t('views.newProject.substrateType.standardBrick'),t('views.newProject.substrateType.block'),t('views.newProject.substrateType.otherMasonry'),t('views.newProject.substrateType.parkHome'),t('views.newProject.substrateType.timberFrame'),t('views.newProject.substrateType.metalFrame'),t('views.newProject.substrateType.icf'),t('views.newProject.substrateType.other')] },
    { label: t('views.newProject.systemType.title'), name: "system", options: ["EWI EPS","EWI Mineral Wool","EWI K5","Render Only","Durashield Pro (Innovation System)"] },
    { label: "PAS 2035", name: "pasRole", options: ["Yes","No"] },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        {t('views.newProject.projectType.header')}
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        width="100%"
        gap={2}
        flexWrap="wrap"
      >
        {fields.map((field) => (
          <FormTextField
            key={field.name}
            select
            name={field.name}
            value={formData[field.name as keyof FormData]}
            onChange={handleChange}
            slotProps={{
              select: {
                IconComponent: CustomSelectIcon,
                displayEmpty: true,
                renderValue: (value: any) =>
                  renderValue(field.label, value as string),
                MenuProps: { PaperProps: { sx: { borderRadius: "12px" } } },
              },
            }}
            fullWidth={false}
            sx={{ flexGrow: 1, minWidth: 200, maxWidth: "100%" }}
          >
            {field.options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </FormTextField>
        ))}
      </Stack>
    </Box>
  );
}
