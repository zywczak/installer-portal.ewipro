import { useState, useCallback } from "react";
import api from "../api/axiosApi";
import { useAuthNotification } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export interface Owner {
  userID: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export const useOwners = () => {
  const { t } = useTranslation();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);

  const { showError } = useAuthNotification();

  const loadOwners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.post({ action: 'getMyOwners' });
      setOwners(res.data?.results ?? []);
    } catch (err) {
      console.error(err);
      showError(t("views.settings.useDefaultOwner.fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return { owners, loading, loadOwners };
};
