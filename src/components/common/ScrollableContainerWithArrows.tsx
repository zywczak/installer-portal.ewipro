import React, { useRef, useState, useEffect, useLayoutEffect, ReactNode } from "react";
import { Box } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface ScrollableContainerWithArrowsProps {
  children: ReactNode;
  showArrows?: boolean;
}

const ScrollableContainerWithArrows: React.FC<ScrollableContainerWithArrowsProps> = ({
  children,
  showArrows = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const handleScroll = () => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
  };

  const scrollBy = (delta: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ top: delta, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    handleScroll();
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver(handleScroll);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => handleScroll(), [children]);

  return (
    <Box
      ref={ref}
      onScroll={handleScroll}
      sx={{
        position: "relative",
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": { width: 0 },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      
{showArrows && canScrollUp && (
  <Box
    onClick={() => scrollBy(-120)}
    sx={{
      position: "sticky",
      top: 0,
      width: "100%",
      height: 24,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
      zIndex: 2,
      cursor: "pointer",
    }}
  >
    <ArrowDropUpIcon sx={{ color: "white", mt: "-4px" }} />
  </Box>
)}

<Box sx={{ flexShrink: 0 }}>{children}</Box>

{showArrows && canScrollDown && (
  <Box
    onClick={() => scrollBy(120)}
    sx={{
      position: "sticky",
      bottom: 0,
      width: "100%",
      height: 24,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
      zIndex: 2,
      cursor: "pointer",
    }}
  >
    <ArrowDropDownIcon sx={{ color: "white", mb: "-4px" }} />
  </Box>
)}

    </Box>
  );
};

export default ScrollableContainerWithArrows;
