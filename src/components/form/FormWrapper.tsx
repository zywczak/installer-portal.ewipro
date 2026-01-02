import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";

interface FormWrapperProps {
  children: React.ReactNode;
  onMobileChange?: (isMobile: boolean) => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ children, onMobileChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const theme = useTheme();

  const designWidth = 1200;
  const designHeight = 560;
  const mobileBreakpoint = theme.breakpoints.values.md;
  const minScale = 0.7;

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const availableWidth = containerRect.width;
      const availableHeight = containerRect.height;
      
      const windowWidth = window.innerWidth;
      
      const scaleWidth = availableWidth / designWidth;
      const scaleHeight = availableHeight / designHeight;
      
      const widthMobile = windowWidth < mobileBreakpoint;
      const scaleTooSmall = scaleWidth < minScale;
      const heightTooSmall = scaleHeight < minScale;
      
      const shouldBeMobile = widthMobile || scaleTooSmall || heightTooSmall;
      
      setIsMobile(shouldBeMobile);
      onMobileChange?.(shouldBeMobile);

      if (!shouldBeMobile) {
        setScale(scaleWidth);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [mobileBreakpoint, minScale, onMobileChange]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: `calc(100% - 32px)`,
        height: isMobile ? "auto" : designHeight * scale,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "hidden",
        position: "relative",
        mx: "16px",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : designWidth,
          height: isMobile ? "auto" : designHeight,
          transform: isMobile ? "none" : `scale(${scale})`,
          transformOrigin: "top center",
          flexShrink: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default FormWrapper;