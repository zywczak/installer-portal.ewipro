import React from "react";
import ProjectsView from "./ProjectsView";


interface ProjectsProps {
  isMobile: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ isMobile }) => {
  return <ProjectsView isMobile={isMobile} />;
};

export default Projects;
