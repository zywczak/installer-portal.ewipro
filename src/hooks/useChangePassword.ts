import { useState } from "react";
// @ts-ignore
import md5 from "md5";
import api from "../api/axiosApi";
import { useTranslation } from "react-i18next";

interface UseChangePasswordProps {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export const useChangePassword = ({ showSuccess, showError }: UseChangePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const validatePasswordComplexity = (password: string): string | null => {
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return t('views.settings.changePassword.form.newPassword.hint');
    }
    return null;
  };

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    setCurrentPasswordError(value ? null : t('views.settings.changePassword.form.currentPassword.required'));
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    const errorText = validatePasswordComplexity(value);
    setNewPasswordError(errorText);
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError(t('views.settings.changePassword.form.repeatPassword.passwordDoesNotMatch'));
    } else if (!errorText) {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    const errorText = validatePasswordComplexity(value);
    setConfirmPasswordError(errorText);
    if (newPassword && value !== newPassword) {
      setConfirmPasswordError(t('views.settings.changePassword.form.repeatPassword.passwordDoesNotMatch'));
      setNewPasswordError(null);
    } else if (!errorText) {
      setNewPasswordError(null);
    }
  };

  const validateBeforeSubmit = (): boolean => {
    let valid = true;

    const currentError = currentPassword ? null : t('views.settings.changePassword.form.currentPassword.required');
    setCurrentPasswordError(currentError);
    if (currentError) valid = false;

    const newError = validatePasswordComplexity(newPassword);
    setNewPasswordError(newError);
    if (newError) valid = false;

    const confirmError = validatePasswordComplexity(confirmPassword);
    setConfirmPasswordError(confirmError);
    if (confirmError) valid = false;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError(t('views.settings.changePassword.form.repeatPassword.passwordDoesNotMatch'));
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    setLoading(true);

    try {
      await api.post({
        action: "changePassword",
        currentPasswordHash: md5(currentPassword),
        newPasswordHash: md5(newPassword),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showSuccess(t('views.settings.changePassword.form.formSuccessfullySubmitted'));
      window.location.href = "/#settings";
    } catch (err: any) {
      console.error(err);
      showError(t('views.settings.changePassword.form.errorSubmitting') || "Failed to change password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid =
    !currentPassword || !newPassword || !confirmPassword ||
    !!currentPasswordError || !!newPasswordError || !!confirmPasswordError;

  return {
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
  };
};
