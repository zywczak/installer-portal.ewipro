import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ProjectListItem from "./ProjectListItem";
import SubcontractorListItem from "./SubcontractorListItem";
import warranty from '../../../assets/warranty.png';
import DataTableFooter from "../Table/DataTableFooter";
import Legend from "./Legend";
import MembersList from "./MembersList";

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
        <Legend type={type} />
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
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
  }}
>
  {paginatedItems.map((item, index) =>
    type === "project" ? (
      <ProjectListItem
        key={`${currentPage}-${index}`}
        {...item}
        onClick={() => onItemClick?.(item)}
        renderMembers={() => <MembersList members={item.members} />}
      />
    ) : (
      <SubcontractorListItem
        key={`${currentPage}-${index}`}
        {...item}
        onClick={() => onItemClick?.(item)}
      />
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
