import React, { useState } from "react";
import { Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../api/axiosApi";
import FormHeader from "../common/FormHeader";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import ActionLink from "../common/ActionLink";
import { useTranslation } from "react-i18next";
import { useAuthNotification } from "../../context/AuthContext";
import { useFormField } from "../../hooks/useFormField";
import { validateEmail } from "../../utils/validation/validators";
import { AUTH_ENDPOINTS } from "../../utils/api/auth.api";

interface LoginProps {
  onRegister: () => void;
  onCheckEmail: () => void;
  onForgotPassword: () => void;
  onResetPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegister, onCheckEmail, onForgotPassword }) => {
  const { t } = useTranslation();
  const { showError } = useAuthNotification();

  const emailField = useFormField("", validateEmail);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPasswordError(val ? null : t("views.login.form.error.passwordNotProvided"));
  };

  const isFormInvalid = !emailField.value || !password || !!emailField.error || !!passwordError;

  const handleLogin = async () => {
    if (isFormInvalid) return;
    setLoading(true);

    try {
      localStorage.clear();
      const response = await api.post(AUTH_ENDPOINTS.login, {
        username: emailField.value,
        password,
        updateAuth: false,
      }, { headers: { "Content-Type": "application/json" } });

      localStorage.setItem("access", response.data.jwt);
      localStorage.setItem("userID", response.data.user_id);
      localStorage.setItem("userName", response.data.username);
      localStorage.setItem("userNameSurname", response.data.namesurname);
      localStorage.setItem("userEmail", emailField.value);

      window.location.href = "/";
    } catch (err: any) {
      showError(err.response?.data?.detail || err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} paddingY={2}>
      <FormHeader title={t("views.login.form.header")} />

      <FormTextField
        value={emailField.value}
        onChange={emailField.onChange}
        placeholder={t("views.login.form.email")}
        error={emailField.error}
        icon={<PersonIcon color="action" />}
      />

      <FormTextField
        value={password}
        onChange={handlePasswordChange}
        placeholder={t("views.login.form.password")}
        type="password"
        error={passwordError}
        icon={<LockIcon color="action" />}
      />

      <ActionLink
        label={t("views.login.button.forgot-password")}
        onClick={onForgotPassword}
        align="right"
      />

      <AcceptButton
        onClick={handleLogin}
        label={t("views.login.button.login")}
        loading={loading}
        disabled={isFormInvalid}
      />

      <ActionLink
        label={t("views.register.header.register")}
        onClick={onRegister}
        align="center"
      />
{/* do usunięcia */}
      <ActionLink
        label={t("checkemail")}
        onClick={onCheckEmail}
        align="center"
      />
{/* koniec do usuniecia */}
    </Stack>
  );
};

export default Login;
