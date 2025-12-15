import React from "react";
import CardList from "../List/CardList";
import { Project } from "./types";

interface Props {
  projects: Project[];
  stickyFooter?: boolean;
}

const ProjectsCards: React.FC<Props> = ({ projects, stickyFooter }) => {
  return (
    <CardList
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
      type="project"
      onItemClick={(item) => { window.location.hash = `projects/${item.id}/${item.contactID}`; }}
      stickyFooter={stickyFooter}
    />
  );
};

export default ProjectsCards;
