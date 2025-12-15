import React, { useEffect, useRef, useState } from "react";
import { Table, TableContainer, TableBody, Box} from "@mui/material";
import DataTableHeader from "./DataTableHeader";
import Footer from "../Footer";
import ProjectRow from "./ProjectRow";
import SubcontractorRow from "./SubcontractorRow";
import ExpandedRow from "./ExpandedRow";
import ProjectRowDetails from "./ProjectRowDetails";
import Legend from "../Legend";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  maxHeight?: string | number;
  onHorizontalOverflow?: (isOverflowing: boolean) => void;
  onRowClick: (row: T, page: number) => void;

  getRowStatusColor?: (row: T) => string;

  type: "project" | "subcontractor";

  stickyFooter?: boolean;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  maxHeight = "100%",
  onHorizontalOverflow,
  onRowClick,
  getRowStatusColor,
  type,
  stickyFooter
}: Props<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));

  const paginatedRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [rows]);

  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);

  useEffect(() => {
    setExpandedRow(null);
  }, [currentPage, rows]);

  const handleRowClickInternal = (row: T, index: number) => {
    if (type === "subcontractor") {
      onRowClick(row, currentPage);
      return;
    }

    const key = `${currentPage}-${index}`;
    setExpandedRow(expandedRow === key ? null : key);
    onRowClick(row, currentPage);
  };

  useEffect(() => {
    if (!onHorizontalOverflow) return;

    const el = tableContainerRef.current;
    if (!el) return;

    const check = () => onHorizontalOverflow(el.scrollWidth > el.clientWidth);

    check();
    const obs = new ResizeObserver(check);
    obs.observe(el);

    return () => obs.disconnect();
  }, [onHorizontalOverflow, rows]);

  const RowComponent = type === "project" ? ProjectRow : SubcontractorRow;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", borderRadius: 2 }}>

  <Legend type={type} />

      <TableContainer
        ref={tableContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1,
          mt: 2,
          width: "98%",
          mx: "auto",
          maxHeight,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          boxSizing: "border-box",
        }}
      >
        <Table stickyHeader>
          <DataTableHeader columns={columns} />

          <TableBody>
            {paginatedRows.map((row, index) => {
              const key = `${currentPage}-${index}`;
              const isExpanded = expandedRow === key;

              return (
                <React.Fragment key={key}>
                  <RowComponent
                    row={row}
                    columns={columns}
                    index={index}
                    rowKey={rowKey}
                    onClick={() => handleRowClickInternal(row, index)}
                    getRowStatusColor={getRowStatusColor}
                  />

                  {/* Rozwijane wiersze jeśli potrzebne */}
                  {/* {type === "project" && isExpanded && (
                    <ExpandedRow>
                      <ProjectRowDetails row={row} />
                    </ExpandedRow>
                  )} */}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Footer
        currentPage={currentPage}
        totalPages={totalPages}
        itemsCount={paginatedRows.length}
        onPrev={() => setCurrentPage(p => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        onPageSelect={(page) => setCurrentPage(page)}
        sticky={stickyFooter}
      />

    </Box>
  );
}
