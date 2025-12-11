import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  useTheme,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Ewi from "../../assets/Ewi.svg";
import profilePhoto from '../../assets/profile-photo.png';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PhotoGallery, { PhotoGalleryItem } from "./PhotoGallery";

export interface ChatMessage {
  id: string | number;
  role: "user" | "assistant";
  content: string;
  isUserMessage?: boolean;
  timestamp?: string;
  streaming?: boolean;
  picture?: string;
  date?: string;
  stamp?: string | number;
  avatar?: string;
  userName?: string;
}

interface EWIChatViewProps {
  title?: string;
  description?: string;
  accentColor?: string;
  status?: "connected" | "disconnected";
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  user?: { id: string; name: string };
  showCloseButton?: boolean;
  onClose?: () => void;
  headerColor?: string;
  inputPlaceholder?: string;
  showStatus?: boolean; 
  showDetails?: boolean; 
  alignWithAvatar?: boolean; // when true, messages without avatar are offset to align with avatared messages
}

// Konfiguracja komponentów ReactMarkdown
const markdownComponents: Record<string, React.FC<{ children?: React.ReactNode }>> = {
  table: ({ children }) => <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", my: 1 }}>{children}</Box>,
  th: ({ children }) => <Box component="th" sx={{ border: "1px solid #636363ff", px: 1, py: 0.5, backgroundColor: "#f4f4f4", fontWeight: "bold", textAlign: "left" }}>{children}</Box>,
  td: ({ children }) => <Box component="td" sx={{ border: "1px solid #636363ff", px: 1, py: 0.5, fontSize: 12, textAlign: "left" }}>{children}</Box>,
  h1: ({ children }) => <Box component="h1" sx={{ fontSize: 20, fontWeight: "bold", my: 1 }}>{children}</Box>,
  h2: ({ children }) => <Box component="h2" sx={{ fontSize: 18, fontWeight: "bold", my: 1 }}>{children}</Box>,
  h3: ({ children }) => <Box component="h3" sx={{ fontSize: 16, fontWeight: "bold", my: 1 }}>{children}</Box>,
  ul: ({ children }) => <Box component="ul" sx={{ pl: 2, my: 1, listStyleType: "disc" }}>{children}</Box>,
  ol: ({ children }) => <Box component="ol" sx={{ pl: 2, my: 1, listStyleType: "decimal" }}>{children}</Box>,
  li: ({ children }) => <Box component="li" sx={{ mb: 0.5 }}>{children}</Box>,
  code: ({ children }) => <Box component="code" sx={{ backgroundColor: "#eee", px: 0.5, borderRadius: 1, fontFamily: "monospace", fontSize: 13 }}>{children}</Box>,
  pre: ({ children }) => <Box component="pre" sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: 1, overflowX: "auto", fontSize: 13 }}>{children}</Box>,
};

interface ChatBubbleProps {
    message: ChatMessage;
    isUserMessage: boolean;
    showDetails: boolean;
    ewiGreenDark: string;
    userName: string;
    userAvatarUrl: string;
    theme: any;
    alignWithAvatar?: boolean;
    onImageClick?: (imageUrl: string) => void;
}

const ChatMessageBubble: React.FC<ChatBubbleProps> = ({
    message,
    isUserMessage,
    showDetails,
    ewiGreenDark,
    userName,
    userAvatarUrl,
    theme,
    alignWithAvatar = false,
    onImageClick,
}) => {
    const name = userName;

    // Parse message date from multiple possible fields (stamp, timestamp, date)
    const parseMessageDate = (msg: ChatMessage): Date | null => {
      const anyMsg = msg as any;
      const candidates = [anyMsg.stamp, anyMsg.timestamp, anyMsg.date];

      const tryParse = (value: any): Date | null => {
        if (value == null) return null;

        // numbers (unix seconds or ms)
        if (typeof value === 'number') {
          const s = String(Math.abs(value));
          let num = value;
          if (s.length === 10) num = value * 1000; // seconds -> ms
          return new Date(num);
        }

        if (typeof value === 'string') {
          const s = value.trim();

          // pure numeric string (seconds or ms)
          if (/^\d+$/.test(s)) {
            let num = Number(s);
            if (s.length === 10) num = num * 1000;
            return new Date(num);
          }

          // common "YYYY-MM-DD HH:mm:ss" -> convert to ISO-like
          const isoLike = s.replace(' ', 'T');
          const d = new Date(isoLike);
          if (!isNaN(d.getTime())) return d;

          // fallback to Date.parse
          const parsed = Date.parse(s);
          if (!isNaN(parsed)) return new Date(parsed);
        }

        return null;
      };

      for (const c of candidates) {
        const parsed = tryParse(c);
        if (parsed) return parsed;
      }

      return null;
    };

    const formatMessageDate = (msg: ChatMessage) => {
      const msgDate = parseMessageDate(msg);
      if (!msgDate) return "";
      const today = new Date();
      const isToday =
        msgDate.getDate() === today.getDate() &&
        msgDate.getMonth() === today.getMonth() &&
        msgDate.getFullYear() === today.getFullYear();
      if (isToday) {
        return msgDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      } else {
        return msgDate.toLocaleDateString('pl-PL') + " " +
          msgDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      }
    };

    const formattedTimestamp = formatMessageDate(message);
    const userAvatarBorderColor = '#5cb85c'; 

    const hasAvatar = showDetails && !!message.avatar;
    const avatarOffsetPx = 48; // 40px avatar + ~8px gap
    const imageOffsetStyle = (alignWithAvatar && !hasAvatar) ? (isUserMessage ? { mr: `${avatarOffsetPx}px` } : { ml: `${avatarOffsetPx}px` }) : {};

    const baseStyles = {
        maxWidth: "90%",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
        fontSize: 14,
        position: "relative",
        px: 2,
        py: 0,
    };

    const bubbleStyles = isUserMessage 
        ? { ...baseStyles, bgcolor: ewiGreenDark, color: "#fff", borderRadius: "18px 18px 2px 18px" } 
        : { ...baseStyles, bgcolor: "#eeeeee", color: "#000", borderRadius: "18px 18px 18px 2px" };

    // show details only when we have either a name or a timestamp
    const shouldShowDetails = showDetails && (name || formattedTimestamp);
    const detailsBox = shouldShowDetails ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.primary, mb: 0.5, flexDirection: isUserMessage ? 'row-reverse' : 'row' }}>
        {name ? <Typography variant="caption" sx={{ fontWeight: isUserMessage ? 'bold' : 'normal', fontSize: 13, color: isUserMessage ? theme.palette.text.primary : ewiGreenDark }}>{name}</Typography> : null}
        {formattedTimestamp ? <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>{formattedTimestamp}</Typography> : null}
      </Box>
    ) : null;

    // render avatar only when we actually have an avatar url
    const avatarComponent = showDetails && message.avatar ? <Avatar src={message.avatar} sx={{ width: 40, height: 40, border: isUserMessage ? 'none' : `2px solid ${userAvatarBorderColor}`, boxSizing: 'content-box' }} /> : null;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isUserMessage ? 'flex-end' : 'flex-start', mb: 0.5 }}>
            {detailsBox}
      <Box sx={{ display: 'flex', gap: (message.picture && !!message.avatar && showDetails) ? 0 : 1, alignItems: 'flex-start', flexDirection: isUserMessage ? 'row-reverse' : 'row', flexWrap: 'nowrap' }}>
          {avatarComponent}
          {/* if there's no avatar, add margin so bubble aligns with messages that have avatar; only when alignWithAvatar is enabled */}
          <Box sx={{ ...bubbleStyles, py: message.streaming ? 2 : 0, ...( (alignWithAvatar && !(!!message.avatar && showDetails)) ? (isUserMessage ? { mr: '48px' } : { ml: '48px' }) : {} ) }}>
                    {message.streaming ? (
                        <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end" }}>
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <Box key={i} sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: isUserMessage ? ewiGreenDark : theme.palette.text.primary, display: "inline-block", animation: `jump 1s infinite ${delay}s` }} />
                            ))}
                        </Box>
                    ) : (
                        <>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {message.content}
                            </ReactMarkdown>
                            {/* image moved outside the bubble for clearer layout */}
                        </>
                    )}
          </Box>
          {/* render picture outside the bubble so it's not inside the chat bubble */}
          {message.picture && (
            <Box sx={{ display: 'flex', flexDirection: isUserMessage ? 'row-reverse' : 'row', alignItems: 'flex-start', gap:0, mt: 0.5 }}>
              {/* keep avatar column space when avatar is missing */}
              { (!message.avatar && showDetails) ? <Box sx={{ width: 40, height: 40 }} /> : null }
              <Box sx={{ width: 'auto', alignSelf: 'flex-start',gap:0 }}>
                <img 
                  src={message.picture} 
                  alt="attachment" 
                  style={{ 
                    maxWidth: '200px', 
                    borderRadius: 8, 
                    display: 'block',
                    cursor: onImageClick ? 'pointer' : 'default',
                   boxShadow: "0px 6px 18px rgba(0,0,0,0.35)"
                  }}
                  onClick={() => onImageClick && onImageClick(message.picture!)}
                />
              </Box>
            </Box>
          )}
        </Box>
        </Box>
    );
};


const EWIChatView: React.FC<EWIChatViewProps> = ({
  title = "EWI Chat",
  description = "Chat with EWI Pro",
  accentColor = "#3878b7",
  status = "disconnected",
  messages,
  onSendMessage,
  user,
  showCloseButton = true,
  onClose,
  headerColor,
  inputPlaceholder = "Write a message to EWI Pro Technical Team...",
  showStatus = true, 
  showDetails = true,
  alignWithAvatar = false,
}) => {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // 1. Dodaj ref do inputa file
const fileInputRef = useRef<HTMLInputElement>(null);

// 2. Funkcja do kliknięcia przycisku "Add Photo"
const handleAddPhotoClick = () => {
  fileInputRef.current?.click();
};

// 3. Funkcja obsługi zmiany pliku
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Możesz wysłać file bezpośrednio lub najpierw zrobić upload do serwera i pobrać URL
  // Tutaj zakładamy, że onSendMessage potrafi obsłużyć {content: "", picture: URL}
  
  // Przykład prostego URL lokalnego (preview)
  // const reader = new FileReader();
  // reader.onload = (event) => {
  //   const pictureUrl = event.target?.result as string;
  //   onSendMessage(pictureUrl); // w onSendMessage możesz zdefiniować: { content: "", picture: pictureUrl }
  // };
  // reader.readAsDataURL(file);

  // Reset input
  e.target.value = "";
};



  
  // Photo Gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoGalleryItem[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const ewiGreenDark = "#4CAF50"; 
  const messageBarBackground = '#F2F2F2'; 
  const sendIconColor = '#4CAF50'; 

  const userAvatarUrl = localStorage.getItem('userAvatar') || profilePhoto;

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleImageClick = (clickedImageUrl: string) => {
    // Zbierz wszystkie zdjęcia z wiadomości
    const allPhotos: PhotoGalleryItem[] = messages
      .filter(msg => msg.picture)
      .map((msg, idx) => ({
        id: `${msg.id}-${idx}`,
        url: msg.picture!,
        alt: `Message photo ${idx + 1}`,
      }));

    // Znajdź indeks klikniętego zdjęcia
    const clickedIndex = allPhotos.findIndex(photo => photo.url === clickedImageUrl);

    setGalleryPhotos(allPhotos);
    setGalleryInitialIndex(clickedIndex >= 0 ? clickedIndex : 0);
    setGalleryOpen(true);
  };

  return (
    <Box sx={{ boxShadow: "0 10px 30px rgba(2,6,23,.15)", bgcolor: theme.palette.background.paper, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", borderRadius: 3 }}>
      <Box sx={{ p: 2, pt: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {Ewi && <img src={Ewi} alt="Ewi Store" style={{ height: "36px", opacity: 0.9 }} />}
          <Stack spacing={0.2} direction="column" alignItems="flex-start">
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
            <Typography variant="body2" color="text.secondary">{description}</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          {showStatus && (
            <Typography sx={{ fontSize: 13, px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 500, bgcolor: status === "connected" ? "rgba(22,163,74,0.2)" : "rgba(239,68,68,0.2)", color: status === "connected" ? "rgb(22,163,74)" : theme.palette.error.main }}>
              {status === "connected" ? "Connected" : "Disconnected"}
            </Typography>
          )}
          {onClose && showCloseButton && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="medium" sx={{ color: "#333" }} />
            </IconButton>
          )}
        </Stack>
      </Box>

      <Divider sx={{ mb: 2, mx: 3 }} />

      <Box ref={listRef} sx={{ flex: 1, overflowY: "auto", px: 4, display: "flex", flexDirection: "column", gap: 0.8 }}>
        {messages.length === 0 && <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>No messages yet. Start chatting below 👇</Typography>}
        {messages.map((m) => (
          <ChatMessageBubble
              key={m.id}
              message={m}
              isUserMessage={m.isUserMessage ?? (m.role === "user")}
              showDetails={showDetails}
              ewiGreenDark={ewiGreenDark}
              userName={m.userName || ""}
              userAvatarUrl={userAvatarUrl}
              theme={theme}
              alignWithAvatar={alignWithAvatar}
              onImageClick={handleImageClick}
          />
        ))}
        <style>{`@keyframes jump { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>
      </Box>

      <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1, bgcolor: theme.palette.background.paper }}>
        <Avatar alt="User Avatar" src={userAvatarUrl} sx={{ width: 44, height: 44, border: `2px solid ${sendIconColor}`, boxSizing: 'content-box' }} />
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', bgcolor: messageBarBackground, borderRadius: '28px', padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: 'none' }}
  />
  <IconButton onClick={handleAddPhotoClick} sx={{ color: sendIconColor }}>
    <PhotoCameraIcon />
  </IconButton>

  <TextField
    fullWidth
    multiline
    maxRows={4}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder={inputPlaceholder}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": { backgroundColor: 'transparent !important', padding: '8px 12px', borderRadius: '24px', fontSize: 14, "& fieldset": { border: "none" } },
      "& textarea": { overflow: "hidden", minHeight: "1em", padding: 0 }
    }}
    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
  />
  <IconButton onClick={handleSend} disabled={!input.trim()} sx={{ color: sendIconColor }}>
    <SendIcon sx={{ fontSize: "30px" }} />
  </IconButton>
</Box>
{/* <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', bgcolor: messageBarBackground, borderRadius: '28px', padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { backgroundColor: 'transparent !important', padding: '8px 12px', borderRadius: '24px', fontSize: 14, "& fieldset": { border: "none" } }, "& textarea": { overflow: "hidden", minHeight: "1em", padding: 0 } }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <IconButton
  onClick={handleSend}
  disabled={!input.trim()}
  sx={{
    color: sendIconColor,
    width: 38,
    height: 38,
    padding: 0,
    transition: "background-color 0.3s, transform 0.3s",
    "&:hover": {
      bgcolor: "rgba(0, 0, 0, 0)", // przezroczyste tło przy hover
      "& .MuiSvgIcon-root": {
        transform: "translateX(7px)" // przesunięcie ikony w prawo
      }
    }
  }}
>
  <SendIcon sx={{ fontSize: "30px", transition: "transform 0.3s" }} />
</IconButton>
        </Box> */}
      </Box>

      {/* Photo Gallery */}
      <PhotoGallery
        photos={galleryPhotos}
        initialIndex={galleryInitialIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        showDeleteButton={false}
      />
    </Box>
  );
};

export default EWIChatView;