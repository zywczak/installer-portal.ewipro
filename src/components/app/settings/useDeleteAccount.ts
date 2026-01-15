import { useState } from "react";
import api from "../../../api/axiosApi";
import { useAuthNotification } from "../../../context/AuthContext";
import { t } from "i18next";

export const useDeleteAccount = () => {
  const [deleting, setDeleting] = useState(false);

  const { showError } = useAuthNotification();

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.post({ action: "removeUserAccount" });
      localStorage.clear();
      globalThis.location.href = "/auth";
    } catch (err) {
      console.error(err);
      showError(t("views.settings.deleteAccount.confirmationModal.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  return { deleting, deleteAccount };
};
