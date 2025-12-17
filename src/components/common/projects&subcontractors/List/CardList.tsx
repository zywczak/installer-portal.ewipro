import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProjectListItem from "./ProjectListItem";
import SubcontractorListItem from "./SubcontractorListItem";
import Footer from "../Footer";

interface CardListProps {
  items: any[];
  type: "project" | "subcontractor";
  itemsPerPage?: number;
  onItemClick?: (item: any) => void;
  stickyFooter?: boolean;
}

const CardList: React.FC<CardListProps> = ({ items, type, itemsPerPage = 20, onItemClick, stickyFooter = true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [items]);
  useEffect(() => { if(currentPage > totalPages) setCurrentPage(totalPages || 1); }, [totalPages]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100% - 52px)" }}>
      <Box sx={{ 
        flex: 1, 
        overflowY: "auto", 
        p: 2, 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
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
        onPrev={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onPageSelect={(page) => setCurrentPage(page)}
        sticky={stickyFooter}
      />
    </Box>
  );
};

export default CardList;
