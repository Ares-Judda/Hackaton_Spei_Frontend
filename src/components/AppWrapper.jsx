import React, { useEffect, useState } from "react";

const AppWrapper = ({ children, userSettings }) => {
  const theme = userSettings?.theme || "light";
  const font = userSettings?.font || "'Segoe UI', Arial, sans-serif";
  const fontSize = userSettings?.fontSize || "16px";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎨 Colores coherentes y accesibles
  const isDark = theme === "dark";
  const isHighContrast = theme === "high-contrast";

  const backgroundColor = isHighContrast
    ? "#0f172a"   // igual que el fondo oscuro
    : isDark
      ? "#0f172a"
      : "#f3f4f6";

  const textColor = isHighContrast
    ? "#ffffff"
    : isDark
      ? "#e2e8f0"
      : "#1e293b";

  const accentColor = isHighContrast ? "#19e6ff" : "#0078D4";


  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor,
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: isMobile ? "20px" : "40px",
        fontFamily: font,
        fontSize,
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "95%" : "520px", // 💡 más ancho que el login
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AppWrapper;
