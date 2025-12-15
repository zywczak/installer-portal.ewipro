import { TableRow, TableCell, Box } from "@mui/material";
import React from "react";

export default function ExpandedRow({ children }: { children: React.ReactNode }) {
  return (
    <TableRow>
      <TableCell
        colSpan={100}
        sx={{ 
          p: 0, 
          background: "transparent",
          borderTop: "none", 
          borderBottom: "none",
          position: "relative" 
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            background: "#c5c5c5",
            borderTop: "none", 
            borderRadius: "6px",
            
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, -100%)",
              
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid #c5c5c5",
              
              mt: "-1px"
            },
            
          }}
        >
          {children}
        </Box>
      </TableCell>
    </TableRow>
  );
}