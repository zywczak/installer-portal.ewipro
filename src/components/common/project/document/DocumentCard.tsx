import React from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from '@mui/icons-material/Description';
import { FileItem } from "../../../../hooks/useDocuments";
import MainCard from "../../MainCard";

interface DocumentCardProps {
  file: FileItem;
  index: number;
  handleDownload: (url: string, name: string) => void;
}

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp || timestamp === 0) return "Brak daty";
  try {
    const date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "Nieprawidłowa data";
  }
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ file, index, handleDownload }) => {
  const isAvailable = !!file.url;
  const formattedDate = formatTimestamp(file.stamp);

  return (
    <MainCard>
      <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
        <Box sx={{ backgroundColor: '#3f97dc', color: '#fff', borderRadius: 1.5, p: 1, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DescriptionIcon sx={{ fontSize: 32 }} />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {file.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.8rem" }}>
            Investigation No: GC/EWIPRO/{file.id}
          </Typography>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => handleDownload(file.url, file.name)} disabled={!isAvailable} size="large">
            <DownloadIcon sx={{ fontSize: 26 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontSize: "0.85rem" }}>
          Form signed by
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Avatar src={file.icon || undefined} alt={file.author} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#4CAF50' }}>
              {file.author}
            </Typography>
            <Typography variant="body2" color="textPrimary" sx={{ fontSize: "0.85rem" }}>
              {formattedDate}
            </Typography>
          </Box>
        </Box>
      </Box>
    </MainCard>
  );
};
