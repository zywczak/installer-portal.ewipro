import { Avatar, Box, IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  photo: string;
  hasAvatar: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDelete: () => void;
  onChange: (file: File) => void;
}

const ProfileAvatar: React.FC<Props> = ({
  photo,
  hasAvatar,
  fileInputRef,
  onDelete,
  onChange,
}) => (
  <Box sx={{ position: "relative", mb: 3 }}>
    <Avatar src={photo} sx={{ width: 140, height: 140,  border: "2px solid #ccc", zIndex: 1, pointerEvents: 'none' }} />

    <IconButton onClick={() => fileInputRef.current?.click()}
        sx={{
        position: "absolute",
        bottom: 3,
        right: 3,
        bgcolor: "white",
        boxShadow: 2,
        zIndex: 2,
        "&:hover": { bgcolor: "#f0f0f0" },
        }}
    >
      <CameraAltIcon color="action" fontSize="medium" />
    </IconButton>

    {hasAvatar && (
      <IconButton 
        onClick={onDelete}
        sx={{
            position: "absolute",
            top: 3,
            right: 5,
            bgcolor: "white",
            boxShadow: 2,
            zIndex: 2,
            p: 0.5,
            "&:hover": { bgcolor: "#f0f0f0" },
        }}
    >
        <CloseIcon color="error" fontSize="medium" />
      </IconButton>
    )}

    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => e.target.files && onChange(e.target.files[0])}
    />
  </Box>
);

export default ProfileAvatar;