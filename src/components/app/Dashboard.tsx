import React from "react";
import { Box, Typography, Divider, IconButton, Button, useMediaQuery } from "@mui/material";
import FinanceTiles from "../common/dashboard/FinanceTiles";
import StatementDownloadTile from "../common/dashboard/StatementDownloadTile";
import AddIcon from "@mui/icons-material/Add";
import { ArrowForwardIos } from "@mui/icons-material";
import ProjectsView from "../common/projects&subcontractors/projects/ProjectsView";
import { t } from "i18next";

interface DashboardProps {
  isMobile: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isMobile }) => {
  const showDownload = useMediaQuery("(min-width:960px)");

  const handleAddProjectClick = () => {
    globalThis.location.hash = "#addProject";
  };

  const handleSeeAllClick = () => {
    globalThis.location.hash = "#projects";
  };

  const handleDownloadStatement = () => {
    console.log("Downloading statement...");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
         <Box
        sx={{
          flexGrow: 1,
          minWidth: showDownload ? "500px" : "0",
          width: showDownload ? "auto" : "100%",
        }}
      >
          <FinanceTiles />
        </Box>

        {showDownload && (
          <Box sx={{ flexBasis: "50%", display: "flex", mr: 2 }}>
            <StatementDownloadTile onDownloadClick={handleDownloadStatement} />
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, my: 1 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <IconButton
          size="medium"
          sx={{ color: "#388E3C", fontSize: "1.9rem", padding: 1.2, "&:hover": { bgcolor: "transparent" } }}
          onClick={handleAddProjectClick}
        >
          <AddIcon sx={{ fontSize: "1.9rem", fontWeight: "bold" }} />
        </IconButton>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            fontSize: "20px",
            textAlign: "center",
            flex: 1,
          }}
        >
          {t("views.dashboard.ongoingProjects")}
        </Typography>

        <Button
          size="small"
          onClick={handleSeeAllClick}
          sx={{
            color: "#388E3C",
            minWidth: "auto",
            padding: 0,
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          <Typography
            variant="caption"
            fontWeight="800"
            sx={{ fontSize: "0.9rem" }}
          >
            {t("views.dashboard.projectList.seeAll")}
          </Typography>

          <ArrowForwardIos
            sx={{ fontSize: "2rem", fontWeight: "bold", display: "flex", alignItems: "center" }}
          />
        </Button>
      </Box>

      <ProjectsView isMobile={isMobile} ongoingOnly sort="projectIDASC" showAddButton={false} stickyFooter={false} />
    </Box>
  );
};

export default Dashboard;
