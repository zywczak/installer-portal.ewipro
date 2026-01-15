import React from "react";
import { Box, Typography, Card, CardActionArea } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { t } from "i18next";

interface StatementDownloadTileProps {
  onDownloadClick: () => void;
}

const StatementDownloadTile: React.FC<StatementDownloadTileProps> = ({
  onDownloadClick,
}) => {

  return (
    <Card
      sx={{
        width: "100%",
        flexShrink: 0,
        border: "1px solid #3877B6",
        borderRadius: 2,
        overflow: "hidden",
        p: 0,
        my: 2,
      }}
    >
      <CardActionArea
        onClick={onDownloadClick}
        sx={{
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >

          <FileDownloadOutlined
            sx={{
              fontSize: "3rem",
              color: "#3877B6",
              marginBottom: 1,
            }}
          />

          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#3877B6",
            }}
          >
            {t("views.dashboard.statements.download")}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default StatementDownloadTile;