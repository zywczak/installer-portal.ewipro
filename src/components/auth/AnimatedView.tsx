import React from "react";
import { motion } from "framer-motion";

interface AnimatedViewProps {
  viewKey: string;
  children: React.ReactNode;
}

const AnimatedView: React.FC<AnimatedViewProps> = ({ viewKey, children }) => (
  <motion.div
    key={viewKey}
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -40, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default AnimatedView;
