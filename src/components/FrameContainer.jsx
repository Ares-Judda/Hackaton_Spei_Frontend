import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FrameContainer({ children, theme, currentView }) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-neutral-900" : "bg-gray-100"
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView} // permite animar entre vistas
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className={`w-[380px] h-[700px] rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-center transition-colors duration-500 ${
            theme === "dark" ? "bg-neutral-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
