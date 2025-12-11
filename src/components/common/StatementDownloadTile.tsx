import React from "react";
import { Box, Typography, Card, CardActionArea } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface StatementDownloadTileProps {
  // Możesz dodać props do obsługi logiki pobierania
  onDownloadClick: () => void;
}

const StatementDownloadTile: React.FC<StatementDownloadTileProps> = ({
  onDownloadClick,
}) => {
  const { t } = useTranslation();

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%", // W Dashboard dostosujemy, by zajmował dostępne miejsce
        flexShrink: 0, // Domyślnie nie pozwalamy na jego kurczenie
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        p: 0,
        my: 2,
        
      }}
    >
      <CardActionArea
        onClick={onDownloadClick}
        sx={{
          minHeight: "100%", // Wypełnia całą wysokość Card
          display: "flex",
          alignItems: "center",
          border: "2px solid #3877B6",
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
          {/* Ikona pobierania */}
          <FileDownloadOutlined
            sx={{
              fontSize: "3.5rem",
              color: "#3877B6",
              marginBottom: 1,
            }}
          />
          {/* Tekst przycisku */}
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#3877B6",
            }}
          >
            Download Statement
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default StatementDownloadTile;