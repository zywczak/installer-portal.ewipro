import { Typography } from "@mui/material";
import { motion } from "framer-motion";

interface UserInfoProps {
  name: string;
  phone: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, phone }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ textAlign: "center", marginTop: 10 }}
    >
      <Typography variant="subtitle1" fontWeight={500}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {phone}
      </Typography>
    </motion.div>
  );
};

export default UserInfo;
