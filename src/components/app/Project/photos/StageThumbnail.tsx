import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface PhotoItem {
  id: string;
  photo_uri: string;
  full_uri: string;
  real_name: string;
}

interface StageThumbnailProps {
  stage: string;
  photos: PhotoItem[];
  extraCount: number;
  color: { border: string; bg: string; color: string };
  onClick: (index: number) => void;
}

const IMAGE_OVERLAY_COLOR = "#2D3538";

const StageThumbnail: React.FC<StageThumbnailProps> = ({ stage, photos, extraCount, color, onClick }) => {
  const { t } = useTranslation();
  let gridTemplateAreas: string;

  switch (photos.length) {
    case 1:
      gridTemplateAreas = `"a"`;
      break;
    case 2:
      gridTemplateAreas = `"a b"`;
      break;
    case 3:
      gridTemplateAreas = `"a b" "a c"`;
      break;
    default:
      gridTemplateAreas = `"a b" "c d"`;
  }

  let gridTemplateRows: string;

  if (photos.length === 1 || photos.length === 2) {
    gridTemplateRows = "1fr";
  } else {
    gridTemplateRows = "1fr 1fr";
  }

  return (

    <Box sx={{ width: 150, height: 150, borderRadius: 2, p: 1, display: "flex", flexDirection: "column", alignItems: "center", border: `3px solid ${color.border}`, bgcolor: color.bg }}>
      <Box sx={{
        width: "100%", height: "100%", display: "grid", background: IMAGE_OVERLAY_COLOR,
        borderRadius: 1, overflow: "hidden",
        gridTemplateColumns: photos.length === 1 ? "1fr" : "1fr 1fr",
        gridTemplateRows: gridTemplateRows,
        gridTemplateAreas: gridTemplateAreas
      }}>
        {photos.map((photo, index) => {
          const isLast = index === photos.length - 1;
          const showOverlay = isLast && extraCount > 0;
          let area = ["a", "b", "c", "d"][index] || "a";
          return (
            <Box key={photo.id} gridArea={area} sx={{ cursor: "pointer", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", filter: showOverlay ? "grayscale(80%) brightness(60%)" : "none" }} onClick={() => onClick(index)}>
              <Box component="img" src={photo.photo_uri} alt={photo.real_name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {showOverlay && <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -50%)" }} display="flex" alignItems="center" justifyContent="center" bgcolor="rgba(0,0,0,0.5)" color="#fff" fontWeight="bold" fontSize={20} borderRadius="50%" width={50} height={50} zIndex={2}>+{extraCount}</Box>}
            </Box>
          );
        })}
      </Box>
      <Typography fontWeight="bold" textAlign="center" mt={1} sx={{ fontSize: 16, fontFamily: "'Helvetica Neue', Arial, sans-serif", color: color.color }}>
        {t("views.gallery.projectStage")} {stage}
      </Typography>
    </Box>
  );
}

export default StageThumbnail;
