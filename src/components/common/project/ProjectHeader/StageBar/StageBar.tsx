import React, { useRef, useLayoutEffect, useState } from "react";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

import EmptyStateBox from "../../../EmptyStateBox";
import StageMobile from "./StageMobile";
import { StageDesktop } from "./StageDesktop";
import { useProjectStages } from "../../../../../hooks/useProjectStages";

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
  const isMobile = useMediaQuery("(max-width:705px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [forceMobile, setForceMobile] = useState(false);

  const { stages, loading, error } = useProjectStages({ stagingSystemID });

  useLayoutEffect(() => {
    if (!containerRef.current || stages.length === 0) return;

    let debounceTimeout: number;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const tileWidth = 215;
      const totalWidth = stages.length * tileWidth;
      const hysteresis = 50;

      const shouldBeMobile = forceMobile
        ? totalWidth > width - hysteresis
        : totalWidth > width + hysteresis;

      if (shouldBeMobile !== forceMobile) {
        window.clearTimeout(debounceTimeout);
        debounceTimeout = window.setTimeout(
          () => setForceMobile(shouldBeMobile),
          20
        );
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
