import { useState } from "react";
import api from "../api/axiosApi";

export const useDeleteAccount = (showSuccess?: (msg: string) => void, showError?: (msg: string) => void) => {
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.post({ action: "removeUserAccount" });
      showSuccess?.("Konto zostało usunięte");
      localStorage.removeItem("access");
      window.location.href = "/auth";
    } catch (err) {
      console.error(err);
      showError?.("Nie udało się usunąć konta");
    } finally {
      setDeleting(false);
    }
  };

  return { deleting, deleteAccount };
};
