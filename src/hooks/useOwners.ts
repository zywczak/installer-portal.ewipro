import { useState, useCallback } from "react";
import api from "../api/axiosApi";

export interface Owner {
  userID: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export const useOwners = (showError?: (msg: string) => void) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOwners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.post({ action: 'getMyOwners' });
      setOwners(res.data?.results ?? []);
    } catch (err) {
      console.error(err);
      showError?.('Nie udało się pobrać listy Ownerów');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return { owners, loading, loadOwners };
};
