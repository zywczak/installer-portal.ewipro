import { useState, useCallback } from "react";
import api from "../api/axiosApi";

interface UsePhotoUploadProps {
  projectId: number;
  contactId: number;
  onUploadComplete?: () => void;
}

export const usePhotoUpload = ({ projectId, contactId, onUploadComplete }: UsePhotoUploadProps) => {
  const [uploadPreviews, setUploadPreviews] = useState<{ file: File; previewUrl: string }[]>([]);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [uploadPreviewOpen, setUploadPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFilesSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const jpgFiles = Array.from(files).filter(file =>
      file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg")
    );
    if (!jpgFiles.length) return setErrorMsg("Only JPG files are allowed.");
    if (jpgFiles.length > 15) return setErrorMsg("You can upload maximum 15 files at once.");

    setUploadPreviews(jpgFiles.map(file => ({ file, previewUrl: URL.createObjectURL(file) })));
    setCurrentUploadIndex(0);
    setUploadPreviewOpen(true);
    e.target.value = "";
  }, []);

  const uploadNextPhoto = useCallback(async () => {
    if (currentUploadIndex >= uploadPreviews.length) {
      setUploadPreviewOpen(false);
      setUploadPreviews([]);
      setSuccessMsg("All photos uploaded successfully.");
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
      if (!res.data?.status) throw new Error(res.data?.message || "Upload failed");

      setCurrentUploadIndex(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Error while uploading photo.");
      setCurrentUploadIndex(prev => prev + 1);
    } finally {
      setUploading(false);
    }
  }, [currentUploadIndex, uploadPreviews, projectId, contactId, onUploadComplete]);

  const resetUpload = useCallback(() => {
    setUploadPreviewOpen(false);
    setUploadPreviews([]);
    setCurrentUploadIndex(0);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, []);

  return {
    uploadPreviews,
    currentUploadIndex,
    uploadPreviewOpen,
    uploading,
    errorMsg,
    successMsg,
    handleFilesSelected,
    uploadNextPhoto,
    resetUpload,
    setUploadPreviews,
    setCurrentUploadIndex,
    setUploadPreviewOpen,
  };
};
