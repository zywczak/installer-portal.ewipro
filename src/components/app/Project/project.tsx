import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import { useProjectData } from "./useProjectData";
import { getTabsForWidth } from "./tabsConfig";
import ProjectContent from "./ProjectContent";
import BottomTabs from "../../common/BottomTabs";
import { useResponsiveWidth } from "./seResponsiveWidth";
import { useAddressSync } from "./seAddressSync";

interface ProjectProps {
  projectId: number;
  contactId: number;
  onAddressChange?: (addr: string | null) => void;
}

const Project: React.FC<ProjectProps> = ({ projectId, contactId, onAddressChange }) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [activeTab, setActiveTab] = useState<string>("home");

  const { loading, error, project } = useProjectData(projectId);
  const width = useResponsiveWidth(containerRef);
  
  useAddressSync(project, activeTab, onAddressChange);

  const tabs = getTabsForWidth(width);

  return (
    <Box display="flex" flexDirection="column" height="100%" ref={containerRef}>
      <Box
        flex={1}
        sx={{
          overflowY: "auto",
          px: 2,
          pt: 1,
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        <ProjectContent
          loading={loading}
          error={error}
          project={project}
          activeTab={activeTab}
          width={width}
          contactId={contactId}
          projectId={projectId}
          tabs={tabs}
        />
      </Box>

      <BottomTabs
        value={activeTab}
        tabs={tabs}
        onChange={setActiveTab}
      />
    </Box>
  );
};

export default Project;