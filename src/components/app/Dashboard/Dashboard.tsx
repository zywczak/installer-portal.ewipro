import React from "react";
import { Box, Typography, Divider, IconButton, Button, useMediaQuery } from "@mui/material";
import FinanceTiles from "./FinanceTiles";
import StatementDownloadTile from "./StatementDownloadTile";
import AddIcon from "@mui/icons-material/Add";
import { ArrowForwardIos } from "@mui/icons-material";
import ProjectsView from "../../common/projects&subcontractors/projects/ProjectsView";
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
            position: "relative",
            "&:hover": {
              bgcolor: "transparent",
              "& .see-all-text": {
                opacity: 1,
                transform: "translateX(-100%)",
                pointerEvents: "auto",
              },
            },
          }}
        >
          <Typography
            variant="caption"
            fontWeight="800"
            className="see-all-text"
            sx={{
              backgroundColor: "#E8F5E9",
              fontSize: "0.9rem",
              boxSizing: "border-box",
              padding: "4px 8px",
              position: "absolute",
              right: "-520%",
              opacity: 0,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              transform: "translateX(-90%)",
              transition: "opacity 0.2s ease, transform 0.25s ease",
            }}
          >
            {t("views.dashboard.projectList.seeAll")}
          </Typography>

          <ArrowForwardIos
            sx={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          />
        </Button>

      </Box>

      <ProjectsView isMobile={isMobile} ongoingOnly sort="projectIDASC" showAddButton={false} stickyFooter={false} />
    </Box>
  );
};

export default Dashboard;
