// AppWrapper.jsx
import React, { useEffect, useState } from "react";

const AppWrapper = ({ children, userSettings }) => {
  const theme = userSettings?.theme || "light";
  const font = userSettings?.font || "Segoe UI";
  const fontSize = userSettings?.fontSize || "16px";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
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
        justifyContent: "center",
        padding: isMobile ? "10px" : "20px",
        backgroundColor,
        fontFamily: font,
        fontSize,
        color: textColor,
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "550px", // ✅ más ancho en desktop, fluido en móvil
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AppWrapper;
