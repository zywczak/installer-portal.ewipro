import React from "react";
import DataTable, { Column } from "../Table/DataTable";
import UserAvatar from "../../UserAvatar"; 
import { User } from "./types";

interface Props {
  users: User[];
  onRowClick: (user: User) => void;
  onOverflow: (overflow: boolean) => void;
}

const rowStatusColor: Record<User["status"], string> = {
  verified: "#54A852",
  invited: "#fbc02d",
  not_registered: "#9b9b9bff",
};

const SubcontractorsTable: React.FC<Props> = ({ users, onRowClick, onOverflow }) => {
  const columns: Column<User>[] = [
    {
      key: "photo",
      label: "",
      render: (u: User) => <UserAvatar avatarUrl={typeof u.avatar === "string" ? u.avatar : undefined} size={40} />,
      width: 50,
    },
    { key: "name", label: "Name" },
    { key: "company", label: "Company", render: (u: User) => u.company || "-" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      rowKey={(u) => u.id}
      onHorizontalOverflow={onOverflow}
      onRowClick={onRowClick}
      type="subcontractor"
      getRowStatusColor={(row) => rowStatusColor[row.status]}
    />
  );
};

export default SubcontractorsTable;
