// import React, { useState, useEffect, useRef } from "react";
// import { Box, IconButton } from "@mui/material";
// import ChatIcon from '@mui/icons-material/Chat';
// import EWIChatView, { ChatMessage } from "../common/EwiChat";

// const WS_URL = "wss://veen-e.ewipro.com:7443/ws/ai-assistant";

// export default function AIAssistant() {
//   const wsRef = useRef<WebSocket | null>(null);
//   const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [open, setOpen] = useState(false);

//   const userInfo = {
//     userID: localStorage.getItem("userID") ?? "",
//     userName: localStorage.getItem("userName") ?? "",
//     userNameSurname: localStorage.getItem("userNameSurname") ?? "",
//     position: "test",
//     userBranchID: "test",
//     userBranchName: "test",
//     userDepartmentName: "test"
//   };

//   const getSessionID = () => {
//     let session = localStorage.getItem("session_id");
//     if (!session) {
//       session = `session_${Math.random().toString(36).substring(2, 12)}`;
//       localStorage.setItem("session_id", session);
//     }
//     return session;
//   };
//   const session_id = getSessionID();

//   useEffect(() => {
//     const ws = new WebSocket(WS_URL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       setStatus("connected");
//       ws.send(JSON.stringify({
//         event: "resume",
//         data: {
//           session_id,
//           last_seq: 0,
//           userInfo: { ...userInfo, userBranchID: 0, userBranchName: "", userDepartmentName: "" },
//           department: ["technical"],
//           jsonModelResponse: true
//         }
//       }));
//     };

//     ws.onmessage = (msg) => {
//       try {
//         const data = JSON.parse(msg.data);

//         if (data.type === "resumed" && Array.isArray(data.data)) {
//           setMessages(prev => {
//             const restored: ChatMessage[] = data.data.map((m: any, idx: number) => ({
//               id: Date.now() + idx,
//               role: m.role,
//               content: m.content.response || "",
//             }));
//             const existingContent = new Set(prev.map(m => m.content));
//             return [...restored.filter(m => !existingContent.has(m.content)), ...prev];
//           });
//           return;
//         }
// //// do usuniecia prawdopodobnie
//         if ((data.type === "partial_response" || data.type === "partial") && data.data) {
//           const content = typeof data.data === "string" ? data.data : data.data.content;
//           setMessages(prev => {
//             const newPrev = [...prev];
//             const last = newPrev[newPrev.length - 1];
//             if (last && last.role === "assistant" && last.streaming) {
//               last.content += content;
//             } else {
//               newPrev.push({ id: Date.now(), role: "assistant", streaming: true, content });
//             }
//             return newPrev;
//           });
//           return;
//         }

//         if ((data.type === "full_response" || data.type === "full") && data.data) {
//           const content = typeof data.data === "string" ? data.data : data.data.content;
//           setMessages(prev => {
//             const newPrev = [...prev];
//             const last = newPrev[newPrev.length - 1];
//             if (last && last.role === "assistant" && last.streaming) {
//               last.content = content;
//               delete last.streaming;
//               return newPrev;
//             }
//             if (!prev.some(m => m.content === content && m.role === "assistant")) {
//               newPrev.push({ id: Date.now(), role: "assistant", content });
//             }
//             return newPrev;
//           });
//         }

//       } catch (e) {
//         console.warn("WS parse error", e);
//       }
//     };

//     ws.onclose = () => setStatus("disconnected");
//     return () => ws.close();
//   }, [session_id]);

//   const getDefaultPos = () => ({ right: 60, bottom: 20 });
//   const [pos, setPos] = useState(getDefaultPos());
//   const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0, moved: false });

//   const handleMouseDown = (e: React.MouseEvent) => {
//     dragRef.current.dragging = true;
//     dragRef.current.moved = false;
//     dragRef.current.offsetX = e.clientX - (window.innerWidth - pos.right - 56);
//     dragRef.current.offsetY = e.clientY - (window.innerHeight - pos.bottom - 56);
//   };

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!dragRef.current.dragging) return;
//       const newBottom = window.innerHeight - (e.clientY - dragRef.current.offsetY) - 56;
//       const newRight = window.innerWidth - (e.clientX - dragRef.current.offsetX + 56);

//       if (!dragRef.current.moved && (Math.abs(newBottom - pos.bottom) > 3 || Math.abs(newRight - pos.right) > 3)) {
//         dragRef.current.moved = true;
//       }

//       setPos({
//         bottom: Math.max(0, Math.min(newBottom, window.innerHeight - 56)),
//         right: Math.max(0, newRight),
//       });
//     };

//     const handleMouseUp = () => {
//       dragRef.current.dragging = false;
//     };

//     const handleResize = () => {
//       if (open) {
//         const isMobile = window.matchMedia("(max-width: 705px)").matches;
//         setChatStyle(prev => ({
//           ...prev,
//           width: isMobile ? "100vw" : 600,
//           height: isMobile ? "100vh" : window.innerHeight - 100
//         }));
//       }
//     };
    
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     window.addEventListener("resize", handleResize);
    
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [pos.bottom, pos.right, open]);

//   const handleIconClick = () => {
//     if (!dragRef.current.moved) {
//     if (open) handleCloseChat();
//     else handleOpenChat();
//   }
//   setPos(getDefaultPos());
//   };

//   const handleSendMessage = (text: string) => {
//     const userMsg: ChatMessage = { id: Date.now(), role: "user", content: text };
//     setMessages(prev => [...prev, userMsg]);

//     const typingMsg: ChatMessage = { id: Date.now() + 1, role: "assistant", streaming: true, content: "..." };
//     setMessages(prev => [...prev, typingMsg]);

//     wsRef.current?.send(JSON.stringify({
//       event: "message",
//       data: { query: text, session_id, userInfo: { ...userInfo, userBranchID: 0, userBranchName: "", userDepartmentName: "" } }
//     }));
//   };

//   const [chatStyle, setChatStyle] = useState<{
//   top: number;
//   right: number;
//   width: number | string;
//   height: number | string;
//   opacity: number;
//   transform: string;
// }>({
//   top: window.innerHeight - pos.bottom - 56,
//   right: pos.right,
//   width: 0,
//   height: 0,
//   opacity: 0,
//   transform: "scale(0.2)"
// });

// const [isAnimating, setIsAnimating] = useState(false);

// const handleOpenChat = () => {
//   setIsAnimating(true);
//   setOpen(true);

//   setChatStyle({
//     top: window.innerHeight - pos.bottom - 56,
//     right: pos.right,
//     width: 0,
//     height: 0,
//     opacity: 0,
//     transform: "scale(0.2)"
//   });

//   setTimeout(() => {
//     const isMobile = window.matchMedia("(max-width: 705px)").matches;

//     setChatStyle({
//       top: 0,
//       right: 0,
//       width: isMobile ? "100vw" : 600,
//       height: isMobile ? "100vh" : window.innerHeight - 100,
//       opacity: 1,
//       transform: "scale(1)"
//     });
//   }, 10);
// };


// const handleCloseChat = () => {
//   setChatStyle({
//     top: window.innerHeight - pos.bottom - 56,
//     right: pos.right,
//     width: 0,
//     height: 0,
//     opacity: 0,
//     transform: "scale(0.2)"
//   });
//   setTimeout(() => {
//     setOpen(false);
//     setIsAnimating(false);
//   }, 300);
// };


//   return (
//     <>
//       <IconButton
//         onMouseDown={handleMouseDown}
//         onClick={handleIconClick}
//         sx={{
//           position: "fixed",
//           bottom: pos.bottom,
//           right: pos.right,
//           bgcolor: "#54A852",
//           color: "#fff",
//           width: 56,
//           height: 56,
//           borderRadius: "50%",
//            boxShadow: 6,
//           zIndex: 1500,
//           transition: "bottom 0.3s ease, right 0.3s ease",
//           cursor: dragRef.current.dragging ? "grabbing" : "grab",
//           "&:hover": {
//             bgcolor: "success.dark" },
//         }}
//       >
//         <ChatIcon />
//         <Box
//     sx={{
//       position: "absolute",
//       top: -6,
//       right: -6,
//       width: 24,
//       height: 24,
//       border: '2px solid #4caf50',
//       borderRadius: "50%",
//       bgcolor: "#fff",
      
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontSize: 12,
//       fontWeight: 700,
//       color: "#4caf50",
//       pointerEvents: "none",
//     }}
//   >
//           AI
//         </Box>
//       </IconButton>

//       {(open || isAnimating) && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: chatStyle.top,
//       right: chatStyle.right,
//       width: chatStyle.width,
//       height: chatStyle.height,
//       opacity: chatStyle.opacity,
//       transform: chatStyle.transform,
//       transition: "all 0.3s ease",
//       zIndex: 1600,
//       boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
//       borderRadius: 3,
//       overflow: "hidden",
//           }}
//         >
//           <EWIChatView
//             title="Veen-E Assistant"
//             description="Your AI assistant"
//             inputPlaceholder="Try me! I will do my best to help You."
//             status={status}
//             messages={messages}
//             onSendMessage={handleSendMessage}
//             user={{ id: userInfo.userID.toString(), name: userInfo.userName }}
//             onClose={handleCloseChat}
//             showDetails={false}
//           />
//         </Box>
//       )}
//     </>
//   );
// }



import React, { useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import EWIChatView from "../common/EwiChat";
import { useAIAssistantWS } from "../../hooks/useAIAssistantWS";
import { useDraggableChatIcon } from "../common/AIAssistant/useDraggableChatIcon";
import { useChatAnimation } from "../common/AIAssistant/useChatAnimation";


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

  // ⬅️ 1:1 jak w starej wersji
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
          }}
        >
          <EWIChatView
            title="Veen-E Assistant"
            description="Your AI assistant"
            inputPlaceholder="Try me! I will do my best to help You."
            status={status}
            messages={messages}
            onSendMessage={sendMessage}
            user={{ id: userInfo.userID.toString(), name: userInfo.userName }}
            onClose={closeChat}
            showDetails={false}
          />
        </Box>
      )}
    </>
  );
}
