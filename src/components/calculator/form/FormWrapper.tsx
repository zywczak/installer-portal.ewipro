// import React, { useEffect, useRef, useState } from "react";
// import { Box, useTheme } from "@mui/material";

// interface FormWrapperProps {
//   children: React.ReactNode;
//   onMobileChange?: (isMobile: boolean) => void;
// }

// const FormWrapper: React.FC<FormWrapperProps> = ({ children, onMobileChange }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [scale, setScale] = useState(1);
//   const [isMobile, setIsMobile] = useState(false);
//   const theme = useTheme();

//   const designWidth = 1200;
//   const designHeight = 560;
//   const mobileBreakpoint = theme.breakpoints.values.md;
//   const minScale = 0.7;

//   useEffect(() => {
//     const handleResize = () => {
//       if (!containerRef.current) return;
      
//       const container = containerRef.current;
//       const containerRect = container.getBoundingClientRect();
//       const availableWidth = containerRect.width;
//       const availableHeight = containerRect.height;
      
//       const windowWidth = window.innerWidth;
      
//       const scaleWidth = availableWidth / designWidth;
//       const scaleHeight = availableHeight / designHeight;
      
//       const widthMobile = windowWidth < mobileBreakpoint;
//       const scaleTooSmall = scaleWidth < minScale;
//       const heightTooSmall = scaleHeight < minScale;
      
//       const shouldBeMobile = widthMobile || scaleTooSmall || heightTooSmall;
      
//       setIsMobile(shouldBeMobile);
//       onMobileChange?.(shouldBeMobile);

//       if (!shouldBeMobile) {
//         setScale(scaleWidth);
//       } else {
//         setScale(1);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
    
//     const resizeObserver = new ResizeObserver(handleResize);
//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current);
//     }

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       resizeObserver.disconnect();
//     };
//   }, [mobileBreakpoint, minScale, onMobileChange]);

//   return (
//     <Box
//       ref={containerRef}
//       sx={{
//         width: `calc(100% - 32px)`,
//         height: isMobile ? "auto" : designHeight * scale,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         overflow: "hidden",
//         position: "relative",
//         mx: "16px",
//         borderRadius: 3,
//       }}
//     >
//       <Box
//         sx={{
//           width: isMobile ? "100%" : designWidth,
//           height: isMobile ? "auto" : designHeight,
//           transform: isMobile ? "none" : `scale(${scale})`,
//           transformOrigin: "top center",
//           flexShrink: 0,
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default FormWrapper;


import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";

interface FormWrapperProps {
  children: React.ReactNode;
  onMobileChange?: (isMobile: boolean) => void;
}

const DESIGN_WIDTH = 1225;
const DESIGN_HEIGHT = 680;

const FormWrapper: React.FC<FormWrapperProps> = ({ children, onMobileChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const isMobileView = window.innerWidth < theme.breakpoints.values.md;

      setIsMobile(isMobileView);
      onMobileChange?.(isMobileView);

      if (isMobileView) {
        setScale(1);
        return;
      }

      if (containerWidth >= DESIGN_WIDTH) {
        setScale(1);
      } else {
        setScale(containerWidth / DESIGN_WIDTH);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    const observer = new ResizeObserver(handleResize);

    observer.observe(containerRef.current!);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [onMobileChange, theme.breakpoints.values.md]);

  return (
    <Box
  ref={containerRef}
  sx={{
    width: "100%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    height: isMobile ? "auto" : DESIGN_HEIGHT * scale, // <- tutaj dynamiczna wysokość
  }}
>
  <Box
    sx={{
      width: isMobile ? "100%" : DESIGN_WIDTH,
      height: isMobile ? "auto" : DESIGN_HEIGHT,
      transform: isMobile ? "none" : `scale(${scale})`,
      transformOrigin: "top center",
      transition: "transform 0.2s ease",
    }}
  >
        {children}
      </Box>
    </Box>
  );
};

export default FormWrapper;
