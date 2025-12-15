import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import api from "../../../api/axiosApi"
import EmptyStateBox from "../EmptyStateBox";
import InboxIcon from '@mui/icons-material/Inbox';
import StageMobile from "./StageMobile";
import { StageDesktop } from "./StageDesktop";

interface Stage {
  id?: number;
  stageNo?: number;
  stageName: string;
  stageNameShort: string;
}

interface StageBarProps {
  currentStage: number;
  stagingSystemID: number;
  projectMaxStage?: number;
  projectStatusName?: string;
}

const StageBar: React.FC<StageBarProps> = ({
  currentStage,
  stagingSystemID,
  projectMaxStage,
  projectStatusName,
}) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width:705px)");
  const [forceMobile, setForceMobile] = useState(false);

  useEffect(() => {
    const fetchStages = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access");
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
          fetchedStages.push({ stageName: "Project has been finished", stageNameShort: "Closure" });
          setStages(fetchedStages);
        } else {
          setError("Nie udało się pobrać etapów projektu.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu etapów.");
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, [stagingSystemID]);

  useLayoutEffect(() => {
    if (!containerRef.current || stages.length === 0) return;
    let debounceTimeout: number;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;

      const width = entries[0].contentRect.width;
      const tileWidth = 215;
      const totalWidth = stages.length * tileWidth;
      const hysteresis = 50;

      const shouldBeMobile = forceMobile
        ? totalWidth > (width - hysteresis)
        : totalWidth > (width + hysteresis);

      if (shouldBeMobile !== forceMobile) {
        window.clearTimeout(debounceTimeout);
        debounceTimeout = window.setTimeout(() => setForceMobile(shouldBeMobile), 150);
      }
    });

    observer.observe(containerRef.current);
    return () => {
      window.clearTimeout(debounceTimeout);
      observer.disconnect();
    };
  }, [stages, forceMobile]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Box mt={2} width="calc(100% - 19px)">
        <EmptyStateBox icon={<InboxIcon />} text={error} />
      </Box>
    );

  return (
    <Box ref={containerRef} width="100%">
      {forceMobile || isMobile ? (
        <StageMobile
          stages={stages}
          currentStage={currentStage}
          projectMaxStage={projectMaxStage}
          projectStatusName={projectStatusName}
        />
      ) : (
        <StageDesktop
          stages={stages}
          currentStage={currentStage}
          projectMaxStage={projectMaxStage}
          projectStatusName={projectStatusName}
        />
      )}
    </Box>
  );
};

export default StageBar;
