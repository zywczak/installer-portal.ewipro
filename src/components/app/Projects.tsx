import React from "react";
import ProjectsView from "../common/projects&subcontractors/projects/ProjectsView";


interface ProjectsProps {
  isMobile: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ isMobile }) => {
  return <ProjectsView isMobile={isMobile} />;
};

export default Projects;
