import { Stack } from "@mui/material";
import FormTextField from "../../common/FormTextField";
import { t } from "i18next";

interface Props {
  name: string;
  email: string;
  phone: string;
  company: string;
  error: string | null;
  onPhoneChange: (v: string) => void;
  onCompanyChange: (v: string) => void;
}

const ProfileForm: React.FC<Props> = ({
  name,
  email,
  phone,
  company,
  error,
  onPhoneChange,
  onCompanyChange,
}) => (
  <Stack spacing={5} sx={{ width: "100%" }}>
    <FormTextField value={name || ""} disabled placeholder={t("views.profile.form.name")} onChange={() => { }} size="small" />
    <FormTextField value={email} disabled placeholder={t("views.profile.form.email")} onChange={() => { }} size="small" />
    <FormTextField value={phone} onChange={onPhoneChange} error={error} placeholder={t("views.profile.form.phone")} size="small" />
    <FormTextField value={company} onChange={onCompanyChange} placeholder={t("views.profile.form.company")} size="small" />
  </Stack>
);

export default ProfileForm;
