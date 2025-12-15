import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutline';

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  deleting: boolean;
  buttonText: string;
}

const DeleteAccount: React.FC<Props> = ({ open, onOpen, onClose, onDelete, deleting, buttonText }) => (
  <>
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Button
        startIcon={<DeleteIcon />}
        variant="text"
        onClick={onOpen}        // ✅ OTWIERA dialog
        sx={{ color: 'red', fontWeight: 600 }}
      >
        {buttonText}
      </Button>
    </Box>

    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 2, p: 2 } }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: '1.25rem' }}>
        Potwierdzenie usunięcia konta
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pt: 1, pb: 2 }}>
        <Typography sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          Czy na pewno chcesz usunąć konto?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={deleting} variant="outlined" sx={{ flex: 1, mr: 1, py: 1.5 }}>Anuluj</Button>
        <Button onClick={onDelete} disabled={deleting} color="error" variant="contained" sx={{ flex: 1, ml: 1, py: 1.5 }}>
          {deleting ? <CircularProgress size={20} color="inherit" /> : "Usuń"}
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

export default DeleteAccount;
