import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProjectListItem from "../../../app/Projects/ProjectListItem";
import SubcontractorListItem from "./SubcontractorListItem";
import Footer from "../Footer";

interface CardListProps {
  items: any[];
  type: "project" | "subcontractor";
  itemsPerPage?: number;
  onItemClick?: (item: any) => void;
  stickyFooter?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  noFooterOffset?: boolean;
}

const CardList: React.FC<CardListProps> = ({ 
  items, 
  type, 
  itemsPerPage = 20, 
  onItemClick, 
  stickyFooter = true,
  currentPage: externalPage,
  onPageChange,
  noFooterOffset
}) => {
  const [currentPage, setCurrentPage] = useState(externalPage || 1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (externalPage !== undefined) {
      setCurrentPage(externalPage);
    }
  }, [externalPage]);

  useEffect(() => { 
    if(currentPage > totalPages && totalPages > 0) {
      const newPage = totalPages;
      setCurrentPage(newPage);
      if (onPageChange) onPageChange(newPage);
    }
  }, [totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: noFooterOffset ? "100%" : "calc(100% - 52px)" }}>
      <Box sx={{ 
        flex: 1, 
        overflowY: "auto", 
        p: 2,
        pb: noFooterOffset ? 13 : 2, 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gridAutoRows: "max-content",
        alignContent: "start",
        gap: 2,  
        "&::-webkit-scrollbar": {
          width: 0,
          height: 0,
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {paginatedItems.map((item, index) =>
          type === "project" ? (
            <ProjectListItem key={`${currentPage}-${index}`} {...item} onClick={() => onItemClick?.(item)} />
          ) : (
            <SubcontractorListItem key={`${currentPage}-${index}`} {...item} onClick={() => onItemClick?.(item)} />
          )
        )}
      </Box>
      <Footer
        currentPage={currentPage}
        totalPages={totalPages}
        itemsCount={paginatedItems.length}
        onPrev={() => handlePageChange(Math.max(currentPage - 1, 1))}
        onNext={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        onPageSelect={handlePageChange}
        sticky={stickyFooter}
      />
    </Box>
  );
};

export default CardList;
