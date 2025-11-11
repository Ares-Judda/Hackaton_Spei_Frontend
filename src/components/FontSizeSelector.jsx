import React from "react";

const sizes = [
  { label: "A pequeña", value: "small" },
  { label: "A mediana", value: "medium" },
  { label: "A grande", value: "large" },
];

const FontSizeSelector = ({ userSettings, updateFontSize }) => {
  const fontSample = "Ejemplo de tamaño";

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Elige tu tamaño de letra</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {sizes.map((size) => (
          <div
            key={size.value}
            onClick={() => updateFontSize(size.value)}
            className={`selection-button ${
              userSettings.fontSize === size.value ? "selected" : ""
            }`}
            style={{
              fontSize:
                size.value === "small"
                  ? "14px"
                  : size.value === "medium"
                  ? "18px"
                  : "22px",
            }}
          >
            {size.label} - Ejemplo de texto
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontSizeSelector;
