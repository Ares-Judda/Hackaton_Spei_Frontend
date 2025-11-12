import React from "react";

const sizes = [
  { label: "A pequeña", value: "small", size: "20px" },
  { label: "A mediana", value: "medium", size: "26px" },
  { label: "A grande", value: "large", size: "32px" },
];

const FontSizeSelector = ({ userSettings, updateFontSize }) => {
  return (
    <div style={{ marginTop: "25px", textAlign: "center" }}>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "15px",
        }}
      >
        Elige tu tamaño de letra
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {sizes.map((option) => {
          const selected = userSettings.fontSize === option.size;
          return (
            <div
              key={option.value}
              onClick={() => updateFontSize(option.size)}
              style={{
                fontSize: option.size,
                fontWeight: "600",
                cursor: "pointer",
                border: selected ? "2px solid #0078D4" : "1px solid #cbd5e1",
                backgroundColor: selected ? "#0078D4" : "#f9fafb",
                color: selected ? "#fff" : "#1e293b",
                borderRadius: "12px",
                padding: "12px 20px",
                width: "80%",
                maxWidth: "300px",
                textAlign: "center",
                transition: "0.3s all ease",
                boxShadow: selected
                  ? "0 4px 12px rgba(0,120,212,0.3)"
                  : "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {option.label} — Ejemplo de texto
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FontSizeSelector;
