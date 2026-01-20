import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export interface CustomSelectIconProps {
  sx?: SxProps<Theme>;
}

export const CustomSelectIcon = ({ sx }: CustomSelectIconProps) => (
  <ArrowForwardIosIcon
    sx={{
      fontSize: "1rem",
      color: "gray",
      pointerEvents: "none",
      mr: 1,
      ...sx,
    }}
  />
);

export const renderValue = (title: string, value?: string) => {
  const displayValue = value && value !== "" ? value : "Choose";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        pr: 4,
      }}
    >
      <Typography variant="body1" fontWeight={500}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        color={displayValue === "Choose" ? "text.secondary" : "text.primary"}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};
