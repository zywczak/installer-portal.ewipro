import React from "react";
import CardList from "../../common/projects&subcontractors/List/CardList";
import { User } from "./types";

interface Props {
  users: User[];
  onItemClick: (id: string) => void;
}

const SubcontractorsCards: React.FC<Props> = ({ users, onItemClick }) => {
  return (
    <CardList
      type="subcontractor"
      items={users.map((u) => ({
        id: u.id.toString(),
        name: u.name,
        company: u.company,
        email: u.email,
        phone: u.phone,
        role: u.role,
        roleColor: u.roleColor,
        status: u.status,
        avatar: u.avatar || undefined,
      }))}
      onItemClick={(item) => onItemClick(item.id)}
    />
  );
};

export default SubcontractorsCards;
