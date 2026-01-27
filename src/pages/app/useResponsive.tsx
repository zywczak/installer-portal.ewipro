import { useState, useEffect } from "react";

export const useResponsive = () => {
  const [isMobileContent, setIsMobileContent] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  useEffect(() => {
    const handleResize = () => setIsMobileContent(window.innerWidth < 705);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobileContent,
    mobileSidebarOpen,
    sidebarWidth,
    setMobileSidebarOpen,
    setSidebarWidth,
  };
};

export default useResponsive;