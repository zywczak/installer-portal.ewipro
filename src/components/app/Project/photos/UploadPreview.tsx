import React from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

interface UploadPreviewProps {
  preview: { file: File; previewUrl: string };
  index: number;
  total: number;
  uploading: boolean;
  onCancel: () => void;
  onUpload: () => void;
}

const UploadPreview: React.FC<UploadPreviewProps> = ({ preview, index, total, uploading, onCancel, onUpload }) => {
  const { t } = useTranslation();
  return (
  <Box position="fixed" top={0} left={0} width="100vw" height="100vh" bgcolor="rgba(0,0,0,0.85)" display="flex" alignItems="center" justifyContent="center" zIndex={10000} onClick={onCancel}>
    <Box onClick={(e:any) => e.stopPropagation()} bgcolor="#fff" p={2} borderRadius={2} display="flex" flexDirection="column" alignItems="center" maxWidth={400} width="90%" boxShadow={4}>
      <Box component="img" src={preview.previewUrl} alt="preview" sx={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 2 }} />
      <Stack direction="row" spacing={2} mt={2}>
        <IconButton onClick={onCancel} sx={{ bgcolor: "#ddd", "&:hover": { bgcolor: "#ccc" }, borderRadius: 1 }}>
          <Typography fontWeight="bold">{t("views.gallery.confirmationModal.cancel")}</Typography>
        </IconButton>
        <IconButton disabled={uploading} onClick={onUpload} sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" }, color: "#fff", borderRadius: 1 }}>
          <Typography fontWeight="bold">{uploading ? t("views.gallery.confirmationModal.uploading") : t("views.gallery.confirmationModal.upload")}</Typography>
        </IconButton>
      </Stack>
    </Box>
  </Box>
)
};

export default UploadPreview;
