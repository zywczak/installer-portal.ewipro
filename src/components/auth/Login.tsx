import React, { useState } from "react";
import { Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../api/axiosApi";
import FormHeader from "../common/FormHeader";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import ActionLink from "../common/ActionLink";
import ErrorSnackbar from "../common/ErrorSnackbar";
import { useTranslation } from "react-i18next";

interface LoginProps {
  onRegister: () => void;
  onCheckEmail: () => void;
  onForgotPassword: () => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login: React.FC<LoginProps> = ({
  onRegister,
  onCheckEmail,
  onForgotPassword,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value) setEmailError(t("views.login.form.error.emailNotProvided"));
    else if (!emailPattern.test(value)) setEmailError(t("views.login.form.error.emailIncorrectFormat"));
    else setEmailError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!value) setPasswordError(t("views.login.form.error.passwordNotProvided"));
    else setPasswordError(null);
  };

  const validateBeforeSubmit = (): boolean => {
    let valid = true;

    if (!email) {
      setEmailError(t("views.login.form.error.emailNotProvided"));
      valid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError(t("views.login.form.error.emailIncorrectFormat"));
      valid = false;
    }

    if (!password) {
      setPasswordError(t("views.login.form.error.passwordNotProvided"));
      valid = false;
    }

    return valid;
  };

  const isFormInvalid =
    !email || !password || !!emailError || !!passwordError;

  const handleLogin = async () => {
    if (!validateBeforeSubmit()) return;

    setLoading(true);
    setError(null);

    try {
      localStorage.clear();
      const response = await api.post(
        "/installer/authenticate/",
        {
          "username": email,
          "password": password,
          "updateAuth": false,
        },
      );
      localStorage.setItem("access", response.data.jwt);
      localStorage.setItem("userID", response.data.user_id);
      localStorage.setItem("userName", response.data.username);
      localStorage.setItem("userNameSurname", response.data.namesurname);
      localStorage.setItem("userEmail",email)

      window.location.href = "/";
      console.log("data", response.data)
    } catch (err: any) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={2} paddingY={2}>
        <FormHeader
          title={t("views.login.form.header")}
        />

        <FormTextField
          value={email}
          onChange={handleEmailChange}
          placeholder={t("views.login.form.email")}
          error={emailError}
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
          loadingLabel={t("views.login.button.loading")}
          disabled={isFormInvalid}
        />

        <ActionLink
          label={t("views.register.header.register")}
          onClick={onRegister}
          align="center"
        />

{/*/// do usunięcia */}
        <ActionLink
          label="Check email"
          onClick={onCheckEmail}
          align="center"
        />
{/* koniec do usuniecia */}

      </Stack>

      <ErrorSnackbar
        message={error}
        onClose={() => setError(null)}
      />
    </>
  );
};

export default Login;
