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
import ErrorSnackbar from "../common/ErrorSnackbar";
import { useTranslation } from "react-i18next";

interface RegisterProps {
  onBack: () => void;
  onCheckEmail: () => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?\d{9,15}$/;

const Register: React.FC<RegisterProps> = ({ onBack, onCheckEmail }) => {
  const { t } = useTranslation();
  const [nameSurname, setNameSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [errors, setErrors] = useState({
    nameSurname: null as string | null,
    email: null as string | null,
    phone: null as string | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setNameSurname(value);
    setErrors((prev) => ({
      ...prev,
      nameSurname: value.trim() ? null : t("views.newProject.AddNewTeamMember.form.nameSurname.requiredError"),
    }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: !value
        ? t("views.newProject.AddNewTeamMember.form.email.requiredError")
        : !emailPattern.test(value)
        ? t("views.newProject.AddNewTeamMember.form.email.incorrectFormatError")
        : null,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setErrors((prev) => ({
      ...prev,
      phone: !value
        ? t("views.newProject.AddNewTeamMember.form.mobileNumber.requiredError")
        : !phonePattern.test(value)
        ? t("views.newProject.AddNewTeamMember.form.mobileNumber.incorrectFormatError")
        : null,
    }));
  };

  const isFormInvalid =
    !nameSurname ||
    !email ||
    !phone ||
    !!errors.nameSurname ||
    !!errors.email ||
    !!errors.phone;

  const handleRegister = async () => {
    if (isFormInvalid) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/installer/register/", {
        nameSurname,
        email,
        phone,
        company,
      });

      console.log("Registration successful:", response.data);
      onCheckEmail();
    } catch (err: any) {
      console.error("Registration error:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <FormHeader
          title={t("views.register.header.register")}
          description={t("views.register.header.description")}
        />

        <FormTextField
          value={nameSurname}
          onChange={handleNameChange}
          placeholder={t("views.newProject.AddNewTeamMember.form.nameSurname.label")}
          error={errors.nameSurname}
          icon={<PersonIcon color="action" />}
        />

        <FormTextField
          value={email}
          onChange={handleEmailChange}
          placeholder={t("views.newProject.AddNewTeamMember.form.email.label")}
          error={errors.email}
          icon={<EmailIcon color="action" />}
        />

        <FormTextField
          value={phone}
          onChange={handlePhoneChange}
          placeholder={t("views.newProject.AddNewTeamMember.form.mobileNumber.label")}
          error={errors.phone}
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
          loadingLabel={t("views.forgotPassword.button.loading")}
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

export default Register;
