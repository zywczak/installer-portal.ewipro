import { useEffect, useRef, useState, useCallback } from "react";
import { ChatMessage } from "../components/common/EwiChat";

const WS_URL = "wss://veen-e.ewipro.com:7443/ws/ai-assistant";

interface UserInfo {
  userID: string;
  userName: string;
  userNameSurname: string;
  position: string;
  userBranchID: string | number;
  userBranchName: string;
  userDepartmentName: string;
}

export const useAIAssistantWS = (userInfo: UserInfo) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const getSessionID = () => {
    let session = localStorage.getItem("session_id");
    if (!session) {
      session = `session_${Math.random().toString(36).substring(2, 12)}`;
      localStorage.setItem("session_id", session);
    }
    return session;
  };
  const session_id = getSessionID();

  const sendMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = { id: Date.now(), role: "user", content: text };
      const typingMsg: ChatMessage = { id: Date.now() + 1, role: "assistant", streaming: true, content: "..." };
      setMessages(prev => [...prev, userMsg, typingMsg]);

      wsRef.current?.send(JSON.stringify({
        event: "message",
        data: {
          query: text,
          session_id,
          userInfo: { ...userInfo, userBranchID: 0, userBranchName: "", userDepartmentName: "" }
        }
      }));
    },
    [session_id, userInfo]
  );

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      ws.send(JSON.stringify({
        event: "resume",
        data: {
          session_id,
          last_seq: 0,
          userInfo: { ...userInfo, userBranchID: 0, userBranchName: "", userDepartmentName: "" },
          department: ["technical"],
          jsonModelResponse: true
        }
      }));
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        if (data.type === "resumed" && Array.isArray(data.data)) {
          setMessages(prev => {
            const restored: ChatMessage[] = data.data.map((m: any, idx: number) => ({
              id: Date.now() + idx,
              role: m.role,
              content: m.content.response || "",
            }));
            const existingContent = new Set(prev.map(m => m.content));
            return [...restored.filter(m => !existingContent.has(m.content)), ...prev];
          });
        }

        // Partial response
        if ((data.type === "partial_response" || data.type === "partial") && data.data) {
          const content = typeof data.data === "string" ? data.data : data.data.content;
          setMessages(prev => {
            const newPrev = [...prev];
            const last = newPrev[newPrev.length - 1];
            if (last && last.role === "assistant" && last.streaming) {
              last.content += content;
            } else {
              newPrev.push({ id: Date.now(), role: "assistant", streaming: true, content });
            }
            return newPrev;
          });
        }

        // Full response
        if ((data.type === "full_response" || data.type === "full") && data.data) {
          const content = typeof data.data === "string" ? data.data : data.data.content;
          setMessages(prev => {
            const newPrev = [...prev];
            const last = newPrev[newPrev.length - 1];
            if (last && last.role === "assistant" && last.streaming) {
              last.content = content;
              delete last.streaming;
              return newPrev;
            }
            if (!prev.some(m => m.content === content && m.role === "assistant")) {
              newPrev.push({ id: Date.now(), role: "assistant", content });
            }
            return newPrev;
          });
        }
      } catch (e) {
        console.warn("WS parse error", e);
      }
    };

    ws.onclose = () => setStatus("disconnected");

    return () => ws.close();
  }, [session_id, userInfo]);

  return { messages, status, sendMessage };
};
