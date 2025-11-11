import React from "react";

// Lista de fuentes compatibles
const fonts = [
  { name: "Arial", label: "Arial" },
  { name: "Verdana", label: "Verdana" },
  { name: "Times New Roman", label: "Times New Roman" },
  { name: "Courier New", label: "Courier New" },
  { name: "Roboto", label: "Roboto" }, // cargada vía Google Fonts
];

const FontSelector = ({ userSettings, updateFont }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Elige tu fuente favorita</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {fonts.map((font) => (
          <div
            key={font.name}
            onClick={() => updateFont(font.name)}
            className={`selection-button ${userSettings.font === font.name ? "selected" : ""}`}
            style={{
              fontFamily: `'${font.name}', sans-serif`,
              padding: "10px",
              borderRadius: "10px",
              border: userSettings.font === font.name ? "2px solid #0078D4" : "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Ejemplo: La fuente se verá así
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;
