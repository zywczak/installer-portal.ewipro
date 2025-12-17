import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Notification } from "./types";

interface Props {
  notification: Notification;
  onClick: () => void;
  onToggleRead: () => void;
  onDelete: () => void;
  isLast: boolean;
}

const NotificationItem: React.FC<Props> = ({
  notification,
  onClick,
  onToggleRead,
  onDelete,
  isLast,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography
            variant="body2"
            fontWeight={notification.read ? 400 : 600}
          >
            {notification.title}
          </Typography>

          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="caption" color="text.secondary">
              {notification.time}
            </Typography>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead();
              }}
            >
              {notification.read ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" noWrap>
          {notification.message}
        </Typography>
      </Box>

      {!isLast && <Divider />}
    </Box>
  );
};

export default React.memo(NotificationItem);
