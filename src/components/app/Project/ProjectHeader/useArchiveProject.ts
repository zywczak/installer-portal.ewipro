import { useState } from "react";
import api from "../../../../api/axiosApi"; // adjust path to your api instance

interface ArchiveProjectParams {
  projectID: number;
  contactID: number;
}

interface UseArchiveProjectResult {
  archiveProject: (params: ArchiveProjectParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useArchiveProject = (): UseArchiveProjectResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const archiveProject = async ({ projectID, contactID }: ArchiveProjectParams) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post({
        action: "archiviseProject",
        projectID,
        contactID,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to archive project.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { archiveProject, isLoading, error };
};

export default useArchiveProject;