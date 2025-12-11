import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import warranty from '../../../assets/warranty.png';

interface LegendProps {
  type: "project" | "subcontractor";
}

const Legend: React.FC<LegendProps> = ({ type }) => {
  if (type === "project") {
    return (
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mb={1}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#54A852", borderRadius: 1 }} />
          <Typography variant="body2">Project open</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#e91e63", borderRadius: 1 }} />
          <Typography variant="body2">Project closed</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
  <Box
    sx={{
      width: 16,
      height: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src={warranty}
      alt="Warranty"
      style={{ width: 16, height: 16, display: "block" }}
    />
  </Box>
  <Typography variant="body2">Warranty</Typography>
</Stack>
      </Stack>
    );
  }

  if (type === "subcontractor") {
    return (
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mb={1}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#54A852", borderRadius: 1 }} />
          <Typography variant="body2">Verified</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#fbc02d", borderRadius: 1 }} />
          <Typography variant="body2">Invited</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#9b9b9b", borderRadius: 1 }} />
          <Typography variant="body2">Not Registered</Typography>
        </Stack>
      </Stack>
    );
  }

  return null;
};

export default Legend;
