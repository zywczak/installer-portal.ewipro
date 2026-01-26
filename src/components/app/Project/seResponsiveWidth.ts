import { useState, useEffect, RefObject } from "react";

export const useResponsiveWidth = (containerRef: RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState<number>(1200);

  useEffect(() => {
    if (!containerRef.current) return;

    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setWidth(rect.width);
    });

    obs.observe(containerRef.current);

    return () => obs.disconnect();
  }, [containerRef]);

  return width;
};
