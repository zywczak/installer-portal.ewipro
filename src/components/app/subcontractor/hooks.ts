import { useState, useEffect, useCallback, useRef } from "react";
import { SubcontractorInfo, SubcontractorPermission, Project } from './types';
import { ALL_PERMISSIONS } from './constants';
import {
  fetchSubcontractorData,
  filterProjectsBySubcontractor,
  mapProjectData,
} from "./api";

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