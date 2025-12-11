import axios from "axios";
import { TeamMember } from "../common/steps/types";

export const fetchSubcontractors = async (
  ownerId: number,
  setLoading?: (loading: boolean) => void,
  setError?: (error: string | null) => void
): Promise<TeamMember[]> => {
  if (!ownerId) return [];

  setLoading?.(true);
  setError?.(null);

  try {
    const token = localStorage.getItem("access");
    const resp = await axios.post(
      "https://api-veen-e.ewipro.com/installer/info/",
      { action: "getSubcontractorsList", ownerId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const results = resp.data?.results || [];
    console.log("Fetched subcontractors:", results);
    return results.map((u: any) => ({
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
