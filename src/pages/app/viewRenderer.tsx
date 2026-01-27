import React from "react";
import { Box } from "@mui/material";
import Project from "../../components/app/Project/project";
import Dashboard from "../../components/app/Dashboard/Dashboard";
import Subcontractor from "../../components/app/subcontractor/Subcontractor";
import OrderCreationPage from "../../components/app/OrderCreationPage";
import Projects from "../../components/app/Projects/Projects";
import Subcontractors from "../../components/app/Subcontractors/Subcontractors";
import Calculator from "../../components/app/Calculator/Calculator";
import ChangePassword from "../../components/app/ChangePassword";
import ProfileView from "../../components/app/MyProfile/ProfileView";
import AddProjectForm from "../../components/app/addProject/AddProjectForm";
import Settings from "../../components/app/settings/Settings";

interface ViewRendererProps {
  view: string;
  viewParam: string | null;
  isMobileContent: boolean;
  language: string;
  onLanguageChange: (lang: string) => void;
  onNavigateTo: (view: string) => void;
  onProjectAddressChange: (addr: string | null) => void;
  onSubcontractorNameChange: (name: string | null) => void;
}

const ViewRenderer: React.FC<ViewRendererProps> = ({
  view,
  viewParam,
  isMobileContent,
  language,
  onLanguageChange,
  onNavigateTo,
  onProjectAddressChange,
  onSubcontractorNameChange,
}) => {
  if (view.startsWith("projects/") && viewParam) {
    const parts = view.split("/");
    const projectId = Number(parts[1]);
    const contactId = Number(parts[2]);
    return (
      <Project
        projectId={projectId}
        contactId={contactId}
        onAddressChange={onProjectAddressChange}
      />
    );
  }

  if (view.startsWith("subcontractors/") && viewParam) {
    return (
      <Subcontractor 
        subcontractorId={viewParam}
        onNameChange={onSubcontractorNameChange}
      />
    );
  }

  if (view.startsWith("createOrder/")) {
    const parts = view.split("/");
    const projectId = parts[1];
    const contactId = parts[2];
    return <OrderCreationPage projectId={projectId} contactId={contactId} />;
  }

  const viewMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard isMobile={isMobileContent} />,
    projects: <Projects isMobile={isMobileContent} />,
    subcontractors: <Subcontractors isMobile={isMobileContent} />,
    settings: (
      <Settings 
        navigateTo={onNavigateTo} 
        language={language} 
        onLanguageChange={onLanguageChange} 
      />
    ),
    calculator: <Calculator />,
    changepassword: <ChangePassword />,
    profile: <ProfileView />,
    addProject: <AddProjectForm />
  };

  return <>{viewMap[view] || <Box>Not found</Box>}</>;
};

export default ViewRenderer;