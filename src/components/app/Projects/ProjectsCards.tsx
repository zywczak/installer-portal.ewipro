import React from "react";
import CardList from "../../common/projects&subcontractors/List/CardList";
import { Project } from "./types";

interface Props {
  projects: Project[];
  stickyFooter?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onItemClick?: (project: Project) => void;
  noFooterOffset?: boolean;
}

const ProjectsCards: React.FC<Props> = ({ projects, stickyFooter, currentPage, onPageChange, onItemClick, noFooterOffset }) => {
  return (
    <CardList
      type="project"
      items={projects.map(p => ({
        id: p.id,
        title: p.projectCode,
        postcode: p.address.postcode,
        subtitle: p.address.rest,
        details: {
          Stage: p.stage,
          Access: p.accessType,
          "Total Value": p.totalValue,
          "My Value": p.myValue,
        },
        status: p.status,
        contactID: p.contactID,
        members: p.members,
        isOwner: p.isOwner,
        isWarranty: p.isWarranty,
      }))}
      stickyFooter={stickyFooter}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onItemClick={onItemClick}
      noFooterOffset={noFooterOffset}
    />
  );
};

export default ProjectsCards;
