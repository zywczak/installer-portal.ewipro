import { ChatMessage } from "../../../common/EWIChat/ChatMessage.types";

export const mapApiResultsToMessages = (results: any[]): ChatMessage[] => {
  const expanded = results.flatMap((m: any) => {
    const base = {
      isUserMessage: m.userID === 0,
      avatar: m.icon,
      type: m.type,
      stamp: m.stamp,
      date: m.date,
      picture: m.pictureURI || undefined,
      dataLabel: m.dateLabel,
      timestamp: m.date,
      userName: m.authorName,
    };

    if (m.type === "message") {
      const contents = Array.isArray(m.content) ? m.content : [m.content];

      return contents.map((content: string, idx: number) => ({
        sortKey: Number(m.messageID) + idx / 1000,
        msg: {
          ...base,
          id: `${m.messageID}-${idx}`,
          content: String(content || ""),
          picture: null,
          isAvatar: idx === 0 ? m.iconPhoto : false,
          avatar: idx === 0 ? base.avatar : undefined,
          stamp: idx === 0 ? base.stamp : undefined,
          date: idx === 0 ? base.date : undefined,
          dataLabel: idx === 0 ? base.dataLabel : undefined,
          timestamp: idx === 0 ? base.timestamp : undefined,
          userName: idx === 0 ? base.userName : "",
        },
      }));
    }

    return [
      {
        sortKey: Number(m.messageID),
        msg: {
          ...base,
          id: m.messageID,
          content: "",
          picture: m.type === "picture" ? m.pictureURI : null,
          isAvatar: m.iconPhoto,
        },
      },
    ];
  });

  return expanded
  .toSorted((a, b) => a.sortKey - b.sortKey)
  .map(e => e.msg);
};
