import React from "react";

const fonts = [
  { name: "Roboto", label: "Roboto" },
  { name: "Open Sans", label: "Open Sans" },
  { name: "Lato", label: "Lato" },
  { name: "Montserrat", label: "Montserrat" },
  { name: "Noto Sans", label: "Noto Sans" },
];

const FontSelector = ({ userSettings, updateFont }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Elige tu fuente favorita</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
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
              backgroundColor: "#f8f9fa",
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
