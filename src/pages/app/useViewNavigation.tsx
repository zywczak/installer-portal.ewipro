import { useState, useEffect } from "react";

export const useViewNavigation = () => {
  const getViewFromHash = () => {
    const rawHash = globalThis.location.hash.replace("#", "");
    if (!rawHash || rawHash.startsWith("?")) return "dashboard";
    const hashWithoutQuery = rawHash.includes("?") ? rawHash.split("?")[0] : rawHash;
    return hashWithoutQuery || "dashboard";
  };

  const [view, setView] = useState<string>(getViewFromHash());
  const [viewParam, setViewParam] = useState<string | null>(null);
  const [projectAddress, setProjectAddress] = useState<string | null>(null);
  const [subcontractorName, setSubcontractorName] = useState<string | null>(null);

  const isProjectView = view.startsWith("projects/");
  const isSubcontractorView = view.startsWith("subcontractors/");

  useEffect(() => {
    const onHashChange = () => {
      const hashView = getViewFromHash();
      setView(hashView);

      const parts = hashView.split("/");
      if (parts[0] === "projects") {
        setViewParam(parts[1] || null);
      } else if (parts[0] === "subcontractors") {
        setViewParam(parts[1] || null);
      } else {
        setViewParam(null);
      }
    };
    globalThis.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => globalThis.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigateTo = (newView: string) => {
    const viewWithoutQuery = newView.includes("?") 
      ? newView.split("?")[0] 
      : newView;
    const hashView = viewWithoutQuery || "dashboard";
    setView(hashView);

    const parts = hashView.split("/");
    if (parts[0] === "projects") {
      setViewParam(parts[1] || null);
    } else if (parts[0] === "subcontractors") {
      setViewParam(parts[1] || null);
    } else {
      setViewParam(null);
    }
    globalThis.location.hash = newView;
  };

  return {
    view,
    viewParam,
    projectAddress,
    subcontractorName,
    isProjectView,
    isSubcontractorView,
    setProjectAddress,
    setSubcontractorName,
    navigateTo,
  };
};