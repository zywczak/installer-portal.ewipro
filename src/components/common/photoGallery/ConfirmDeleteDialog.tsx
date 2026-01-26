import React from "react";
import { Box } from "@mui/material";
import { PhotoGalleryItem } from "./PhotoGallery";

interface ConfirmDeleteDialogProps {
  photo: PhotoGalleryItem;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  photo,
  onCancel,
  onConfirm,
}) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      bgcolor: "rgba(0,0,0,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
    }}
    onClick={onCancel}
  >
    <Box
      onClick={(e:any) => e.stopPropagation()}
      bgcolor="#fff"
      p={3}
      borderRadius={2}
      width={300}
      textAlign="center"
    >
      <Box fontWeight="bold" mb={1}>
        Remove photo?
      </Box>
      <Box mb={3} sx={{ opacity: 0.8 }}>
        Do you really want to remove this photo?
      </Box>

      <Box display="flex" gap={1}>
        <Box
          flex={1}
          py={1.5}
          bgcolor="#ddd"
          borderRadius={1}
          sx={{ cursor: "pointer" }}
          onClick={onCancel}
        >
          Cancel
        </Box>
        <Box
          flex={1}
          py={1.5}
          bgcolor="#e53935"
          color="#fff"
          borderRadius={1}
          sx={{ cursor: "pointer" }}
          onClick={onConfirm}
        >
          Yes, remove
        </Box>
      </Box>
    </Box>
  </Box>
);

export default ConfirmDeleteDialog;
