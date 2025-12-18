import { useEffect, useRef, useState } from "react";

export const useWrapDetection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const checkWrap = () => {
      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return;

      const firstTop = children[0].offsetTop;
      setIsWrapped(children.some((c) => c.offsetTop > firstTop));
    };

    checkWrap();
    window.addEventListener("resize", checkWrap);
    return () => window.removeEventListener("resize", checkWrap);
  }, []);

  return { containerRef, isWrapped };
};
