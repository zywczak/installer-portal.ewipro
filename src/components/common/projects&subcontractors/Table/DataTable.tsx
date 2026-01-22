import React, { useEffect, useRef, useState } from "react";
import { Table, TableContainer, TableBody, Box} from "@mui/material";
import DataTableHeader from "./DataTableHeader";
import Footer from "../Footer";
import ProjectRow from "./ProjectRow";
import SubcontractorRow from "./SubcontractorRow";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

interface Props<T> {
  readonly columns: Column<T>[];
  readonly rows: T[];
  readonly rowKey: (row: T, index: number) => string | number;
  readonly maxHeight?: string | number;
  readonly onHorizontalOverflow?: (isOverflowing: boolean) => void;
  readonly onRowClick: (row: T, page: number) => void;
  readonly getRowStatusColor?: (row: T) => string;
  readonly type: "project" | "subcontractor";
  readonly stickyFooter?: boolean;
  readonly currentPage?: number;
  readonly onPageChange?: (page: number) => void;
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
  stickyFooter,
  currentPage: externalPage,
  onPageChange
}: Props<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(externalPage || 1);
  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));

  const paginatedRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (externalPage !== undefined) {
      setCurrentPage(externalPage);
    }
  }, [externalPage]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100% - 52px)", borderRadius: 2 }}>

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
        onPrev={() => handlePageChange(Math.max(currentPage - 1, 1))}
        onNext={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        onPageSelect={handlePageChange}
        sticky={stickyFooter}
      />

    </Box>
  );
}
