import api from "../../../api/axiosApi";
import { TeamMember } from "./types";

export const fetchSubcontractors = async (
  ownerId: number,
  setLoading?: (loading: boolean) => void,
  setError?: (error: string | null) => void
): Promise<TeamMember[]> => {
  if (!ownerId) return [];

  try {
    setLoading?.(true);
    setError?.(null);

    const resp = await api.post({
      action: "getSubcontractorsList",
      ownerId,
    });

    const results = resp.data?.results || [];

    return results.map((u: any): TeamMember => ({
      id: u.ID,
      name: u.nameSurname,
      role: "",
      email: u.email,
      avatarUrl: u.avatar || null,
      invited: !!u.invited,
    }));
  } catch (err) {
    console.error("Error fetching subcontractors", err);
    setError?.("Failed to load subcontractors");
    return [];
  } finally {
    setLoading?.(false);
  }
};

