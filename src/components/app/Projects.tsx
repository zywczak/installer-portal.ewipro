import React, { useRef, useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProjectsTable from "../common/projects&subcontractors/projects/ProjectsTable";
import ProjectsCards from "../common/projects&subcontractors/projects/ProjectsCards";
import { useProjects } from "../../hooks/useProjects";

interface ProjectsProps {
  isMobile: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ isMobile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useTiles, setUseTiles] = useState(false);
  const [savedWidth, setSavedWidth] = useState<number | null>(null);

  const { projects, loading, error } = useProjects();

  const handleRowClick = (row: any) => {
    window.location.hash = `projects/${row.id}/${row.contactID}`;
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

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error) return <Box textAlign="center" py={4}><Typography color="error">{error}</Typography></Box>;
  if (projects.length === 0) return <Box textAlign="center" py={4}><Typography color="text.secondary">Nie znaleziono żadnych danych.</Typography></Box>;

  return (
    <Box sx={{ height: "100%" }} ref={containerRef}>
      {isMobile || useTiles
        ? <ProjectsCards projects={projects} />
        : <ProjectsTable rows={projects} onRowClick={handleRowClick} onOverflow={handleTableOverflow} />}
    </Box>
  );
};

export default Projects;
