import React from "react";
import { Box, CircularProgress } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import SourceIcon from '@mui/icons-material/Source';
import { useDocuments } from "./useDocuments";
import EmptyStateBox from "../../../common/EmptyStateBox";
import { DocumentCard } from "./DocumentCard";
import MainCard from "../../../common/MainCard";
import Header from "../../../common/Header";
import { useTranslation } from "react-i18next";

interface DocumentsProps {
  projectId: number;
}

export const Documents: React.FC<DocumentsProps> = ({ projectId }) => {
  const { files, loading, error } = useDocuments(projectId);
  const { t } = useTranslation();
  const handleDownload = (url: string, name: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={3}>
        <CircularProgress />
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
        title={t("views.documents.title")}
        description={t("views.documents.description")}
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
          <EmptyStateBox icon={<InboxIcon />} text={t("views.documents.listEmpty")} isDisabled={true} />
        ) : (
          files.map((file, index) => (
            <Box key={file.id || index} sx={{ flex: '1 1 320px', maxWidth: '100%' }}>
              <DocumentCard file={file} index={index} handleDownload={handleDownload} />
            </Box>
          ))
        )}
      </Box>
    </MainCard>
  );
};
