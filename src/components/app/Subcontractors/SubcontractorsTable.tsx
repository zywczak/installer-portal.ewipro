import React from "react";
import DataTable, { Column } from "../../common/projects&subcontractors/Table/DataTable";
import UserAvatar from "../../common/UserAvatar"; 
import { User } from "./types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
  const columns: Column<User>[] = [
    {
      key: "photo",
      label: "",
      render: (u: User) => <UserAvatar avatarUrl={typeof u.avatar === "string" ? u.avatar : undefined} size={40} />,
      width: 50,
    },
    { key: "name", label: t("views.subcontractors.table.name")},
    { key: "company", label: t("views.subcontractors.table.company"), render: (u: User) => u.company || "-" },
    { key: "email", label: t("views.subcontractors.table.email") },
    { key: "phone", label: t("views.subcontractors.table.phone") },
    { key: "role", label: t("views.subcontractors.table.role") },
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
