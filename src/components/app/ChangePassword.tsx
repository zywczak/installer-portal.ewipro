import React from "react";
import { Stack, Box } from "@mui/material";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import LockIcon from "@mui/icons-material/Lock";
import { useChangePassword } from "../../hooks/useChangePassword";
import MainCard from "../common/MainCard";
import { useAuthNotification } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  
  const { showSuccess, showError } = useAuthNotification();

  const {
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordError,
    newPasswordError,
    confirmPasswordError,
    loading,
    isFormInvalid,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  } = useChangePassword({ showSuccess, showError });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, px: 2 }}>
      <MainCard>
        <Stack
          spacing={3}
          sx={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}
        >
          <FormTextField
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            placeholder={t('views.settings.changePassword.form.currentPassword.label')}
            type="password"
            error={currentPasswordError}
            icon={<LockIcon color="action" />}
            size="medium"
          />

          <FormTextField
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder={t('views.settings.changePassword.form.newPassword.label')}
            type="password"
            error={newPasswordError}
            icon={<LockIcon color="action" />}
            showPasswordToggle={true}
            size="medium"
          />

          <FormTextField
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder={t('views.settings.changePassword.form.repeatPassword.label')}
            type="password"
            error={confirmPasswordError}
            icon={<LockIcon color="action" />}
            showPasswordToggle={true}
            size="medium"
          />

          <AcceptButton
            onClick={handleSubmit}
            label={t('views.settings.changePassword.form.submitButton')}
            loading={loading}
            loadingLabel={t('views.settings.changePassword.form.updating')}
            disabled={isFormInvalid}
            size="medium"
          />
        </Stack>
      </MainCard>
    </Box>
  );
};

export default ChangePassword;
