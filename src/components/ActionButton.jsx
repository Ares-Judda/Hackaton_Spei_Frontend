import React from "react";

const ActionButton = ({ icon, label, onClick, userSettings }) => {
  const isDark = userSettings.theme === "dark";

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        backgroundColor: isDark ? "#0078D4" : "#e0f2ff",
        color: isDark ? "#fff" : "#0078D4",
        fontFamily: `'${userSettings.font}', sans-serif`,
        fontSize: userSettings.fontSize,
        fontWeight: 600,
        transition: "0.3s",
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;
