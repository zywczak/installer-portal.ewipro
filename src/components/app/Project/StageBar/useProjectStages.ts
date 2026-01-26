import { useEffect, useState } from "react";
import api from "../../../../api/axiosApi";

export interface Stage {
  id?: number;
  stageNo?: number;
  stageName: string;
  stageNameShort: string;
}

interface UseProjectStagesParams {
  stagingSystemID: number;
}

export const useProjectStages = ({ stagingSystemID }: UseProjectStagesParams) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStages = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.post({
          action: "getStagingSystemData",
          stagingSystemID,
        });

        if (res.data?.status && res.data?.result) {
          const fetchedStages = res.data.result.map((s: any) => ({
            id: s.id,
            stageNo: s.stageNo,
            stageName: s.stageName,
            stageNameShort: s.stageNameShort,
          }));

          fetchedStages.push({
            stageName: "Project has been finished",
            stageNameShort: "Closure",
          });

          setStages(fetchedStages);
        } else {
          setError("Failed to download project stages");
        }
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [stagingSystemID]);

  return {
    stages,
    loading,
    error,
  };
};
