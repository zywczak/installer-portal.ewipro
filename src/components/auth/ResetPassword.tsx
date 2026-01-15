import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import FormHeader from "../common/FormHeader";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import ActionLink from "../common/ActionLink";
import { useTranslation } from "react-i18next";
import { useAuthNotification } from "../../context/AuthContext";
import { useFormField } from "../../hooks/useFormField";
import { validatePassword } from "../../utils/validation/validators";
import api from "../../api/axiosApi";
import { AUTH_ENDPOINTS } from "../../utils/api/auth.api";
// @ts-ignore
import md5 from "md5";

interface ResetPasswordProps {
  onBackToLogin: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const { showError, showSuccess } = useAuthNotification();

  const passwordField = useFormField("", validatePassword);
  const repeatField = useFormField("", validatePassword);
  const [loading, setLoading] = useState(false);
  const [resetHash, setResetHash] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    setResetHash(params.get("hash") ?? "");
  }, []);

  const isFormInvalid =
    !passwordField.value ||
    !repeatField.value ||
    !!passwordField.error ||
    !!repeatField.error ||
    passwordField.value !== repeatField.value;

  const handleSubmit = async () => {
    if (isFormInvalid) return;
    setLoading(true);

    try {
      await api.post(AUTH_ENDPOINTS.reset, {
        passwordResetHash: resetHash,
        password: md5(passwordField.value),
      }, { headers: { "Content-Type": "application/json" } });

      showSuccess(t("Password reset successful!"));
      setTimeout(() => onBackToLogin(), 1500);
    } catch (err: any) {
      showError(err.response?.data?.detail || err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} paddingY={2}>
      <FormHeader title={t("Reset Password")} description={t("Reset your password")} />

      <FormTextField
        value={passwordField.value}
        onChange={passwordField.onChange}
        placeholder={t("views.settings.changePassword.form.newPassword.label")}
        type="password"
        error={passwordField.error}
        icon={<LockIcon color="action" />}
        showPasswordToggle
      />

      <FormTextField
        value={repeatField.value}
        onChange={repeatField.onChange}
        placeholder={t("views.settings.changePassword.form.repeatPassword.label")}
        type="password"
        error={repeatField.error || (passwordField.value == repeatField.value ? null : t("Passwords do not match"))}
        icon={<LockIcon color="action" />}
        showPasswordToggle
      />

      <AcceptButton
        onClick={handleSubmit}
        label={t("Reset Password")}
        loading={loading}
        disabled={isFormInvalid}
      />

      <ActionLink label={t("views.forgotPassword.button.login")} onClick={onBackToLogin} align="center" />
    </Stack>
  );
};

export default ResetPassword;
