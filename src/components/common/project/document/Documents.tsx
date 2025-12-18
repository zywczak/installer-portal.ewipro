import React from "react";
import { Box, CircularProgress } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import SourceIcon from '@mui/icons-material/Source';
import { useDocuments } from "../../../../hooks/useDocuments";
import EmptyStateBox from "../../EmptyStateBox";
import { DocumentCard } from "./DocumentCard";
import Header from "../../Header";
import MainCard from "../../MainCard";

interface DocumentsProps {
  projectId: number;
}

export const Documents: React.FC<DocumentsProps> = ({ projectId }) => {
  const { files, loading, error } = useDocuments(projectId);

  const handleDownload = (url: string, name: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert(`Nie można pobrać pliku "${name}". Brakuje adresu URL.`);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={3}>
        <CircularProgress />
        <Box mt={1}>Ładowanie dokumentów...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={3}>
        <Box color="error.main">{error}</Box>
      </Box>
    );
  }

  return (
    <MainCard>
      <Header
        icon={<SourceIcon />}
        title="Documents"
        description="Download channel"
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {files.length === 0 ? (
          <EmptyStateBox icon={<InboxIcon />} text="No documents available" />
        ) : (
          files.map((file, index) => (
            <Box key={index} sx={{ flex: '1 1 320px', maxWidth: '100%' }}>
              <DocumentCard file={file} index={index} handleDownload={handleDownload} />
            </Box>
          ))
        )}
      </Box>
    </MainCard>
  );
};
