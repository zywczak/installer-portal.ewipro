import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  deleting: boolean;
  buttonText: string;
}
const DeleteAccount: React.FC<Props> = ({ open, onOpen, onClose, onDelete, deleting, buttonText }) => {
  const { t } = useTranslation();
  return (
  <>
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Button
        startIcon={<DeleteIcon />}
        variant="text"
        onClick={onOpen}
        sx={{ color: '#ff5f53', fontWeight: 600 }}
      >
        {buttonText}
      </Button>
    </Box>

    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" slotProps={{ paper : {sx: { borderRadius: 2, p: 2 } } }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: '1.25rem' }}>
        {t("views.settings.deleteAccount.confirmationModal.title")}
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pt: 1, pb: 2 }}>
        <Typography sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {t("views.settings.deleteAccount.confirmationModal.description")}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={deleting} variant="outlined" sx={{ flex: 1, mr: 1, py: 1.5 }}>{t("views.settings.deleteAccount.confirmationModal.cancel")}</Button>
        <Button onClick={onDelete} disabled={deleting} color="error" variant="contained" sx={{ flex: 1, ml: 1, py: 1.5 }}>
          {deleting ? <CircularProgress size={20} color="inherit" /> : t("views.settings.deleteAccount.confirmationModal.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
};

export default DeleteAccount;
