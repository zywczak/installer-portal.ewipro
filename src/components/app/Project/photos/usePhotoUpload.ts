import { useState, useCallback } from "react";
import api from "../../../../api/axiosApi";
import { useAuthNotification } from "../../../../context/AuthContext";

interface UsePhotoUploadProps {
  projectId: number;
  contactId: number;
  onUploadComplete?: () => void;
}

export const usePhotoUpload = ({
  projectId,
  contactId,
  onUploadComplete,
}: UsePhotoUploadProps) => {
  const { showError, showSuccess } = useAuthNotification();

  const [uploadPreviews, setUploadPreviews] = useState<
    { file: File; previewUrl: string }[]
  >([]);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [uploadPreviewOpen, setUploadPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFilesSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const jpgFiles = Array.from(files).filter(
        (file) =>
          file.type === "image/jpeg" ||
          file.name.toLowerCase().endsWith(".jpg")
      );

      if (!jpgFiles.length) {
        showError("Only JPG files are allowed.");
        e.target.value = "";
        return;
      }

      if (jpgFiles.length > 15) {
        showError("You can upload maximum 15 files at once.");
        e.target.value = "";
        return;
      }

      setUploadPreviews(
        jpgFiles.map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        }))
      );
      setCurrentUploadIndex(0);
      setUploadPreviewOpen(true);
      e.target.value = "";
    },
    [showError]
  );

  const uploadNextPhoto = useCallback(async () => {
    if (currentUploadIndex >= uploadPreviews.length) {
      setUploadPreviewOpen(false);
      setUploadPreviews([]);
      setCurrentUploadIndex(0);
      showSuccess("All photos uploaded successfully.");
      onUploadComplete?.();
      return;
    }

    const current = uploadPreviews[currentUploadIndex];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("action", "postPhotoToProjectStage");
      formData.append("projectID", String(projectId));
      formData.append("contactID", String(contactId));
      formData.append("photo", current.file);

      const res = await api.post(formData);

      if (!res.data?.status) {
        throw new Error(res.data?.message || "Upload failed");
      }

      const nextIndex = currentUploadIndex + 1;
      setCurrentUploadIndex(nextIndex);
      
      if (nextIndex >= uploadPreviews.length) {
        setUploadPreviewOpen(false);
        setUploadPreviews([]);
        setCurrentUploadIndex(0);
        setUploading(false);
        showSuccess("All photos uploaded successfully.");
        onUploadComplete?.();
        return;
      }
    } catch (err: any) {
      console.error(err);
      showError(
        err.response?.data?.message
      );
      const nextIndex = currentUploadIndex + 1;
      setCurrentUploadIndex(nextIndex);
      
      if (nextIndex >= uploadPreviews.length) {
        setUploadPreviewOpen(false);
        setUploadPreviews([]);
        setCurrentUploadIndex(0);
        setUploading(false);
        onUploadComplete?.();
        return;
      }
    } finally {
      setUploading(false);
    }
  }, [
    currentUploadIndex,
    uploadPreviews,
    projectId,
    contactId,
    onUploadComplete,
    showError,
    showSuccess,
  ]);

  const resetUpload = useCallback(() => {
    setUploadPreviewOpen(false);
    setUploadPreviews([]);
    setCurrentUploadIndex(0);
    setUploading(false);
  }, []);

  return {
    uploadPreviews,
    currentUploadIndex,
    uploadPreviewOpen,
    uploading,
    handleFilesSelected,
    uploadNextPhoto,
    resetUpload,
    setUploadPreviews,
    setCurrentUploadIndex,
    setUploadPreviewOpen,
  };
};
