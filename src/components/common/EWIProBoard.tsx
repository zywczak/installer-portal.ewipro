import React, { useState, useEffect, useCallback } from "react";
import EWIChatView, { ChatMessage } from "./EwiChat";
import profilePhoto from "../../assets/profile-photo.png";

interface EWIProBoardProps {
  projectId: string;
}

const EWIProBoard: React.FC<EWIProBoardProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"connected" | "disconnected">("connected");

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch("https://api-veen-e.ewipro.com/installer/info/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "getEWIproBoardNews",
          projectID: projectId,
          start: 0,
          limit: 100,
        }),
      });

      const data = await res.json();
      if (data.status && Array.isArray(data.results)) {
        // Expand results: if `content` is an array, create separate ChatMessage entries
        const expanded = data.results.flatMap((m: any) => {
          if (m.type === "message") {
            const contents = Array.isArray(m.content) ? m.content : [m.content];
            return contents.map((c: any, idx: number) => ({
              sortKey: Number(m.messageID) + idx / 1000,
              msg: {
                id: `${m.messageID}-${idx}`,
                isUserMessage: m.userID === 0,
                // only the first fragment shows avatar/name/date
                isAvatar: idx === 0 ? m.iconPhoto : false,
                avatar: idx === 0 ? (m.icon ? m.icon : profilePhoto) : undefined,
                type: m.type,
                content: String(c || ""),
                picture: null,
                // only the first fragment carries the original timestamp/date
                stamp: idx === 0 ? m.stamp : undefined,
                date: idx === 0 ? m.date : undefined,
                dataLabel: idx === 0 ? m.dateLabel : undefined,
                timestamp: idx === 0 ? m.date : undefined,
                userName: idx === 0 ? m.authorName : "",
              },
            }));
          }

          // non-message types (e.g. picture)
          return [{
            sortKey: Number(m.messageID),
            msg: {
              id: m.messageID,
              isUserMessage: m.userID === 0,
              isAvatar: m.iconPhoto,
              avatar: m.icon ? m.icon : profilePhoto,
              type: m.type,
              content: m.type === "message" ? String(m.content || "") : "",
              picture: m.type === "picture" ? m.pictureURI : null,
              stamp: m.stamp,
              date: m.date,
              dataLabel: m.dateLabel,
              timestamp: m.date,
              userName: m.authorName,
            }
          }];
        });

        const formatted: ChatMessage[] = expanded
          .sort((a: any, b: any) => a.sortKey - b.sortKey)
          .map((x: any) => x.msg);

        setMessages(formatted);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
      setStatus("disconnected");
    }
  }, [projectId]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const token = localStorage.getItem("access");

    const newMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);

    try {
      await fetch("https://api-veen-e.ewipro.com/installer/info/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "sendEWIproBoardNews",
          projectID: projectId,
          content: text,
        }),
      });

      fetchMessages();
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <EWIChatView
      title="EWI Pro Board"
      description="Technical Team Channel"
      accentColor="#4CAF50"
      status={status}
      messages={messages}
      onSendMessage={sendMessage}
      user={{ id: "1", name: "Christopher Adamiec" }}
      inputPlaceholder="Write a message to EWI Pro Technical Team..."
      showStatus={false}
      showDetails={true}
      alignWithAvatar={true}
    />
  );
};

export default EWIProBoard;