import React from "react";
import { Card, Box } from "@mui/material";

interface MainCardProps {
  children: React.ReactNode;
}

const MainCard: React.FC<MainCardProps> = ({ children }) => {
  return (
    <Card
      sx={{
        border: "1px solid #e0e0e0",
        p: 2,
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 2,
        mx: "auto",
        my: 0.5,
      }}
    >
      {children}
    </Card>
  );
};

export default MainCard;
