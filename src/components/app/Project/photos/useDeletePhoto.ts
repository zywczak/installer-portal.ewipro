import { useCallback } from "react";
import api from "../../../../api/axiosApi";
import { PhotoItem } from "./types";
import { PhotoGalleryItem } from "../../../common/photoGallery/PhotoGallery";

interface UseDeletePhotoProps {
  projectId: number;
  photosByStage: Record<string, PhotoItem[]>;
  setPhotosByStage: React.Dispatch<React.SetStateAction<Record<string, PhotoItem[]>>>;
}

export const useDeletePhoto = ({ projectId, photosByStage, setPhotosByStage }: UseDeletePhotoProps) => {
  const deletePhoto = useCallback(
    async (photo: PhotoGalleryItem, stage: string) => {
      const stagePhotos = photosByStage[stage];
      const photoToDelete = stagePhotos?.find(p => p.id === photo.id);
      if (!photoToDelete) return;

      try {
        const payload = {
          action: "deleteProjectPhoto",
          projectID: projectId,
          fileRealPath: photoToDelete.file_real_path,
        };

        const res = await api.post(payload);
        if (!res.data?.status) throw new Error(res.data?.message || "Backend error");

        setPhotosByStage(prev => {
          const updated = { ...prev };
          const updatedStage = updated[stage].filter(p => p.id !== photo.id);
          if (updatedStage.length) updated[stage] = updatedStage;
          else delete updated[stage];
          return updated;
        });

        return true;
      } catch (err: any) {
        console.error(err);
        throw err;
      }
    },
    [photosByStage, projectId, setPhotosByStage]
  );

  return { deletePhoto };
};
