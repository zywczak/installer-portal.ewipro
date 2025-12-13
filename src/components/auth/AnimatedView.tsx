import React from "react";
import { motion } from "framer-motion";

interface AnimatedViewProps {
  viewKey: string;
  children: React.ReactNode;
}

const AnimatedView: React.FC<AnimatedViewProps> = ({ viewKey, children }) => (
  <motion.div
    key={viewKey}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default AnimatedView;
