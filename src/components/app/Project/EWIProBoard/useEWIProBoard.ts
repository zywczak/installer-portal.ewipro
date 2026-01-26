import { useCallback, useEffect, useState } from "react";
import { ApiMessage, ConnectionStatus } from "./types";
import api from "../../../../api/axiosApi";
import { mapApiResultsToMessages } from "./mapper";
import { ChatMessage } from "../../../common/EWIChat/ChatMessage.types";

export const useEWIProBoard = (projectId: number) => {
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

  const sendMessage = async ({ text, picture }: { text?: string; picture?: File }) => {
  if (!text && !picture) return;

  const optimistic: ChatMessage = {
    id: Date.now(),
    role: "user",
    content: text || "",
    picture: picture ? URL.createObjectURL(picture) : undefined,
    timestamp: new Date().toISOString(),
  };

  setMessages(prev => [...prev, optimistic]);

  try {
    if (picture) {
      const form = new FormData();
      form.append("action", "sendEWIproBoardNews");
      form.append("projectID", projectId.toString());
      if (text) form.append("content", text);
      form.append("picture", picture);

      await api.post(form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post({
        action: "sendEWIproBoardNews",
        projectID: projectId,
        content: text,
      });
    }

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
