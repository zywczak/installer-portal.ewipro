import { ListItemButton, ListItemText, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PasswordIcon from "@mui/icons-material/LockOutlined";

interface Props {
  onClick?: () => void;
  title: string;
  description?: string;
}

const ChangePasswordItem: React.FC<Props> = ({ onClick, title, description }) => (
  <ListItemButton onClick={onClick} sx={{ py: 2 }}>
    <PasswordIcon sx={{ mr: 2, color: "grey" }} />
    <ListItemText
      primary={<Typography fontWeight="bold">{title}</Typography>}
      secondary={description}
    />
    <ArrowForwardIosIcon sx={{ fontSize: 'large', color: "green" }} />
  </ListItemButton>
);

export default ChangePasswordItem;
