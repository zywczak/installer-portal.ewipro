import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { SubcontractorInfo, SubcontractorPermission, Project } from './types';
import { ALL_PERMISSIONS } from './constants';
import {
  fetchSubcontractorData,
  filterProjectsBySubcontractor,
  mapProjectData,
} from "./api";
import { SortOption, RoleFilter, StatusFilter } from "../Projects/useProjects";

export const useProjectFilters = (projects: Project[]) => {
  const [sort, setSort] = useState<SortOption>("projectIDDESC");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const reset = useCallback(() => {
    setSort("projectIDDESC");
    setRoleFilter("all");
    setStatusFilter("all");
    setSearch("");
  }, []);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.projectCode.toLowerCase().includes(q) ||
          p.address.full.toLowerCase().includes(q)
      );
    }

    if (roleFilter === "owner") result = result.filter((p) => p.isOwner);
    if (roleFilter === "member") result = result.filter((p) => !p.isOwner);

    if (statusFilter === "ongoing") result = result.filter((p) => p.status !== "Closed");
    if (statusFilter === "archived") result = result.filter((p) => p.status === "Closed");

    if (sort === "projectIDASC") {
      result.sort((a, b) => Number(a.id) - Number(b.id));
    } else {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [projects, search, roleFilter, statusFilter, sort]);

  return {
    sort, setSort,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    search, setSearch,
    reset,
    filteredProjects: filtered,
  };
};

export const useSubcontractorData = (subcontractorId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<SubcontractorInfo | null>(null);
  const [permissions, setPermissions] = useState<SubcontractorPermission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { allProjects, info } = await fetchSubcontractorData(subcontractorId);
      setInfo(info);

      const filtered = filterProjectsBySubcontractor(allProjects, subcontractorId);
      const mapped = mapProjectData(filtered, subcontractorId);

      setProjects(mapped);
      setPermissions(ALL_PERMISSIONS.map((p) => ({ ...p, enabled: true })));
    } catch (err) {
      console.error(err);
      setError("Data download error.");
    } finally {
      setLoading(false);
    }
  }, [subcontractorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTogglePermission = (key: string, enabled: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled } : p))
    );
  };

  return {
    loading,
    error,
    info,
    permissions,
    projects,
    handleTogglePermission,
  };
};

export const useResponsiveWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(1200);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setWidth(rect.width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const isMobile = width <= 768;

  return { containerRef, width, isMobile };
};

export const useNameChangeEffect = (
  activeTab: string,
  info: SubcontractorInfo | null,
  onNameChange?: (name: string | null) => void
) => {
  useEffect(() => {
    if (onNameChange && info) {
      if (activeTab === "info") {
        onNameChange(null);
      } else {
        onNameChange(info.name);
      }
    }

    return () => {
      if (onNameChange) {
        onNameChange(null);
      }
    };
  }, [activeTab, info, onNameChange]);
};