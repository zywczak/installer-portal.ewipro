import React, { useState } from "react";
import { 
    Box, 
    Stack, 
    Card,
} from "@mui/material";
import api from "../../api/axiosApi";
import LockIcon from "@mui/icons-material/Lock";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import { useTranslation } from 'react-i18next';
// @ts-ignore
import md5 from "md5";
interface Props {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

const ChangePassword: React.FC<Props> = ({ showSuccess, showError }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const validatePasswordComplexity = (password: string): string | null => {
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return t('views.settings.changePassword.form.newPassword.hint');
        }
        return null;
    };

    const handleCurrentPasswordChange = (value: string) => {
        setCurrentPassword(value);
        setCurrentPasswordError(value ? null : "Aktualne hasło jest wymagane.");
    };

    const handleNewPasswordChange = (value: string) => {
        setNewPassword(value);

        let errorText = validatePasswordComplexity(value);
        setNewPasswordError(errorText);
        
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError(t('views.settings.changePassword.form.repeatPassword.passwordDoesNotMatch'));
        } else if (!errorText) {
            setConfirmPasswordError(null);
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);

        let errorText = validatePasswordComplexity(value);
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

        const currentError = currentPassword ? null : "Aktualne hasło jest wymagane.";
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
    setError(null);
    setSuccess(null);

    try {
        const body = {
            action: "changePassword",
            newPasswordHash: md5(newPassword),
            currentPasswordHash: md5(currentPassword),
        };

        const response = await api.post(body);

        // W Axiosie sprawdzasz status lub używasz try/catch
        // Jeśli serwer zwróci błąd HTTP, Axios automatycznie rzuca wyjątek

        const data = response.data; // tutaj masz już wynik w JS

        // Reset pól
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        showSuccess(t('views.settings.changePassword.form.formSuccessfullySubmitted'));

        window.location.href = "/#settings";

    } catch (err: any) {
        console.error(err);
        showError("Failed to change password. Try again.");
    } finally {
        setLoading(false);
    }
};


    const isFormInvalid =
        !currentPassword || !newPassword || !confirmPassword ||
        !!currentPasswordError || !!newPasswordError || !!confirmPasswordError;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, px:2 }}>
        <Card sx={{ border: "1px solid #e0e0e0", p: 2, width: '100%', boxSizing: 'border-box', borderRadius: 2 }}>
            <Stack
    spacing={3}
    sx={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
    }}
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
                    helperText={t('views.settings.changePassword.form.newPassword.hint')}
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
        </Card>
        </Box>
    );
};

export default ChangePassword;
