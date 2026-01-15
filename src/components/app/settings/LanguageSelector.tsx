import { ListItem, ListItemText, FormControl, Select, MenuItem, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

interface Props {
  language: string;
  onChange: (lang: string) => void;
  title: string;
}

const LanguageSelector: React.FC<Props> = ({ language, onChange, title }) => (
  <ListItem sx={{ py: 2 }}>
    <LanguageIcon sx={{ mr: 2, color: "grey.600" }} /> 
    <ListItemText primary={<Typography fontWeight="bold">{title}</Typography>} />
    <FormControl variant="standard" sx={{ ml: 1, minWidth: 120 }}>
      <Select value={language} onChange={e => onChange(e.target.value)}>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="pl">Polski</MenuItem>
        <MenuItem value="hi">हिन्दी</MenuItem>
        <MenuItem value="ro">Română</MenuItem>
        <MenuItem value="ur">اردو</MenuItem>
      </Select>
    </FormControl>
  </ListItem>
);

export default LanguageSelector;
