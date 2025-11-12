// StepWrapper.jsx
import React, { useEffect, useState } from "react";

const StepWrapper = ({ children, userSettings }) => {
  const theme = userSettings?.theme || "light";
  const font = userSettings?.font || "Segoe UI";
  const fontSize = userSettings?.fontSize || "16px";
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si está en móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // ejecutar una vez
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const backgroundColor = theme === "dark" ? "#1e1e1e" : "#f3f3f3";
  const textColor = theme === "dark" ? "#f5f5f5" : "#333";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
        fontFamily: font,
        fontSize,
        color: textColor,
        transition: "all 0.3s ease",
        padding: isMobile ? "10px" : "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: isMobile ? "100%" : "400px", // ✅ adaptable
          minHeight: "100px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: theme === "dark" ? "#2c2c2c" : "#fff",
          padding: isMobile ? "15px" : "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default StepWrapper;
