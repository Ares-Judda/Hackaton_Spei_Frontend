import React from "react";

const fonts = ["Arial", "Verdana", "Times New Roman", "Courier New", "Roboto"];

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
            key={font}
            onClick={() => updateFont(font)}
            className={`selection-button ${
              userSettings.font === font ? "selected" : ""
            }`}
            style={{ fontFamily: font }}
          >
            Ejemplo: La fuente se verá así
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;
