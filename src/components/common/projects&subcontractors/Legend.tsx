import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import warranty from '../../../assets/warranty.png';
import AddIcon from "@mui/icons-material/Add";
import { t } from "i18next";

interface LegendProps {
  type: "project" | "subcontractor";
  showAddButton?: boolean;
}

const Legend: React.FC<LegendProps> = ({ type, showAddButton = true }) => {
  const handleAddProjectClick = () => {
    globalThis.location.hash = "#addProject";
  };

  if (type === "project") {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        pt={2}
        mb={1}
        px={2}
      >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flex={1}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, bgcolor: "#54A852", borderRadius: 1 }} />
            <Typography variant="body2">{t("views.MyProjects.legend.open")}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 12, bgcolor: "#e91e63", borderRadius: 1 }} />
            <Typography variant="body2">{t("views.MyProjects.legend.closed")}</Typography>
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
            <Typography variant="body2">{t("views.MyProjects.legend.warranty")}</Typography>
          </Stack>
        </Stack>

        {showAddButton && (
          <IconButton
            size="medium"
            sx={{ color: "#388E3C", fontSize: "1rem", padding: 0, m: 0 }}
            onClick={handleAddProjectClick}
          >
            <AddIcon sx={{ fontSize: "1.7rem", fontWeight: "bold" }} />
          </IconButton>
        )}
      </Stack>
    );
  }

  if (type === "subcontractor") {
    return (
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" pt={2} mb={1} px={2}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#54A852", borderRadius: 1 }} />
          <Typography variant="body2">{t("views.subcontractors.legend.verified")}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#fbc02d", borderRadius: 1 }} />
          <Typography variant="body2">{t("views.subcontractors.legend.invited")}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 12, height: 12, bgcolor: "#9b9b9b", borderRadius: 1 }} />
          <Typography variant="body2">{t("views.subcontractors.legend.notRegistered")}</Typography>
        </Stack>
      </Stack>
    );
  }

  return null;
};

export default Legend;
