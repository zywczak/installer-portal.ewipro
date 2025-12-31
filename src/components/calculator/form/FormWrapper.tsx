import React, { useEffect, useState, useRef } from "react";

interface ResponsiveCalculatorWrapperProps {
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  isMobileView: boolean;
}

const ResponsiveCalculatorWrapper: React.FC<ResponsiveCalculatorWrapperProps> = ({ 
  children, 
  defaultWidth = 1225,
  defaultHeight = 680,
  isMobileView 
}) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (isMobileView || !containerRef.current) {
        setScale(1);
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      
      if (containerWidth >= defaultWidth) {
        setScale(1);
      } else {
        const newScale = containerWidth / defaultWidth;
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    
    // Dodatkowe sprawdzenie po krótkim opóźnieniu (dla pewności, że DOM się załadował)
    const timeout = setTimeout(updateScale, 100);
    
    return () => {
      window.removeEventListener("resize", updateScale);
      clearTimeout(timeout);
    };
  }, [isMobileView, defaultWidth]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'visible',
        height: isMobileView ? 'auto' : `${defaultHeight * scale}px`,
        transition: 'height 0.3s ease'
      }}
    >
      <div
        style={{
          transform: isMobileView ? 'none' : `scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.3s ease',
          width: isMobileView ? '100%' : `${defaultWidth}px`,
          height: isMobileView ? 'auto' : `${defaultHeight}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveCalculatorWrapper;