import React from "react";
import { useEWIProBoard } from "../../../hooks/useEWIProBoard";
import { EWIChatView } from "../EWIChat/EwiChat";
import { t } from "i18next";

interface EWIProBoardProps {
  projectId: string;
}

const EWIProBoard: React.FC<EWIProBoardProps> = ({ projectId }) => {
  const { messages, status, sendMessage } = useEWIProBoard(projectId);

  return (
    <EWIChatView
      title={t("views.chatView.board.title")}
      description={t("views.chatView.board.description")}
      status={status}
      messages={messages}
      onSendMessage={sendMessage}
      inputPlaceholder={t("views.chatView.board.inputPlaceholder")}
      showStatus={false}
      showDetails={true}
      alignWithAvatar={true}
    />
  );
};

export default EWIProBoard;
