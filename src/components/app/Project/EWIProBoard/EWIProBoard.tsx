import React from "react";
import { useEWIProBoard } from "./useEWIProBoard";
import { EWIChatView } from "../../../common/EWIChat/EwiChat";
import { useTranslation } from "react-i18next";

interface EWIProBoardProps {
  projectId: number;
}

const EWIProBoard: React.FC<EWIProBoardProps> = ({ projectId }) => {
  const { messages, status, sendMessage } = useEWIProBoard(projectId);
  const { t } = useTranslation();
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
      showFileInput={true}
      showIconsInput={true}
    />
  );
};

export default EWIProBoard;
