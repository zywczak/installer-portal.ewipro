import { useCallback, useEffect, useState } from "react";
import { ApiMessage, ConnectionStatus } from "../components/common/EWIProBoard/types";
import api from "../api/axiosApi";
import { mapApiResultsToMessages } from "../components/common/EWIProBoard/mapper";
import { ChatMessage } from "../components/common/EWIChat/ChatMessage.types";

export const useEWIProBoard = (projectId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connected");

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await api.post({
        action: "getEWIproBoardNews",
        projectID: projectId,
        start: 0,
        limit: 100,
      });

      if (data?.status && Array.isArray(data.results)) {
        setMessages(mapApiResultsToMessages(data.results as ApiMessage[]));
        setStatus("connected");
      }
    } catch (e) {
      console.error("Fetch messages error:", e);
      setStatus("disconnected");
    }
  }, [projectId]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const optimistic: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      await api.post({
        action: "sendEWIproBoardNews",
        projectID: projectId,
        content: text,
      });

      fetchMessages();
    } catch (e) {
      console.error("Send message error:", e);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    status,
    sendMessage,
  };
};
