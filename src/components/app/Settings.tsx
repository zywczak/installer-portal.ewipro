import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Typography,
  useTheme,
  Card,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
} from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import LanguageIcon from '@mui/icons-material/Language';
import PasswordIcon from '@mui/icons-material/LockOutlined';
import OwnerIcon from '@mui/icons-material/AssignmentIndOutlined';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';

const API_URL = 'https://api-veen-e.ewipro.com/installer/info/';

interface SettingsProps {
  isMobile?: boolean;
  navigateTo?: (newView: string) => void;
  showSuccess?: (msg: string) => void;
  showError?: (msg: string) => void;
}

interface Owner {
  userID: number;
  name: string;
  email: string;
  avatar?: string | null;
}

const Settings: React.FC<SettingsProps> = ({ isMobile = false, navigateTo, showSuccess, showError }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const [isDefaultOwnerEnabled, setIsDefaultOwnerEnabled] = useState(() => {
    const saved = localStorage.getItem('defaultProjectOwner');
    return saved ? JSON.parse(saved) : false;
  });

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(() => {
    const id = localStorage.getItem('defaultOwnerId');
    const name = localStorage.getItem('defaultOwnerName');
    const email = localStorage.getItem('defaultOwnerEmail');
    const avatar = localStorage.getItem('defaultOwnerAvatar');

    if (id && name && email) {
      return {
        userID: Number(id),
        name,
        email,
        avatar: avatar || null,
      };
    }
    return null;
  });

  const [showOwnersList, setShowOwnersList] = useState(false);

  const [language, setLanguage] = useState(i18n.language || 'en');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const ownerButtonRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const loadOwners = async () => {
    try {
      setLoadingOwners(true);
      const token = localStorage.getItem('access');
      if (!token) throw new Error('Brak tokena JWT');

      const res = await axios.post(
        API_URL,
        { action: 'getMyOwners' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const list = res.data?.results ?? [];
      setOwners(list);
    } catch (err) {
      console.error(err);
      showError?.('Nie udało się pobrać listy Ownerów');
    } finally {
      setLoadingOwners(false);
    }
  };

  const handleOwnerToggle = () => {
    const newValue = !isDefaultOwnerEnabled;
    setIsDefaultOwnerEnabled(newValue);
    localStorage.setItem('defaultProjectOwner', JSON.stringify(newValue));

    if (!newValue) {
      setSelectedOwner(null);
      localStorage.removeItem('defaultOwnerId');
      localStorage.removeItem('defaultOwnerName');
      localStorage.removeItem('defaultOwnerEmail');
      localStorage.removeItem('defaultOwnerAvatar');
      setShowOwnersList(false);
    }
  };

  const saveOwnerToLocalStorage = (owner: Owner) => {
    localStorage.setItem('defaultOwnerId', String(owner.userID));
    localStorage.setItem('defaultOwnerName', owner.name);
    localStorage.setItem('defaultOwnerEmail', owner.email);
    localStorage.setItem('defaultOwnerAvatar', owner.avatar || '');
  };

  const handleOwnerSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    saveOwnerToLocalStorage(owner);
    setShowOwnersList(false);
    showSuccess?.('Default owner został zapisany');
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('access');
      await axios.post(API_URL, { action: 'removeUserAccount' }, { headers: { Authorization: `Bearer ${token}` } });

      showSuccess?.('Konto zostało usunięte');
      localStorage.removeItem('access');
      window.location.href = '/auth';
    } catch {
      showError?.('Nie udało się usunąć konta');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
       <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, px: 2 }}>

    <Card
      sx={{
        border: '1px solid #e0e0e0',
        p: 2,
        width: '100%',
        // maxWidth: '500px',
        margin: '0 auto',
        boxSizing: 'border-box',
        borderRadius: 2,
      }}
    >
      <List disablePadding sx={{ width: '100%', maxWidth: '800px', m: 'auto' }}>

            {/* Change password */}
            <ListItemButton onClick={() => navigateTo?.('changepassword')} sx={{ py: 2 }}>
              <PasswordIcon sx={{ mr: 2, color: theme.palette.grey[600] }} />
              <ListItemText primary={<Typography fontWeight="bold">{t('views.settings.changePassword.header')}</Typography>} secondary={t('views.settings.changePassword.instruction')} />
              <ListItemSecondaryAction sx={{ right: 8 }}>
                <ArrowForwardIosIcon sx={{ fontSize: 'small', color: theme.palette.grey[500] }} />
              </ListItemSecondaryAction>
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* Default Owner switch */}
            <ListItem sx={{ py: 2 }}>
              <OwnerIcon sx={{ mr: 2, color: theme.palette.grey[600] }} />
              <ListItemText
                sx={{ mr: 5 }}
                primary={<Typography fontWeight="bold">{t('views.settings.useDefaultOwner.header')}</Typography>}
                secondary={t('views.settings.useDefaultOwner.description')}
              />
                <Switch checked={isDefaultOwnerEnabled} onChange={handleOwnerToggle} color="success" />
            </ListItem>

            {/* Owner selection dropdown */}
            {isDefaultOwnerEnabled && (
              <Box sx={{ position: 'relative', ml: 6 }}>
                <ListItemButton
                  ref={ownerButtonRef}
                  sx={{ pb: 2, px: 2, mt: 0}}
                  onClick={async () => {
                    await loadOwners();
                    const rect = ownerButtonRef.current!.getBoundingClientRect();
                    setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
                    setShowOwnersList(prev => !prev);
                  }}
                >
                  <Avatar src={selectedOwner?.avatar || undefined} sx={{ width: 42, height: 42, mr: 2 }} />
                  <ListItemText
                    primary={selectedOwner ? selectedOwner.name : 'Kliknij aby wybrać'}
                    secondary={selectedOwner?.email || ''}
                  />
                  <ArrowForwardIosIcon
                    sx={{
                      color: 'green',
                      fontSize: 'large',
                      transform: showOwnersList ? 'rotate(90deg)' : 'none',
                      transition: '0.2s',
                    }}
                  />
                </ListItemButton>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Language */}
            <ListItem sx={{ py: 2 }}>
              <LanguageIcon sx={{ mr: 2, color: theme.palette.grey[600] }} />
              <ListItemText primary={<Typography fontWeight="bold">{t('views.settings.language')}</Typography>} />
              <FormControl variant="standard" sx={{ ml: 1, minWidth: 120 }}>
                <Select value={language} onChange={handleLanguageChange}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="pl">Polski</MenuItem>
                  <MenuItem value="hi">हिन्दी</MenuItem>
                  <MenuItem value="ro">Română</MenuItem>
                  <MenuItem value="ur">اردو</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </Card>

        {/* FIXED dropdown outside card */}
        {showOwnersList && (
          <Box
            sx={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              border: '1px solid #ddd',
              borderRadius: 2,
              maxHeight: 250,
              overflowY: 'auto',
              bgcolor: 'background.paper',
              zIndex: 99999,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            {loadingOwners ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={26} />
              </Box>
            ) : owners.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 2 }}>Brak ownerów do wyboru</Box>
            ) : (
              owners
                .filter(owner => selectedOwner?.userID !== owner.userID)
                .map(owner => (
                  <ListItemButton key={owner.userID} onClick={() => handleOwnerSelect(owner)}>
                    <Avatar src={owner.avatar || undefined} sx={{ width: 36, height: 36, mr: 2 }} />
                    <ListItemText primary={owner.name} secondary={owner.email} />
                  </ListItemButton>
                ))
            )}
          </Box>
        )}

        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Button
            startIcon={<DeleteIcon />}
            variant="text"
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ color: theme.palette.error.main, fontWeight: 600 }}
          >
            {t('views.settings.deleteAccount.button')}
          </Button>
        </Box>

        <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: 2,
      p: 2,
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    },
  }}
>
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: '1.25rem' }}>
    {t('views.settings.deleteAccount.confirmationModal.title')}
  </DialogTitle>

  <DialogContent sx={{ textAlign: 'center', pt: 1, pb: 2 }}>
    <Typography sx={{ fontSize: '1rem', color: 'text.secondary' }}>
      {t('views.settings.deleteAccount.confirmationModal.description')}
    </Typography>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
    <Button
      onClick={() => setDeleteDialogOpen(false)}
      disabled={deleting}
      variant="outlined"
      sx={{ flex: 1, mr: 1, py: 1.5 }}
    >
      {t('views.settings.deleteAccount.confirmationModal.cancel')}
    </Button>

    <Button
      onClick={handleConfirmDelete}
      disabled={deleting}
      color="error"
      variant="contained"
      sx={{ flex: 1, ml: 1, py: 1.5 }}
    >
      {deleting
        ? <CircularProgress size={20} color="inherit" />
        : t('views.settings.deleteAccount.confirmationModal.delete')}
    </Button>
  </DialogActions>
</Dialog>
      </Box>
  );
};

export default Settings;

