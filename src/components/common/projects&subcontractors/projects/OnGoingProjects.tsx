import React from "react";
import ProjectsView from "./ProjectsView";

interface OnGoingProjectsProps {
  isMobile: boolean;
}

const OnGoingProjects: React.FC<OnGoingProjectsProps> = ({ isMobile }) => {
  return <ProjectsView isMobile={isMobile} ongoingOnly sort="projectIDASC" showAddButton={false} stickyFooter={false} />;
};

export default OnGoingProjects;
