import React, { useState } from "react";
import { Stack } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import FormHeader from "../common/FormHeader";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import ActionLink from "../common/ActionLink";
import ErrorSnackbar from "../common/ErrorSnackbar";
import { useTranslation } from "react-i18next";

interface ForgotPasswordProps {
  onBack: () => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value) setEmailError(t("views.login.form.error.emailNotProvided"));
    else if (!emailPattern.test(value)) setEmailError(t("views.login.form.error.emailIncorrectFormat"));
    else setEmailError(null);
  };

  const handleSendReset = async () => {
    if (!email || !!emailError) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Reset link sent to:", email);
      onBack();
    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to send reset link.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !email || !!emailError;

  return (
    <>
      <Stack spacing={2}>
        <FormHeader
          title={t("views.forgotPassword.form.header")}
          description={t("views.forgotPassword.form.instruction")}
        />

        <FormTextField
          value={email}
          onChange={handleEmailChange}
          placeholder={t("views.login.form.email")}
          error={emailError}
          icon={<EmailIcon color="action" />}
        />

        <AcceptButton
          onClick={handleSendReset}
          label={t("views.forgotPassword.button.send")}
          loading={loading}
          loadingLabel="Sending..."
          disabled={isFormInvalid}
        />

        <ActionLink
          label={t("views.forgotPassword.button.login")}
          onClick={onBack}
          align="center"
        />
      </Stack>

      <ErrorSnackbar
        message={error}
        onClose={() => setError(null)}
      />
    </>
  );
};

export default ForgotPassword;
