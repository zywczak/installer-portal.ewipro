import { useState, useEffect } from "react";

const ICON_SIZE = 56;

interface ChatStyle {
  top: number;
  right: number;
  width: number | string;
  height: number | string;
  opacity: number;
  transform: string;
}

export const useChatAnimation = (
  pos: { right: number; bottom: number }
) => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getClosedStyle = (): ChatStyle => ({
    top: window.innerHeight - pos.bottom - ICON_SIZE,
    right: pos.right,
    width: 0,
    height: 0,
    opacity: 0,
    transform: "scale(0.2)",
  });

  const [chatStyle, setChatStyle] = useState<ChatStyle>(getClosedStyle);

  const updateOpenStyle = () => {
    const isMobile = window.matchMedia("(max-width: 705px)").matches;

    setChatStyle({
      top: 0,
      right: 0,
      width: isMobile ? "100vw" : 600,
      height: isMobile ? "100vh" : window.innerHeight - 100,
      opacity: 1,
      transform: "scale(1)",
    });
  };

  const openChat = () => {
    setIsAnimating(true);
    setOpen(true);
    setChatStyle(getClosedStyle());

    requestAnimationFrame(updateOpenStyle);
  };

  const closeChat = () => {
    setChatStyle(getClosedStyle());

    setTimeout(() => {
      setOpen(false);
      setIsAnimating(false);
    }, 300);
  };

  /** resize – dokładnie jak w starej wersji */
  useEffect(() => {
    const handleResize = () => {
      if (!open) return;
      updateOpenStyle();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return {
    open,
    isAnimating,
    chatStyle,
    openChat,
    closeChat,
  };
};
