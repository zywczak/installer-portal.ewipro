import { ListItem, ListItemText, Switch, Typography } from "@mui/material";
import OwnerIcon from "@mui/icons-material/AssignmentIndOutlined";

interface Props {
  checked: boolean;
  onChange: () => void;
  title: string;
  description?: string;
}

const DefaultOwnerSwitch: React.FC<Props> = ({ checked, onChange, title, description }) => (
  <ListItem sx={{ py: 2 }}>
    <OwnerIcon sx={{ mr: 2, color: "grey" }} />
    <ListItemText
      sx={{ mr: 5 }}
      primary={<Typography fontWeight="bold">{title}</Typography>}
      secondary={description}
    />
    <Switch checked={checked} onChange={onChange} color="success" />
  </ListItem>
);

export default DefaultOwnerSwitch;
