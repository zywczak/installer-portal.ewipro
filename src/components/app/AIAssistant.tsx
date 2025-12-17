import { useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import { useAIAssistantWS } from "../../hooks/useAIAssistantWS";
import { useDraggableChatIcon } from "../common/AIAssistant/useDraggableChatIcon";
import { useChatAnimation } from "../common/AIAssistant/useChatAnimation";
import { EWIChatView } from "../common/EWIChat/EwiChat";
import { t } from "i18next";


export default function AIAssistant() {
  const userInfo = useMemo(() => ({
    userID: localStorage.getItem("userID") ?? "",
    userName: localStorage.getItem("userName") ?? "",
    userNameSurname: localStorage.getItem("userNameSurname") ?? "",
    position: "test",
    userBranchID: "test",
    userBranchName: "test",
    userDepartmentName: "test"
  }), []);

  const { messages, status, sendMessage } = useAIAssistantWS(userInfo);
  const {
  pos,
  dragRef,
  handleMouseDown,
  resetPosition,
} = useDraggableChatIcon();
  const { chatStyle, open, isAnimating, openChat, closeChat } = useChatAnimation(pos);

  const handleIconClick = () => {
  if (dragRef.current.moved) return;

  if (open) {
    closeChat();
  } else {
    openChat();
  }

  resetPosition();
};

  return (
    <>
      <IconButton
        onMouseDown={handleMouseDown}
        onClick={handleIconClick}
        sx={{
          position: "fixed",
          bottom: pos.bottom,
          right: pos.right,
          bgcolor: "#54A852",
          color: "#fff",
          width: 56,
          height: 56,
          borderRadius: "50%",
          boxShadow: 6,
          zIndex: 1500,
          transition: "bottom 0.3s ease, right 0.3s ease",
          cursor: dragRef.current.dragging ? "grabbing" : "grab",
          "&:hover": { bgcolor: "success.dark" },
        }}
      >
        <ChatIcon />
        <Box
          sx={{
            position: "absolute",
            top: -6,
            right: -6,
            width: 24,
            height: 24,
            border: '2px solid #4caf50',
            borderRadius: "50%",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#4caf50",
            pointerEvents: "none",
          }}
        >
          AI
        </Box>
      </IconButton>

      {(open || isAnimating) && (
        <Box
          sx={{
            position: "fixed",
            top: chatStyle.top,
            right: chatStyle.right,
            width: chatStyle.width,
            height: chatStyle.height,
            opacity: chatStyle.opacity,
            transform: chatStyle.transform,
            transition: "all 0.3s ease",
            zIndex: 1600,
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "background.paper",
          }}
        >
          <EWIChatView
            title={t("views.chatView.AI.title")}
            description={t("views.chatView.AI.description")}
            inputPlaceholder={t("views.chatView.AI.inputPlaceholder")}
            status={status}
            messages={messages}
            onSendMessage={sendMessage}
            onClose={closeChat}
            showDetails={false}
          />
        </Box>
      )}
    </>
  );
}
