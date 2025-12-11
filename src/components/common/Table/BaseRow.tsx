import { TableRow, TableCell } from "@mui/material";
import { Column } from "./DataTable";

interface BaseRowProps<T> {
  row: T;
  columns: Column<T>[];
  rowKey: string | number;
  onClick: () => void;
  getRowStatusColor?: (row: T) => string;
}

export default function BaseRow<T>({
  row,
  columns,
  rowKey,
  onClick,
  getRowStatusColor,
}: BaseRowProps<T>) {
  const statusColor = getRowStatusColor ? getRowStatusColor(row) : "transparent";

  return (
    <TableRow
      key={rowKey}
      onClick={onClick}
      sx={{
        backgroundColor: "inherit",
        "&:nth-of-type(even)": {
          backgroundColor:"#f9f9f9",
        },
        "&:nth-of-type(odd)": {
          backgroundColor: "#ffffff",
        },
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
        cursor: "pointer",
        transition: "background 0.2s ease",
        "td, th": { borderBottom: "1px solid #eee" },

        "& .MuiTableCell-root:first-of-type": {
          position: "relative",
          paddingLeft: "20px",
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: "6px",

          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            backgroundColor: statusColor,
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
          },
        },
         "& .MuiTableCell-root:last-of-type": {
          position: "relative",
          paddingLeft: "20px",
          borderTopRightRadius: "6px",
          borderBottomRightRadius: "6px",
         },
      }}
    >
      {columns.map((col) => (
        <TableCell key={String(col.key)}  align={col.align || "left"} sx={{ paddingY: "10px", paddingX: "16px", fontSize: "0.875rem" }}>
          {col.render ? col.render(row) : (row as any)[col.key]}
        </TableCell>
      ))}
    </TableRow>
  );
}
