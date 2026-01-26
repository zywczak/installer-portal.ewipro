import React from "react";
import { Box, Card, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormTextField from "../../common/FormTextField";
import AcceptButton from "../../common/AcceptButton";
import { SubcontractorInfo } from './types';

interface InfoTabProps {
  info: SubcontractorInfo;
}

const InfoTab: React.FC<InfoTabProps> = ({ info }) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        border: "1px solid #e0e0e0",
        p: 3,
        width: "100%",
        mx: "auto",
        borderRadius: 2,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          pt: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 420,
          mx: "auto",
        }}
      >
        <Stack spacing={5} sx={{ width: "100%" }}>
          <FormTextField
            value={info?.name || ""}
            onChange={() => {}}
            placeholder={t("views.profile.form.name")}
            size="small"
          />
          <FormTextField
            value={info?.email || ""}
            onChange={() => {}}
            placeholder={t("views.profile.form.email")}
            size="small"
            disabled
          />
          <FormTextField
            value={info?.mobile || ""}
            onChange={() => {}}
            placeholder={t("views.profile.form.phone")}
            size="small"
          />
          <FormTextField
            value={info?.companyName || ""}
            onChange={() => {}}
            placeholder={t("views.profile.form.company")}
            size="small"
          />
        </Stack>

        <Box sx={{ width: "100%", mt: 4 }}>
          <Box sx={{ "& > *": { width: "100%" } }}>
            <AcceptButton
              onClick={() => {}}
              loading={false}
              label={t("views.profile.button")}
              loadingLabel={t("views.profile.saving")}
              disabled={true}
              size="small"
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default InfoTab;
