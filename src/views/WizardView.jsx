import React, { useEffect } from "react";
import AppWrapper from "../components/AppWrapper";
import { useFormController } from "../controllers/formController";

// 🔊 Función de lectura
function speakText(text) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) {
    console.warn("speechSynthesis no disponible en este navegador.");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "es-MX";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

const WizardView = ({ onFinish }) => {
  const { userSettings, updateTheme, saveAnswer } = useFormController();
  const fontSizeStyle = { fontSize: userSettings.fontSize };
  const isVoiceActive = userSettings.needsVoiceAssistant;

  // 🎧 Control de voz según preferencia
  useEffect(() => {
    if (userSettings.needsVoiceAssistant) {
      speakText("Bienvenido al cuestionario de accesibilidad");
    } else {
      window.speechSynthesis.cancel();
    }
  }, [userSettings.needsVoiceAssistant]);

  // 🎨 Colores y estilos globales
  const theme = userSettings?.theme;
  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f172a" : "#f3f4f6";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const borderColor = isDark ? "#334155" : "#d1d5db";
  const accentColor = "#0078D4";

  return (
    <AppWrapper userSettings={userSettings}>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: bgColor,
          color: textColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* 🧭 Encabezado */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
              Cuestionario de Accesibilidad
            </h1>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Ayúdanos a adaptar la experiencia a tus necesidades.
            </p>
          </div>

          {/* ✅ 1. Asistente de voz */}
          <div>
            <h2 style={fontSizeStyle}>
              ¿Necesitas apoyo de un asistente de voz?
              {isVoiceActive && (
                <button
                  onClick={() =>
                    speakText("¿Necesitas apoyo de un asistente de voz?")
                  }
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {["Sí", "No"].map((label, idx) => {
                const value = idx === 0;
                const active = userSettings.needsVoiceAssistant === value;
                return (
                  <button
                    key={label}
                    onClick={() => saveAnswer("needsVoiceAssistant", value)}
                    onMouseEnter={() => isVoiceActive && speakText(label)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "12px",
                      border: active
                        ? `2px solid ${accentColor}`
                        : `1px solid ${borderColor}`,
                      backgroundColor: active
                        ? accentColor
                        : isDark
                        ? "#1e293b"
                        : "#fff",
                      color: active ? "#fff" : textColor,
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      ...fontSizeStyle,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 👤 2. Nombre */}
          <div>
            <h2 style={fontSizeStyle}>
              ¿Cómo te llamamos?
              {isVoiceActive && (
                <button
                  onClick={() => speakText("¿Cómo te llamamos?")}
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <input
              type="text"
              placeholder="Ej. María"
              value={userSettings.name}
              onChange={(e) => saveAnswer("name", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                color: textColor,
                outline: "none",
                ...fontSizeStyle,
              }}
            />
          </div>

          {/* 🎂 3. Edad */}
          <div>
            <h2 style={fontSizeStyle}>
              Tu rango de edad
              {isVoiceActive && (
                <button
                  onClick={() => speakText("Tu rango de edad")}
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <select
              value={userSettings.ageRange}
              onChange={(e) => saveAnswer("ageRange", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                color: textColor,
                ...fontSizeStyle,
              }}
            >
              <option value="18_30">18 a 30 años</option>
              <option value="31_50">31 a 50 años</option>
              <option value="51_60">51 a 60 años</option>
              <option value="60_plus">Más de 60 años</option>
            </select>
          </div>

          {/* 👓 4. Lectura */}
          <div>
            <h2 style={fontSizeStyle}>
              ¿Te cuesta leer texto pequeño?
              {isVoiceActive && (
                <button
                  onClick={() => speakText("¿Te cuesta leer texto pequeño?")}
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {["Sí, prefiero letra grande", "No, puedo leer bien"].map(
                (label, idx) => {
                  const value = idx === 0 ? false : true;
                  const active = userSettings.canReadSmallText === value;
                  return (
                    <button
                      key={label}
                      onClick={() => saveAnswer("canReadSmallText", value)}
                      onMouseEnter={() => isVoiceActive && speakText(label)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "12px",
                        border: active
                          ? `2px solid ${accentColor}`
                          : `1px solid ${borderColor}`,
                        backgroundColor: active
                          ? accentColor
                          : isDark
                          ? "#1e293b"
                          : "#fff",
                        color: active ? "#fff" : textColor,
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                        ...fontSizeStyle,
                      }}
                    >
                      {label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* 📱 5. Lector de pantalla */}
          <div>
            <h2 style={fontSizeStyle}>
              ¿Usas lector de pantalla?
              {isVoiceActive && (
                <button
                  onClick={() => speakText("¿Usas lector de pantalla?")}
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {["Sí", "No"].map((label, idx) => {
                const value = idx === 0;
                const active = userSettings.usesScreenReader === value;
                return (
                  <button
                    key={label}
                    onClick={() => saveAnswer("usesScreenReader", value)}
                    onMouseEnter={() => isVoiceActive && speakText(label)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "12px",
                      border: active
                        ? `2px solid ${accentColor}`
                        : `1px solid ${borderColor}`,
                      backgroundColor: active
                        ? accentColor
                        : isDark
                        ? "#1e293b"
                        : "#fff",
                      color: active ? "#fff" : textColor,
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      ...fontSizeStyle,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🧭 6. Confianza */}
          <div>
            <h2 style={fontSizeStyle}>
              ¿Qué tan cómoda te sientes usando apps?
              {isVoiceActive && (
                <button
                  onClick={() =>
                    speakText("¿Qué tan cómoda te sientes usando apps?")
                  }
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <select
              value={userSettings.confidence}
              onChange={(e) => saveAnswer("confidence", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                color: textColor,
                ...fontSizeStyle,
              }}
            >
              <option value="low">Me cuesta bastante</option>
              <option value="medium">Más o menos</option>
              <option value="high">Muy cómoda</option>
            </select>
          </div>

          {/* ✍️ 7. Lectura y escritura */}
          <div>
            <h2 style={fontSizeStyle}>
              ¿Qué tan fácil es para ti leer y escribir mensajes?
              {isVoiceActive && (
                <button
                  onClick={() =>
                    speakText(
                      "¿Qué tan fácil es para ti leer y escribir mensajes?"
                    )
                  }
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <select
              value={userSettings.literacy}
              onChange={(e) => saveAnswer("literacy", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                color: textColor,
                ...fontSizeStyle,
              }}
            >
              <option value="low">
                Me cuesta leer o escribir mensajes largos
              </option>
              <option value="medium">A veces me cuesta</option>
              <option value="high">No tengo problemas</option>
            </select>
          </div>

          {/* 🎨 8. Tema */}
          <div>
            <h2 style={fontSizeStyle}>
              Selecciona tema
              {isVoiceActive && (
                <button
                  onClick={() => speakText("Selecciona tema")}
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </h2>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {["light", "dark"].map((theme) => (
                <div
                  key={theme}
                  onClick={() => updateTheme(theme)}
                  onMouseEnter={() =>
                    isVoiceActive &&
                    speakText(theme === "light" ? "Claro" : "Oscuro")
                  }
                  style={{
                    flex: 1,
                    padding: "20px",
                    cursor: "pointer",
                    borderRadius: "12px",
                    border:
                      userSettings.theme === theme
                        ? `2px solid ${accentColor}`
                        : `1px solid ${borderColor}`,
                    backgroundColor: theme === "light" ? "#fff" : "#1e293b",
                    color: theme === "light" ? "#333" : "#f9fafb",
                    textAlign: "center",
                    fontWeight: 600,
                    ...fontSizeStyle,
                  }}
                >
                  {theme === "light" ? "Claro" : "Oscuro"}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Botón Finalizar */}
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              onClick={() => onFinish(userSettings)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: accentColor,
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#005EA6")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = accentColor)
              }
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default WizardView;
