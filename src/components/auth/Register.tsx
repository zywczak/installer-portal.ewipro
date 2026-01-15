import React, { useState } from "react";
import { Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import api from "../../api/axiosApi";
import FormHeader from "../common/FormHeader";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import ActionLink from "../common/ActionLink";
import { useAuthNotification } from "../../context/AuthContext";
import { useFormField } from "../../hooks/useFormField";
import { validateEmail, validatePhone } from "../../utils/validation/validators";
import { AUTH_ENDPOINTS } from "../../utils/api/auth.api";
import { t } from "i18next";

interface RegisterProps {
  onBack: () => void;
  onCheckEmail: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onCheckEmail }) => {
  const { showError } = useAuthNotification();

  const nameField = useFormField("");
  const emailField = useFormField("", validateEmail);
  const phoneField = useFormField("", validatePhone);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormInvalid =
    !nameField.value || !emailField.value || !phoneField.value ||
    !!nameField.error || !!emailField.error || !!phoneField.error;

  const handleRegister = async () => {
    if (isFormInvalid) return;
    setLoading(true);

    try {
      await api.post(AUTH_ENDPOINTS.register, {
        nameSurname: nameField.value,
        emailAddress: emailField.value,
        phoneNumber: phoneField.value,
        companyName: company,
      });
      onCheckEmail();
    } catch (err: any) {
      showError(err.response?.data?.detail || err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <FormHeader
        title={t("views.register.header.register")}
        description={t("views.register.header.description")}
      />

      <FormTextField
        value={nameField.value}
        onChange={nameField.onChange}
        placeholder={t("views.newProject.AddNewTeamMember.form.nameSurname.label")}
        error={nameField.error}
        icon={<PersonIcon color="action" />}
      />

      <FormTextField
        value={emailField.value}
        onChange={emailField.onChange}
        placeholder={t("views.newProject.AddNewTeamMember.form.email.label")}
        error={emailField.error}
        icon={<EmailIcon color="action" />}
      />

      <FormTextField
        value={phoneField.value}
        onChange={phoneField.onChange}
        placeholder={t("views.newProject.AddNewTeamMember.form.mobileNumber.label")}
        error={phoneField.error}
        icon={<PhoneIcon color="action" />}
      />

      <FormTextField
        value={company}
        onChange={setCompany}
        placeholder={t("views.newProject.AddNewTeamMember.form.companyName.label")}
        icon={<BusinessIcon color="action" />}
      />

      <AcceptButton
        onClick={handleRegister}
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

export default Register;
