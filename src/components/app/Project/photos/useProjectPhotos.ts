import { useState, useEffect, useCallback } from "react";
import api from "../../../../api/axiosApi";
import { PhotoItem } from "./types";

interface UseProjectPhotosProps {
  projectId: number;
  contactId: number;
}

export const useProjectPhotos = ({ projectId, contactId }: UseProjectPhotosProps) => {
  const [photosByStage, setPhotosByStage] = useState<Record<string, PhotoItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    setError(null);

    try {
      const res = await api.post({
        action: "getProjectPhotos",
        projectID: projectId,
        contactID: contactId,
      });

      if (res.data?.status && res.data?.results) {
        const grouped: Record<string, PhotoItem[]> = {};
        res.data.results.forEach((dirObj: any) => {
          grouped[dirObj.dir] = dirObj.photos.map((p: any) => ({
            id: p.id,
            photo_uri: p.photo_uri,
            full_uri: p.full_uri,
            real_name: p.real_name,
            file_real_path: p.file_real_path,
            dir: dirObj.dir,
          }));
        });
        setPhotosByStage(grouped);
      } else {
        setPhotosByStage({});
      }
    } catch (err: any) {
      console.error("Error fetching photos:", err);
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, contactId]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  return { photosByStage, setPhotosByStage, loading, error, fetchPhotos };
};
