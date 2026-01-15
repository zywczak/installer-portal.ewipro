import React from "react";
import { Stack } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import FormHeader from "../common/FormHeader";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import ActionLink from "../common/ActionLink";
import api from "../../api/axiosApi";
import { useAuthNotification } from "../../context/AuthContext";
import { useFormField } from "../../hooks/useFormField";
import { validateEmail } from "../../utils/validation/validators";
import { AUTH_ENDPOINTS } from "../../utils/api/auth.api";
import { t } from "i18next";

interface ForgotPasswordProps {
  onBack: () => void;
  onCheckEmail: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onCheckEmail }) => {
  const { showError } = useAuthNotification();
  const emailField = useFormField("", validateEmail);
  const [loading, setLoading] = React.useState(false);

  const isFormInvalid = !emailField.value || !!emailField.error;

  const handleSendReset = async () => {
    if (isFormInvalid) return;
    setLoading(true);

    try {
      await api.post(AUTH_ENDPOINTS.forgot, { username: emailField.value }, {
        headers: { "Content-Type": "application/json" },
      });
      onCheckEmail();
    } catch (err: any) {
      showError(err.response?.data?.detail || err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <FormHeader
        title={t("views.forgotPassword.form.header")}
        description={t("views.forgotPassword.form.instruction")}
      />

      <FormTextField
        value={emailField.value}
        onChange={emailField.onChange}
        placeholder={t("views.login.form.email")}
        error={emailField.error}
        icon={<EmailIcon color="action" />}
      />

      <AcceptButton
        onClick={handleSendReset}
        label={t("views.forgotPassword.button.send")}
        loading={loading}
        disabled={isFormInvalid}
      />

      <ActionLink
        label={t("views.forgotPassword.button.login")}
        onClick={onBack}
        align="center"
      />
    </Stack>
  );
};

export default ForgotPassword;
