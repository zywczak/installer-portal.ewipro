import { useState, useCallback } from "react";
import api from "../../../../api/axiosApi";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Subcontractor {
  id: number;
  name: string;
  avatar?: string | null;
}

interface AddMemberParams {
  subcontractorID: number;
  projectID: number;
  memberType: number;
}

interface RemoveMemberParams {
  subcontractorID: number;
  projectID: number;
  contactID: number;
}

interface UseProjectMembersResult {
  subcontractors: Subcontractor[];
  isFetchingSubcontractors: boolean;
  fetchSubcontractors: (ownerID?: number) => Promise<void>;
  addMember: (params: AddMemberParams) => Promise<void>;
  isAdding: boolean;
  removeMember: (params: RemoveMemberParams) => Promise<void>;
  isRemoving: boolean;
  error: string | null;
  clearError: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mapSubcontractor = (item: any): Subcontractor => ({
  id: item.userID,
  name: item.nameSurname || item.name || "-",
  avatar: item.avatar || null,
});

// ─── Hook ────────────────────────────────────────────────────────────────────

const useProjectMembers = (): UseProjectMembersResult => {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [isFetchingSubcontractors, setIsFetchingSubcontractors] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchSubcontractors = useCallback(async (ownerID?: number) => {
    setIsFetchingSubcontractors(true);
    setError(null);
    try {
      const payload: Record<string, any> = {
        action: "getSubcontractorsList",
        filters: [{ ongoingOnly: true }],
        sort: "projectIDDESC",
      };
      if (ownerID !== undefined) payload.ownerID = ownerID;

      const response = await api.post(payload);

      // mirrors useSubcontractors: res.data?.results || []
      const results: any[] = response.data?.results || [];
      setSubcontractors(results.map(mapSubcontractor));
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch subcontractors.";
      setError(message);
      throw err;
    } finally {
      setIsFetchingSubcontractors(false);
    }
  }, []);

  const addMember = useCallback(
    async ({ subcontractorID, projectID, memberType }: AddMemberParams) => {
      setIsAdding(true);
      setError(null);
      try {
        await api.post({
          action: "addMemberToProject",
          subcontractorID,
          projectID,
          memberType,
        });
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || "Failed to add member.";
        setError(message);
        throw err;
      } finally {
        setIsAdding(false);
      }
    },
    []
  );

  const removeMember = useCallback(
    async ({ subcontractorID, projectID, contactID }: RemoveMemberParams) => {
      setIsRemoving(true);
      setError(null);
      try {
        await api.post({
          action: "removeMemberFromProject",
          subcontractorID,
          projectID,
          contactID,
        });
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || "Failed to remove member.";
        setError(message);
        throw err;
      } finally {
        setIsRemoving(false);
      }
    },
    []
  );

  return {
    subcontractors,
    isFetchingSubcontractors,
    fetchSubcontractors,
    addMember,
    isAdding,
    removeMember,
    isRemoving,
    error,
    clearError,
  };
};

export default useProjectMembers;