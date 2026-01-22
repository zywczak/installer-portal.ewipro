import React, { useRef, useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import SubcontractorsTable from "./SubcontractorsTable";
import SubcontractorsCards from "./SubcontractorsCards";
import { useSubcontractors } from "./useSubcontractors";
import { User } from "./types";
import Legend from "../../common/projects&subcontractors/Legend";
import { useTranslation } from "react-i18next";

interface Props {
  isMobile: boolean;
  onSubcontractorClick?: (id: string) => void;
}

const Subcontractors: React.FC<Props> = ({ isMobile, onSubcontractorClick }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [useTiles, setUseTiles] = useState(false);
  const [savedWidth, setSavedWidth] = useState<number | null>(null);

  const { users, loading, error } = useSubcontractors();

  const getCurrentPage = (): number => {
    try {
      const rawHash = globalThis.location.hash || "";
      const hashWithoutHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
      const queryPart = hashWithoutHash.includes("?") ? hashWithoutHash.split("?")[1] : "";
      const params = new URLSearchParams(queryPart);
      const page = params.get("page");
      return page ? Number.parseInt(page, 10) : 1;
    } catch {
      return 1;
    }
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPage());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getCurrentPage());
    };
    globalThis.addEventListener("hashchange", handleHashChange);
    return () => globalThis.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handlePageChange = (page: number) => {
    const rawHash = globalThis.location.hash || "";
    const hashWithoutHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
    const basePath = hashWithoutHash.includes("?") ? hashWithoutHash.split("?")[0] : hashWithoutHash;
    globalThis.location.hash = `${basePath}?page=${page}`;
    setCurrentPage(page);
  };

  const handleRowClick = (user: User) => {
    if (onSubcontractorClick) onSubcontractorClick(user.id.toString());
    else globalThis.location.hash = `subcontractors/${user.id}`;
  };

  const handleTableOverflow = (isOverflowing: boolean) => {
    if (isOverflowing && !useTiles) {
      setUseTiles(true);
      if (containerRef.current) setSavedWidth(containerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (useTiles && savedWidth && width >= savedWidth + 1) {
          setUseTiles(false);
          setSavedWidth(null);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [useTiles, savedWidth]);

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error) return <Box textAlign="center" py={4}><Typography color="error">{error}</Typography></Box>;
  if (users.length === 0) return <Box textAlign="center" py={4}><Typography color="text.secondary">{t("views.subcontractors.listEmpty.title")}</Typography></Box>;

  return (
    <Box sx={{ height: "100%" }} ref={containerRef}>
      <Legend type="subcontractor" />
      {isMobile || useTiles
        ? <SubcontractorsCards 
            users={users} 
            onItemClick={(id) => handleRowClick({ id } as unknown as User)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        : <SubcontractorsTable 
            users={users} 
            onRowClick={handleRowClick} 
            onOverflow={handleTableOverflow}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />}
    </Box>
  );
};

export default Subcontractors;
