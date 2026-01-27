import { Avatar, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import profilePhoto from "../../assets/profile-photo.png";

interface UserAvatarProps {
  avatarUrl?: string;
  size?: number;
  onClick?: () => void;
  tooltip?: string;
  sx?: object;
}

const MotionAvatar = motion.create(Avatar);

const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  size = 80,
  onClick,
  tooltip,
  sx = {},
}) => {
  const avatar = (
    <MotionAvatar
      src={avatarUrl || profilePhoto}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.08 } : undefined}
      animate={{ width: size, height: size }}
      transition={{ duration: 0.3 }}
      sx={{
        bgcolor: "rgba(255,255,255,0.4)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: onClick
          ? "0 0 10px rgba(255,255,255,0.3)"
          : "none",
        ...sx, 
      }}
    />
  );

  if (!tooltip || !onClick) return avatar;

  return (
    <Tooltip title={tooltip} arrow>
      <span>{avatar}</span>
    </Tooltip>
  );
};


export default UserAvatar;