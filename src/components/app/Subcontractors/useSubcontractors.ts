import { useState, useEffect } from "react";
import api from "../../../api/axiosApi";
import { User } from "./types";

const mapSubcontractorItem = (
  item: any,
  roles: { id: number; name: string; accentColor?: string }[]
): User => {
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

  useEffect(() => {
    const fetchSubcontractors = async () => {
      setLoading(true);
      setError(null);

      try {
        const rolesRes = await api.post({ action: "getSubcontractorsRoles" });
        const roles: { id: number; name: string; accentColor?: string }[] = rolesRes.data?.results || [];

        const res = await api.post({
          action: "getSubcontractorsList",
          filters: [{ ongoingOnly: true }],
          sort: "projectIDDESC",
        });
        const results = res.data?.results || [];

        const mapped: User[] = results.map((item: any) => mapSubcontractorItem(item, roles));

        setUsers(mapped);
      } catch (err: any) {
        console.error("Błąd pobierania subcontractorów:", err);
        setError(err.response?.data?.message || "Nie udało się pobrać listy podwykonawców.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubcontractors();
  }, []);

  return { users, loading, error };
};
