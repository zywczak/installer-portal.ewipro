import { useState, useEffect } from "react";
import api from "../../../api/axiosApi";
import { mapProjectData } from "../../../utils/mapProjectData";
import { Project } from "./types";

interface UseProjectsOptions {
  sort?: "projectIDDESC" | "projectIDASC";
  ongoingOnly?: boolean;
}

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export const useProjects = (
  { sort = "projectIDDESC", ongoingOnly = false }: UseProjectsOptions = {}
): UseProjectsResult => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userID = localStorage.getItem("userID") ?? "";

  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const filters: any[] = [];
        if (ongoingOnly) filters.push({ ongoingOnly: true });

        const res = await api.post({
          action: "getProjectsList",
          filters,
          sort,
        });

        const data = Array.isArray(res.data?.projects)
          ? res.data.projects
          : [];

        setProjects(data.map((item: any) => mapProjectData(item, userID)));
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Nie udało się pobrać listy projektów."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [sort, ongoingOnly, userID]);

  return { projects, loading, error };
};
