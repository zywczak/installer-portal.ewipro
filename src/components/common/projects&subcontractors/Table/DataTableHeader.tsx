import { TableHead, TableRow, TableCell, Typography } from "@mui/material";
import { Column } from "./DataTable";

interface Props<T> {
  columns: Column<T>[];
}

export default function DataTableHeader<T>({ columns }: Props<T>) {
  return (
    <TableHead
      sx={{
        "& .MuiTableCell-root": {
          borderBottom: "1px solid #ccc",
          borderTop: "1px solid #ccc",
          color: "#333",
          fontSize: "0.85rem",
          textTransform: "uppercase",
          fontWeight: 600,
          paddingY: "12px",
          paddingX: "16px",
        },
      }}
    >
      <TableRow>
        {columns.map((col) => (
          <TableCell
            key={col.key as string}
            align={col.align || "left"}
            style={{ fontWeight: "bold" }}
          >
            <Typography variant="caption" fontWeight="bold" color="inherit">
              {col.label}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
