  import React from "react";
  import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    styled,
    Box,
    Typography,
  } from "@mui/material";

  const CELL_PADDING = "12px";

  const HeaderCell = styled(TableCell)({
    fontWeight: 600,
    textAlign: "center",
    backgroundColor: "#F5F5F5",
    border: "1px solid #e0e0e0",
    whiteSpace: "nowrap",
    padding: CELL_PADDING,
  });

  const RowHeaderCell = styled(TableCell)({
    fontWeight: 500,
    textAlign: "center",
    border: "1px solid #e0e0e0",
    padding: CELL_PADDING,
  });

  const DataCell = styled(TableCell)({
    textAlign: "center",
    border: "1px solid #e0e0e0",
    fontSize: "0.9rem",
    verticalAlign: "middle",
    padding: CELL_PADDING,
  });


  export interface TableHeader {
    id: number;
    header_type: "column" | "row";
    label?: string | null;
    order: number;
    data_type?: string | null;
    image?: string | null;
    icon_name?: string;
    border_color?: string | null;
    background_color?: string | null;
    scale_min?: number | null;
    scale_max?: number | null;
  }

  export interface TableCellData {
    id: number;
    row_index: number;
    column_index: number;
    value?: string | null;
  }

  export interface Table {
    id: number;
    show_column_headers: boolean;
    show_row_headers: boolean;
    headers: TableHeader[];
    cells: TableCellData[];
  }

  interface HelpTableProps {
    table: Table;
  }

  const HelpTable: React.FC<HelpTableProps> = ({ table }) => {
    const rowHeaders = table.headers
      .filter((h) => h.header_type === "row")
      .sort((a, b) => a.order - b.order);

    const columnHeaders = table.headers
      .filter((h) => h.header_type === "column")
      .sort((a, b) => a.order - b.order);

    const hasColumns = columnHeaders.length > 0;

    const getCellContent = (
    rowHeader: TableHeader,
    colHeader: TableHeader | null,
    cell?: TableCellData
  ): React.ReactNode => {
    const dataType = rowHeader.data_type || colHeader?.data_type || "text";
    const value = cell?.value ?? null;

    if (value === null || value === undefined || value === "") return "N/A";

    // BOOLEAN
    if (dataType === "boolean") {
      const boolValue =
        value === "true" || value === "1" || value === "yes" || value === "tak";
      return boolValue ? (
        <Typography sx={{ color: "green", fontWeight: "bold", fontSize: "24px" }}>✔</Typography>
      ) : (
        <Typography sx={{ color: "red", fontWeight: "bold", fontSize: "24px" }}>✘</Typography>
      );
    }

    if (dataType === "scale" && rowHeader.icon_name) {
    const numValue = Number(value);
    const max = rowHeader.scale_max ?? 5;
    const iconSize = 24;
    const gap = 2;

    const coverPercent = Math.max(0, 1 - numValue / max) * 100;

    return (
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Box sx={{ display: "flex" }}>
          {Array.from({ length: max }).map((_, i) => (
            <img
              key={i}
              src={rowHeader.icon_name}
              alt="scale-icon"
              style={{ width: iconSize, height: iconSize, marginRight: i < max - 1 ? gap : 0 }}
            />
          ))}
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: `${coverPercent}%`,
            backgroundColor: "rgba(255,255,255,0.8)",
          }}
        />
      </Box>
    );
  }


    return value;
  };

    return (
      <TableContainer
    component={Paper}
    elevation={0}
    sx={{
      overflowX: "auto",
    }}
  >
        <MuiTable
    size="small"
    sx={{
      borderCollapse: "collapse",
      tableLayout:
          (columnHeaders.length <= 1 && table.show_column_headers) ||
          (!table.show_column_headers && columnHeaders.length === 0)
            ? "auto"
            : "fixed",
        width: "100%",
        minWidth: "max-content",
    }}
  >

      {table.show_column_headers && hasColumns && (
    <TableHead>
      <TableRow>
        {table.show_row_headers && (
          <HeaderCell
            sx={(theme) => ({
              background: "none",
              border: "none",
              ...(rowHeaders.length > 0 && rowHeaders[0].border_color
                ? { borderLeft: `3px solid ${rowHeaders[0].border_color}` }
                : {}),
            })}
          />
        )}

        {columnHeaders.map((col) => (
          <HeaderCell
    key={col.id}
    sx={{
        whiteSpace: "wrap",
      ...(col.border_color ? { borderTop: `3px solid ${col.border_color}` } : {}),
      ...(col.background_color ? { background: col.background_color } : {}),
    }}
  >

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {
              col.image && (
                <img
                  src={col.image}
                  alt={col.label || "header-image"}
                  style={{ width: 100 }}
                />
              )}
              {col.label}
            </Box>
          </HeaderCell>
        ))}
      </TableRow>
    </TableHead>
  )}


          <TableBody>
            {rowHeaders.map((row) => (
              <TableRow key={row.id}>
                {table.show_row_headers && (
    <RowHeaderCell
    sx={{
    whiteSpace: "wrap",
      ...(row.background_color ? { background: row.background_color } : {}),
    }}
  >

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {row.image ? (
        <img
          src={row.image}
          alt={row.label || "row-image"}
          style={{
            height: 120,
            objectFit: "contain",
            marginBottom: 4,
          }}
        />
      ) : null}
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, textAlign: "center" }}
      >
        {row.label}
      </Typography>
    </Box>
  </RowHeaderCell>

  )}
                {hasColumns ? (
                  columnHeaders.map((col) => {
                    const cell = table.cells.find(
                      (c) => c.row_index === row.order && c.column_index === col.order
                    );
                    return (
                      <DataCell key={`${row.id}-${col.id}`}>
                        {getCellContent(row, col, cell)}
                      </DataCell>
                    );
                  })
                ) : (
                  <DataCell key={`single-${row.id}`}>
                    {getCellContent(
                      row,
                      null,
                      table.cells.find((c) => c.row_index === row.order)
                    )}
                  </DataCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    );
  };

  export default HelpTable;
