import React from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

interface PhotoGalleryControlsProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

const navButtonSx = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 60,
  height: 200,
  color: "#fff",
  bgcolor: "rgba(0,0,0,0.1)",
  borderRadius: 1,
  "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
};

const PhotoGalleryControls: React.FC<PhotoGalleryControlsProps> = ({
  currentIndex,
  total,
  onPrev,
  onNext,
  onClose,
  onDelete,
  showDeleteButton = false,
}) => {
  const hasMany = total > 1;

  return (
    <>
      {/* CLOSE */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.4)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      {/* PREV */}
      {hasMany && (
        <IconButton sx={{ ...navButtonSx, left: 0 }} onClick={(e) => { e.stopPropagation(); onPrev(); }}>
          <ArrowBackIosNewIcon fontSize="large" />
        </IconButton>
      )}

      {/* NEXT */}
      {hasMany && (
        <IconButton sx={{ ...navButtonSx, right: 0 }} onClick={(e) => { e.stopPropagation(); onNext(); }}>
          <ArrowForwardIosIcon fontSize="large" />
        </IconButton>
      )}

      {/* DELETE */}
      {showDeleteButton && onDelete && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.3)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
          }}
        >
          <DeleteIcon fontSize="large" />
        </IconButton>
      )}

      {/* COUNTER */}
      {hasMany && (
        <Box
          position="absolute"
          bottom={16}
          left="50%"
          sx={{ transform: "translateX(-50%)" }}
          bgcolor="rgba(0,0,0,0.6)"
          color="#fff"
          px={2}
          py={1}
          borderRadius={2}
          fontWeight="bold"
        >
          {currentIndex + 1} / {total}
        </Box>
      )}
    </>
  );
};

export default PhotoGalleryControls;
