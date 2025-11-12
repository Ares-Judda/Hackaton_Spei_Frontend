import React from "react";

const AppWrapper = ({ children, userSettings }) => {
  const theme = userSettings?.theme || "light";
  const font = userSettings?.font || "Segoe UI";
  const fontSize = userSettings?.fontSize || "16px";

  const backgroundColor = theme === "dark" ? "#1e1e1e" : "#f3f3f3";
  const textColor = theme === "dark" ? "#f5f5f5" : "#333";

  return (
    <div
      style={{
        width: "40vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor,
        fontFamily: font,
        fontSize,
        color: textColor,
        overflowY: "auto",
        
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "550px", // ⚡ ancho fijo como Wizard
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
