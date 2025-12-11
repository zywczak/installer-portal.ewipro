import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ProjectListItem from "./ProjectListItem";
import SubcontractorListItem from "./SubcontractorListItem";
import warranty from '../../../assets/warranty.png';
import DataTableFooter from "../Table/DataTableFooter";

interface CardListProps {
  items: any[];
  type: "project" | "subcontractor";
  itemsPerPage?: number;
  onItemClick?: (item: any) => void;
  stickyFooter?: boolean;
}

const CardList: React.FC<CardListProps> = ({
  items,
  type,
  itemsPerPage = 20,
  onItemClick,
  stickyFooter = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  return (
    // <Box sx={{ display: "flex", flexDirection: "column" }}>
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Legend */}
       <Box sx={{ flexShrink: 0 }}>
      {type === "project" && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: "center" }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, bgcolor: "#54A852", borderRadius: 1 }} />
            <Typography variant="body2">Project open</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, bgcolor: "#e91e63", borderRadius: 1 }} />
            <Typography variant="body2">Project closed</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 16, height: 16 }}>
              <img 
    src={warranty} 
    alt="Warranty" 
    style={{ width: 16, height: 16, display: 'block' }} 
  />
            </Box>
            <Typography variant="body2">Warranty</Typography>
          </Stack>
        </Stack>
      )}

      {type === "subcontractor" && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: "center" }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, bgcolor: "#54A852", borderRadius: 1 }} />
            <Typography variant="body2">Verified</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, bgcolor: "#fbc02d", borderRadius: 1 }} />
            <Typography variant="body2">Invited</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, bgcolor: "#9b9b9b", borderRadius: 1 }} />
            <Typography variant="body2">Not Registered</Typography>
          </Stack>
        </Stack>
      )}
      </Box>
       <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: 2,
        pb: 2,
        pt: 2,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 2,
        "&::-webkit-scrollbar": { display: "none" }, // ukrywa scroll w Chrome/Safari/Edge
    scrollbarWidth: "none",
      }}
    >
        {paginatedItems.map((item, index) =>
          type === "project" ? (
            <ProjectListItem key={`${currentPage}-${index}`} {...item} onClick={() => onItemClick?.(item)} />
          ) : (
            <SubcontractorListItem key={`${currentPage}-${index}`} {...item} onClick={() => onItemClick?.(item)} />
          )
        )}
      </Box>

      {/* Footer */}
      <DataTableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        itemsCount={paginatedItems.length}
        onPrev={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onPageSelect={(page) => setCurrentPage(page)}
        sticky={stickyFooter}
      />
    </Box>
  );
};

export default CardList;
