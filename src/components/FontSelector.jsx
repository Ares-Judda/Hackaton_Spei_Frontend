import React from "react";

// 3 fuentes muy diferentes para accesibilidad
const fonts = [
  { name: "Arial", label: "Arial" },
  { name: "Courier New", label: "Courier New" },
  { name: "Impact", label: "Impact" }
];

const FontSelector = ({ userSettings, updateFont }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Elige tu fuente favorita (para mayor accesibilidad)</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {fonts.map((font) => {
          const isSelected = userSettings.font === font.name;
          return (
            <div
              key={font.name}
              onClick={() => updateFont(font.name)}
              className={`selection-button ${isSelected ? "selected" : ""}`}
              style={{
                fontFamily: `'${font.name}', sans-serif`,
                padding: "10px",
                borderRadius: "10px",
                border: isSelected ? "2px solid #0078D4" : "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: isSelected ? "#0078D4" : "#f8f9fa", // fondo azul si seleccionado
                color: isSelected ? "#ffffff" : "#000000", // texto blanco si seleccionado
                fontWeight: isSelected ? 600 : 400,
                transition: "0.2s",
              }}
            >
              Ejemplo: La fuente se verá así
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FontSelector;
