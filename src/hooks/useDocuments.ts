import { useState, useEffect } from "react";
import api from "../api/axiosApi";

export interface FileItem {
  id: number;
  name: string;
  author: string;
  icon: string;
  url: string;
  stamp: number;
}

export const useDocuments = (projectId: number) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.post({
          action: "getProjectForms",
          projectID: projectId,
        });

        if (res.data?.status && res.data?.results) {
          const documents: FileItem[] = res.data.results.map((doc: any) => ({
            id: doc.id,
            name: doc.formName,
            author: doc.authorName,
            icon: doc.icon || "",
            url: doc.pdfURI || "",
            stamp: doc.stamp || null,
          }));
          setFiles(documents);
        } else {
          setFiles([]);
        }
      } catch (err: any) {
        console.error("Błąd pobierania dokumentów:", err);
        setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu dokumentów.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [projectId]);

  return { files, loading, error };
};
