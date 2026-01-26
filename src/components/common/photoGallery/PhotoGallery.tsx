import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import PhotoGalleryControls from "./PhotoGalleryControls";

export interface PhotoGalleryItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
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

const overlaySx = {
  position: "fixed",
  inset: 0,
  bgcolor: "rgba(0,0,0,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

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

  const currentPhoto = photos[currentIndex];

  const prevPhoto = useCallback(
    () => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length]
  );

  const nextPhoto = useCallback(
    () => setCurrentIndex((i) => (i + 1) % photos.length),
    [photos.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape") onClose();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [isOpen, prevPhoto, nextPhoto, onClose]);

  const handleDelete = () => {
    if (!onDelete || !currentPhoto) return;

    onDelete(currentPhoto, currentIndex);
    setConfirmDeleteOpen(false);

    if (photos.length <= 1) onClose();
    else if (currentIndex >= photos.length - 1)
      setCurrentIndex(photos.length - 2);
  };

  if (!isOpen || photos.length === 0) return null;

  return (
    <>
      <Box sx={overlaySx} onClick={onClose}>
        <Box
          component="img"
          src={currentPhoto.url}
          alt={currentPhoto.alt || `Photo ${currentIndex + 1}`}
          onClick={(e:any) => e.stopPropagation()}
          sx={{
            maxHeight: "80%",
            maxWidth: "90%",
            objectFit: "contain",
            borderRadius: 2,
          }}
        />

        <PhotoGalleryControls
          currentIndex={currentIndex}
          total={photos.length}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          onClose={onClose}
          onDelete={() => setConfirmDeleteOpen(true)}
          showDeleteButton={showDeleteButton}
        />
      </Box>

      {confirmDeleteOpen && (
        <ConfirmDeleteDialog
          photo={currentPhoto}
          onCancel={() => setConfirmDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default PhotoGallery;
