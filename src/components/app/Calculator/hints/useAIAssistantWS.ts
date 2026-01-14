import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = "wss://veen-e.ewipro.com:7443/ws/ai-assistant";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface UserInfo {
  userID: string;
  userName: string;
  userNameSurname: string;
  position: string;
}

const getSessionID = () => {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = `session_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("session_id", id);
  }
  return id;
};

export const useAIAssistantWS = (userInfo: UserInfo) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);

  const session_id = getSessionID();

  const sendMessage = useCallback((text: string) => {
    if (!wsRef.current) return;

    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: "user", content: text },
      { id: Date.now() + 1, role: "assistant", content: "", streaming: true }
    ]);

    wsRef.current.send(JSON.stringify({
      event: "message",
      data: { query: text, session_id, userInfo }
    }));
  }, [session_id, userInfo]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({
        event: "resume",
        data: { session_id, userInfo }
      }));
    };

    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (!msg?.data) return;

      if (msg.type === "partial") {
        setMessages(prev => {
          const copy = [...prev];
          const last = copy.at(-1);
          if (last?.streaming) last.content += msg.data;
          return copy;
        });
      }

      if (msg.type === "full") {
        setMessages(prev => {
          const copy = [...prev];
          const last = copy.at(-1);
          if (last?.streaming) {
            last.content = msg.data;
            delete last.streaming;
          }
          return copy;
        });
      }
    };

    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, [session_id, userInfo]);

  return {
    messages,
    connected,
    sendMessage
  };
};
