import React from "react";
import { Stack, Box } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FormHeader from "../common/FormHeader";
import AcceptButton from "../common/AcceptButton";
import { useTranslation } from "react-i18next";


interface CheckEmailProps {
  onBack: () => void;
}

const CheckEmail: React.FC<CheckEmailProps> = ({ onBack }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={4} alignItems="center" textAlign="center" paddingY={5}>
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EmailOutlinedIcon sx={{ fontSize: 48, color: "success.main" }} />
      </Box>

      <FormHeader
        title={t("views.forgotPassword.confirmation.header")}
        description={t("views.forgotPassword.confirmation.instruction")}
      />

      <AcceptButton
        onClick={onBack}
        label={t("views.register.button.login")}
      />
    </Stack>
  );
};

export default CheckEmail;
