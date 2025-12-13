import { ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface SidebarMenuItemProps {
  text: string;
  icon: React.ReactNode;
  selected: boolean;
  isCollapsed: boolean;
  isMobile?: boolean;
  onClick: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  text,
  icon,
  selected,
  isCollapsed,
  isMobile = false,
  onClick,
}) => {
  if (isMobile) {
    return (
      <ListItemButton
        onClick={onClick}
        selected={selected}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 2,
          mb: 0.5,
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: 250,
          transition: "background-color 0.3s, transform 0.3s",
          "&:hover": { bgcolor: "#4D5256", transform: "scale(1.02)" },
          "&.Mui-selected": { bgcolor: "rgba(0,0,0,0.08)" },
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {text}
        </Typography>
        <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>{icon}</ListItemIcon>
      </ListItemButton>
    );
  }

  return (
    <Tooltip title={isCollapsed ? text : ""} placement="right" arrow>
      <ListItemButton
        onClick={onClick}
        selected={selected}
        sx={{
          py: 1,
          px: 1.5,
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          width: "auto",
          justifyContent: isCollapsed ? "center" : "flex-start",
          transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
          "&:hover": { bgcolor: "#4D5256", transform: "scale(1.02)" },
          "&.Mui-selected": { bgcolor: "rgba(0,0,0,0.08)" },
          "&.Mui-selected:hover": { bgcolor: "#4D5256" },
        }}
      >
        <ListItemIcon
          sx={{
            color: "white",
            minWidth: 0,
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          {icon}
        </ListItemIcon>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ width: "100%" }}
          >
            <ListItemText
              primary={text}
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem" }}
              sx={{ ml: 1 }}
            />
          </motion.div>
        )}
      </ListItemButton>
    </Tooltip>
  );
};

export default SidebarMenuItem;
