import { useState, useEffect } from "react";
import api from "../api/axiosApi";
import { mapProjectData } from "../utils/mapProjectData";
import { Project } from "../components/common/projects&subcontractors/projects/types";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userID = localStorage.getItem("userID") ?? "";

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.post({
          action: "getProjectsList",
          filters: [],
          sort: "projectIDDESC",
        });

        const data = Array.isArray(res.data?.projects) ? res.data.projects : [];
        setProjects(data.map((item: any) => mapProjectData(item, userID)));
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Nie udało się pobrać listy projektów.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userID]);

  return { projects, loading, error };
};
