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
  const backgroundColor = isDark ? "#0f172a" : "#f3f4f6";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const accentColor = "#0078D4";

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
        {/* Logo superior (opcional, solo si quieres mantenerlo en todos los pasos) */}
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: "bold",
            color: "#fff",
            fontSize: "1.5rem",
            margin: "0 auto 10px auto",
          }}
        >
          BI
        </div>

        {children}
      </div>
    </div>
  );
};

export default AppWrapper;
