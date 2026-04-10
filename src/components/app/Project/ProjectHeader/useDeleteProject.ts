import { useState } from "react";
import api from "../../../../api/axiosApi";

interface DeleteProjectParams {
  projectID: number;
  contactID: number;
}

interface UseDeleteProjectResult {
  deleteProject: (params: DeleteProjectParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useDeleteProject = (): UseDeleteProjectResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProject = async ({ projectID, contactID }: DeleteProjectParams) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post({
        action: "deleteProject",
        projectID,
        contactID,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to delete project.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProject, isLoading, error };
};

export default useDeleteProject;