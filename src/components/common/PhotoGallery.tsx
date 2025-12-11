import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

export interface PhotoGalleryItem {
  id: string;
  url: string; // URL do pełnego zdjęcia
  thumbnailUrl?: string; // opcjonalny thumbnail
  alt?: string;
}

interface PhotoGalleryProps {
  photos: PhotoGalleryItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (photo: PhotoGalleryItem, index: number) => void;
  showDeleteButton?: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  onDelete,
  showDeleteButton = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handleDelete = () => {
    if (onDelete && photos[currentIndex]) {
      onDelete(photos[currentIndex], currentIndex);
      setConfirmDeleteOpen(false);
      
      // Jeśli to było ostatnie zdjęcie, zamknij galerię
      if (photos.length === 1) {
        onClose();
      } else {
        // Przejdź do poprzedniego zdjęcia jeśli to było ostatnie w tablicy
        if (currentIndex >= photos.length - 1) {
          setCurrentIndex(photos.length - 2);
        }
      }
    }
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <>
      {/* Main Gallery */}
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bgcolor="rgba(0,0,0,0.85)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={9999}
        onClick={onClose}
      >
        {/* Close Button */}
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

        {/* Previous Button */}
        {photos.length > 1 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 60,
              height: 200,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.1)",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
            }}
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>
        )}

        {/* Image */}
        <Box
          component="img"
          src={currentPhoto.url}
          alt={currentPhoto.alt || `Photo ${currentIndex + 1}`}
          sx={{
            maxHeight: "80%",
            maxWidth: "90%",
            borderRadius: 2,
            objectFit: "contain",
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Next Button */}
        {photos.length > 1 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 60,
              height: 200,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.1)",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
            }}
          >
            <ArrowForwardIosIcon fontSize="large" />
          </IconButton>
        )}

        {/* Delete Button */}
        {showDeleteButton && onDelete && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDeleteOpen(true);
            }}
            sx={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              bgcolor: "rgba(0, 0, 0, 0.25)",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.47)" },
              width: 56,
              height: 56,
              borderRadius: "50%",
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        )}

        {/* Photo Counter */}
        {photos.length > 1 && (
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
            fontSize={14}
            fontWeight="bold"
          >
            {currentIndex + 1} / {photos.length}
          </Box>
        )}
      </Box>

      {/* Confirm Delete Dialog */}
      {confirmDeleteOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bgcolor="rgba(0,0,0,0.65)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={10000}
          onClick={(e) => {
            e.stopPropagation();
            setConfirmDeleteOpen(false);
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            bgcolor="#fff"
            p={3}
            borderRadius={2}
            width={300}
            textAlign="center"
            boxShadow={4}
          >
            <Box fontSize={18} fontWeight="bold" mb={1}>
              Remove photo?
            </Box>
            <Box mb={3} sx={{ opacity: 0.8 }}>
              Do you really want to remove this photo?
            </Box>

            <Box display="flex" gap={1}>
              <Box
                onClick={() => setConfirmDeleteOpen(false)}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 1,
                  bgcolor: "#ddd",
                  cursor: "pointer",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ccc" },
                }}
              >
                Cancel
              </Box>

              <Box
                onClick={handleDelete}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 1,
                  bgcolor: "#e53935",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#d32f2f" },
                }}
              >
                Yes, remove
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default PhotoGallery;
