import { useState, useEffect } from "react";
import api from "../api/axiosApi";
import { User } from "../components/common/projects&subcontractors/subcontractors/types";

interface Role {
  id: number;
  name: string;
  accentColor?: string;
}

const mapSubcontractor = (item: any, roles: Role[]): User => {
  const role = roles.find((r) => r.id === item.defaultRoleID);
  return {
    id: item.userID,
    name: item.nameSurname || "-",
    email: item.email || "-",
    phone: item.mobile || "-",
    company: item.companyName || "-",
    status: item.invited ? "invited" : "verified",
    role: role?.name || "Unknown",
    roleColor: role?.accentColor || undefined,
    avatar: item.avatar || false,
    invited: !!item.invited,
    permissions: item.permissions || [],
    raw: item,
  };
};

export const useSubcontractors = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async (): Promise<Role[]> => {
    const res = await api.post({ action: "getSubcontractorsRoles" });
    return res.data?.results || [];
  };

  const fetchSubcontractorsList = async (): Promise<any[]> => {
    const res = await api.post({
      action: "getSubcontractorsList",
      filters: [{ ongoingOnly: true }],
      sort: "projectIDDESC",
    });
    return res.data?.results || [];
  };

  useEffect(() => {
    const loadSubcontractors = async () => {
      setLoading(true);
      setError(null);

      try {
        const roles = await fetchRoles();
        const subcontractors = await fetchSubcontractorsList();
        const mapped = subcontractors.map((item) => mapSubcontractor(item, roles));
        setUsers(mapped);
      } catch (err: any) {
        console.error("Błąd pobierania subcontractorów:", err);
        setError(err.response?.data?.message || "Nie udało się pobrać listy podwykonawców.");
      } finally {
        setLoading(false);
      }
    };

    loadSubcontractors();
  }, []);

  return { users, loading, error };
};
