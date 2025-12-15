import React from "react";
import { Box, Typography, Divider, IconButton, Button, useTheme, useMediaQuery } from "@mui/material";
import OnGoingProjects from "../common/projects&subcontractors/projects/OnGoingProjects";
import FinanceTiles from "../common/FinanceTiles";
import StatementDownloadTile from "../common/StatementDownloadTile";
import AddIcon from "@mui/icons-material/Add";
import { ArrowForwardIos } from "@mui/icons-material";

interface DashboardProps {
  isMobile: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isMobile }) => {
  const theme = useTheme();
  const showDownload = useMediaQuery("(min-width:960px)");

  const handleAddProjectClick = () => {
    window.location.hash = "#addProject";
  };

  const handleSeeAllClick = () => {
    window.location.hash = "#projects";
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

      <Divider sx={{ mb: 1 }} />

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
          sx={{ color: "#388E3C", fontSize: "2rem", padding: 1.2 }}
          onClick={handleAddProjectClick}
        >
          <AddIcon sx={{ fontSize: "2rem", fontWeight: "bold" }} />
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
          Ongoing projects
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
            fontWeight="bold"
            sx={{ fontSize: "0.85rem" }}
          >
            See all
          </Typography>

          <ArrowForwardIos
            sx={{ fontSize: "2rem", fontWeight: "bold", display: "flex", alignItems: "center" }}
          />
        </Button>
      </Box>

      <OnGoingProjects isMobile={isMobile} />
    </Box>
  );
};

export default Dashboard;
