import React, { useState, useCallback } from "react";
import { Box, Typography, CircularProgress, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PhotoGallery, { PhotoGalleryItem } from "../../../common/photoGallery/PhotoGallery";
import StageThumbnail from "./StageThumbnail";
import UploadPreview from "./UploadPreview";

import { useProjectPhotos } from "./useProjectPhotos";
import { useDeletePhoto } from "./useDeletePhoto";
import { usePhotoUpload } from "./usePhotoUpload";
import { fallbackColors, stageColors } from "../../../common/colors";
import EmptyStateBox from "../../../common/EmptyStateBox";
import Header from "../../../common/Header";
import { useAuthNotification } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";

interface PhotosProps {
  projectId: number;
  contactId: number;
  isProjectClosed: boolean;
  sideBySideWithChat?: boolean;
}

const Photos: React.FC<PhotosProps> = ({ projectId, contactId, isProjectClosed, sideBySideWithChat = false }) => {
  const { t } = useTranslation();
  const {photosByStage, setPhotosByStage, loading, error, fetchPhotos } = useProjectPhotos({ projectId, contactId });
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
const { showError, showSuccess } = useAuthNotification();
  const onUploadComplete = useCallback(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const {
    uploadPreviews,
    currentUploadIndex,
    uploadPreviewOpen,
    uploading,
    handleFilesSelected,
    uploadNextPhoto,
    resetUpload,
  } = usePhotoUpload({ projectId, contactId, onUploadComplete });

  const { deletePhoto } = useDeletePhoto({ projectId, photosByStage, setPhotosByStage });

  const getStageColor = useCallback((stageNo?: number, index?: number) => {
    if (stageNo != null) return stageColors[stageNo] ?? fallbackColors;
    return stageColors[(index ?? 0) + 1] ?? fallbackColors;
  }, []);

  const openLightbox = useCallback((stage: string, index: number) => {
    setCurrentStage(stage);
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = () => setLightboxOpen(false);

  const getGalleryPhotos = useCallback((): PhotoGalleryItem[] => {
    if (!currentStage || !photosByStage[currentStage]) return [];
    return photosByStage[currentStage].map(photo => ({
      id: photo.id,
      url: photo.full_uri,
      thumbnailUrl: photo.photo_uri,
      alt: photo.real_name,
    }));
  }, [currentStage, photosByStage]);

  const handleUploadClick = () => document.getElementById("photo-upload-input")?.click();

  const handleDelete = async (photo: PhotoGalleryItem) => {
    if (!currentStage) return;
    const isLastPhotoInStage = photosByStage[currentStage]?.length === 1;
    
    try {
      if (isLastPhotoInStage) {
        closeLightbox();
      }
      await deletePhoto(photo, currentStage);
      showSuccess("Photo deleted successfully.");
      fetchPhotos();
    } catch (err) {
      showError("Error deleting photo.");
      console.error("Error deleting photo", err);
    }
  };

  if (loading) return (
    <Box textAlign="center" py={4}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box textAlign="center" py={4}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  const sortedStages = Object.keys(photosByStage).sort((a, b) => Number(a) - Number(b));

  return (
    <Box p={3} height="100%" borderRadius={3} boxShadow={2} bgcolor="#fff">
      <input
        id="photo-upload-input"
        type="file"
        accept=".jpg,image/jpeg"
        multiple
        style={{ display: "none" }}
        onChange={handleFilesSelected}
      />

      <Header
        icon={<PhotoCameraIcon />}
        title={t("projectDetails.photos")}
        description={`EWI Stages ${t("projectDetails.PhotoDocumentation")}`}
        actions={!isProjectClosed && (
          <IconButton
            onClick={handleUploadClick}
            sx={{
              backgroundColor: "#E0E0E0",
              width: 30,
              height: 30,
              borderRadius: "25%",
              "&:hover": { backgroundColor: "#D0D0D0" }
            }}
          >
            <AddIcon fontSize="medium" sx={{ color: "#333" }} />
          </IconButton>
        )}
      />

      <Stack
        direction="row"
        overflow="auto"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        sx={{
          width: "100%",
          ...(sideBySideWithChat && { maxHeight: "calc(100% - 125px)", overflowY: "auto", pr: 1 }),
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {Object.keys(photosByStage).length === 0 ? (
          <EmptyStateBox
            icon={<PhotoCameraIcon />}
            text="No photos yet"
            onClick={isProjectClosed ? undefined : handleUploadClick}
          />
        ) : (
          sortedStages.map((stage, idx) => {
            const stagePhotos = photosByStage[stage] || [];
            const previewPhotos = stagePhotos.slice(0, 4);
            const extraCount = stagePhotos.length - 4;
            const color = getStageColor(Number(stage), idx);

            return (
              <StageThumbnail
                key={stage}
                stage={stage}
                photos={previewPhotos}
                extraCount={extraCount}
                color={color}
                onClick={(i) => openLightbox(stage, i)}
              />
            );
          })
        )}
      </Stack>

      <PhotoGallery
        photos={getGalleryPhotos()}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onDelete={isProjectClosed ? undefined : handleDelete}
        showDeleteButton={!isProjectClosed}
      />

      {uploadPreviewOpen && uploadPreviews.length > 0 && uploadPreviews[currentUploadIndex] && (
        <UploadPreview
          preview={uploadPreviews[currentUploadIndex]}
          index={currentUploadIndex}
          total={uploadPreviews.length}
          uploading={uploading}
          onCancel={resetUpload}
          onUpload={uploadNextPhoto}
        />
      )}
    </Box>
  );
};

export default Photos;
