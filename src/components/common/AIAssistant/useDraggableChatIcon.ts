import { useState, useRef, useEffect } from "react";

const ICON_SIZE = 56;

export const useDraggableChatIcon = (
  defaultRight = 60,
  defaultBottom = 20
) => {
  const DEFAULT_POS = { right: defaultRight, bottom: defaultBottom };

  const [pos, setPos] = useState(DEFAULT_POS);

  const dragRef = useRef({
    dragging: false,
    offsetX: 0,
    offsetY: 0,
    moved: false,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current.dragging = true;
    dragRef.current.moved = false;

    dragRef.current.offsetX =
      e.clientX - (window.innerWidth - pos.right - ICON_SIZE);
    dragRef.current.offsetY =
      e.clientY - (window.innerHeight - pos.bottom - ICON_SIZE);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;

      const newBottom =
        window.innerHeight - (e.clientY - dragRef.current.offsetY) - ICON_SIZE;

      const newRight =
        window.innerWidth - (e.clientX - dragRef.current.offsetX + ICON_SIZE);

      if (
        !dragRef.current.moved &&
        (Math.abs(newBottom - pos.bottom) > 3 ||
          Math.abs(newRight - pos.right) > 3)
      ) {
        dragRef.current.moved = true;
      }

      setPos({
        bottom: Math.max(0, Math.min(newBottom, window.innerHeight - ICON_SIZE)),
        right: Math.max(0, newRight),
      });
    };

    const handleMouseUp = () => {
      dragRef.current.dragging = false;
    };

    globalThis.addEventListener("mousemove", handleMouseMove);
    globalThis.addEventListener("mouseup", handleMouseUp);

    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pos.bottom, pos.right]);

  const resetPosition = () => {
    setPos(DEFAULT_POS);
  };

  return {
    pos,
    dragRef,
    handleMouseDown,
    resetPosition,
  };
};
