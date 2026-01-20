import React, { useRef, useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProjectsTable from "./ProjectsTable";
import ProjectsCards from "./ProjectsCards";
import { useProjects } from "./useProjects";
import Legend from "../../common/projects&subcontractors/Legend";
import { useTranslation } from "react-i18next";

interface ProjectsViewProps {
  isMobile: boolean;
  sort?: "projectIDDESC" | "projectIDASC";
  ongoingOnly?: boolean;
  showAddButton?: boolean;
  stickyFooter?: boolean;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
  isMobile,
  sort = "projectIDDESC",
  ongoingOnly = false,
  showAddButton = true,
  stickyFooter = true,
}) => {
   const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [useTiles, setUseTiles] = useState(false);
  const [savedWidth, setSavedWidth] = useState<number | null>(null);

  const { projects, loading, error } = useProjects({ sort, ongoingOnly });

  const handleRowClick = (row: any) => {
    globalThis.location.hash = `projects/${row.id}/${row.contactID}`;
  };

  const handleTableOverflow = (isOverflowing: boolean) => {
    if (isOverflowing && !useTiles) {
      setUseTiles(true);
      if (containerRef.current) setSavedWidth(containerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (useTiles && savedWidth !== null && width >= savedWidth + 1) {
          setUseTiles(false);
          setSavedWidth(null);
        }
      }
    });

    resizeObserver.observe(el);
    return () => {
      resizeObserver.unobserve(el);
      resizeObserver.disconnect();
    };
  }, [useTiles, savedWidth]);

  if (loading)
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (projects.length === 0)
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">{t("views.dashboard.projectList.listEmpty")}</Typography>
      </Box>
    );

  return (
    <Box sx={{ height: "100%" }} ref={containerRef}>

      <Legend type="project" showAddButton={showAddButton} />

      {isMobile || useTiles ? (
        <ProjectsCards projects={projects} stickyFooter={stickyFooter}/>
      ) : (
        <ProjectsTable
          rows={projects}
          onRowClick={handleRowClick}
          onOverflow={handleTableOverflow}
          stickyFooter={stickyFooter}
        />
      )}
    </Box>
  );
};

export default ProjectsView;
