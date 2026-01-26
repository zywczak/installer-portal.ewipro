import { useState, useEffect } from "react";
import api from "../../../api/axiosApi";
import { ProjectDetails } from "./types";

export const useProjectData = (projectId: number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await api.post({
          action: "getProjectDetails",
          projectID: projectId,
        });

        if (res.data?.status && res.data?.result) {
          setProject(res.data.result);
        } else {
          setError("Download project error.");
        }
      } catch (err: any) {
        console.error(err);
        setError("Download project error.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  return { loading, error, project };
};