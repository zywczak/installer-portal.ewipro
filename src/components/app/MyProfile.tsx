import React, { useState, useRef, useEffect } from "react";
import { Stack, Avatar, Box, IconButton, CircularProgress, Card } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FormTextField from "../common/FormTextField";
import AcceptButton from "../common/AcceptButton";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import profilePhoto from "../../assets/profile-photo.png";

const API_URL = "https://api-veen-e.ewipro.com/installer/info/";
const phoneRegex = /^[0-9\s+()-]{9,15}$/;

interface ProfileViewProps {
  showSuccess?: (msg: string) => void;
  showError?: (msg: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ showSuccess, showError }) => {
  const [photo, setPhoto] = useState<string>("/profile-photo.png");
  const [photoChanged, setPhotoChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [phone, setPhone] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
if (storedEmail) setEmail(storedEmail);
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access");
        if (!token) throw new Error("Brak tokena JWT");

        const response = await axios.post(
          API_URL,
          { action: "getBasicUserData" },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;

        setUser(userData);
        setPhoto(userData?.avatar || "/profile-photo.png");

        const phoneNumber = userData?.phones?.mobile || userData?.phones?.phone || "";
        setPhone(phoneNumber);
        setCompany(userData?.company_name || "");
      } catch (err) {
        console.error("Błąd pobierania profilu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (!val.trim()) {
      setError("Numer telefonu jest wymagany");
    } else if (!phoneRegex.test(val)) {
      setError("Nieprawidłowy format numeru");
    } else {
      setError(null);
    }
  };

  const handleDeletePhoto = async () => {
    if (!user?.avatar) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("Brak tokena JWT");

      await axios.post(
        API_URL,
        { action: "deleteUserAvatar" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess?.("Zdjęcie zostało usunięte");
      setPhoto(profilePhoto);
      setPhotoChanged(false);

      // Aktualizujemy user.avatar
      setUser((prev: any) => ({ ...prev, avatar: null }));
    } catch (err) {
      console.error("Błąd usuwania zdjęcia:", err);
      showError?.("Nie udało się usunąć zdjęcia");
    } finally {
      setLoading(false);
    }
  };


  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setPhotoChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSave = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("Brak tokena JWT");

    // 1. Zapis zdjęcia
    if (photoChanged && fileInputRef.current?.files?.[0]) {
      const formData = new FormData();
      formData.append("action", "postAvatarToUserProfile");
      formData.append("avatar", fileInputRef.current.files[0]);

      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccess?.("Zdjęcie zostało zapisane");
      setPhotoChanged(false);
    }

    // 2. Zapis danych billing (telefon + firma)
    const phoneChanged = phone !== (user?.phones?.mobile || user?.phones?.phone);
    const companyChanged = company !== (user?.company_name || "");

    if (phoneChanged || companyChanged) {
      const response = await axios.post(
        API_URL,
        {
          action: "updateProfileBilling",
          phoneNumber: phone,
          companyName: company,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        showSuccess?.("Dane zostały zapisane");
      } else if (response.data.message === "Nothing to change.") {
        showSuccess?.("Brak zmian do zapisania");
      } else {
        showError?.("Nie udało się zapisać danych");
      }
    }
  } catch (err) {
    console.error("Błąd zapisu:", err);
    showError?.("Wystąpił błąd podczas zapisu");
  } finally {
    setLoading(false);
  }
};



  // const canSave =
  //   photoChanged ||
  //   (user && phone !== (user?.phones?.mobile || user?.phones?.phone) && phoneRegex.test(phone) && !error);
  // const canSave =
  // photoChanged ||
  // (user && phone !== (user?.phones?.mobile || user?.phones?.phone)) ||
  // (user && company !== (user?.company_name || ""));
  const canSave =
  photoChanged ||
  (
    user &&
    phone !== (user?.phones?.mobile || user?.phones?.phone) &&
    phoneRegex.test(phone) &&
    !error
  ) ||
  (user && company !== (user?.company_name || ""));


  if (loading && !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, px:2 }}>
            <Card sx={{ border: "1px solid #e0e0e0", p: 2, width: '100%', boxSizing: 'border-box', borderRadius: 2 }}>
    <Box
       sx={{
        pt: 0,
        display: "flex",
         flexDirection: "column",
         alignItems: "center",
        maxWidth: 420,
        mx: "auto",
        mb: 1,
       }}
     >
      <Box sx={{ position: "relative", mb: 3 }}>
  <Avatar
    src={photo}
    sx={{ width: 140, height: 140, border: "2px solid #ccc", zIndex: 1, pointerEvents: 'none' }}
  />
  
  {/* Przycisk do zmiany zdjęcia */}
  <IconButton
    onClick={() => fileInputRef.current?.click()}
    sx={{
      position: "absolute",
      bottom: 10,
      right: 10,
      bgcolor: "white",
      boxShadow: 2,
      zIndex: 2,
      "&:hover": { bgcolor: "#f0f0f0" },
    }}
  >
    <CameraAltIcon color="action" fontSize="medium" />
  </IconButton>

  {/* Przycisk do usunięcia zdjęcia */}
  {user?.avatar && (
  <IconButton
    onClick={handleDeletePhoto}
    sx={{
      position: "absolute",
      top: 10,
      right: 10,
      bgcolor: "white",
      boxShadow: 2,
      zIndex: 2,
      p: 0.5,
      "&:hover": { bgcolor: "#f0f0f0" },
    }}
  >
    <CloseIcon color="error" fontSize="medium" />
  </IconButton>
)}

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    hidden
    onChange={handlePhotoChange}
  />
</Box>

      <Stack spacing={5} sx={{ width: "100%" }}>
        <FormTextField
          value={user?.name || ""}
          onChange={() => {}}
          placeholder="Imię i nazwisko"
          disabled
          size="small"
        />
        <FormTextField
  value={email}
  onChange={() => {}}
  placeholder="Login / e-mail"
  disabled
  size="small"
/>
        <FormTextField
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Numer telefonu"
          error={error}
          size="small"
        />
        <FormTextField
  value={company}
  onChange={setCompany}
  placeholder="Nazwa firmy"
  size="small"
/>
      </Stack>

      <Box sx={{ width: "100%", mt: 4 }}>
        <Box sx={{ "& > *": { width: "100%" } }}>
          <AcceptButton
  onClick={handleSave}
  loading={loading}
  label="Zapisz"
  loadingLabel="Zapisywanie..."
  disabled={!canSave}
/>
        </Box>
      </Box>
    </Box>
    </Card>
    </Box>
  );
};

export default ProfileView;
