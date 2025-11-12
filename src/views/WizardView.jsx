import React, { useEffect } from "react";
import AppWrapper from "../components/AppWrapper";
import { useFormController } from "../controllers/formController";

// 🔊 Función de lectura en voz
function speakText(text) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "es-MX";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

const WizardView = ({ onFinish }) => {
  const { userSettings, updateTheme, saveAnswer } = useFormController();
  const fontSizeStyle = { fontSize: userSettings.fontSize };
  const isVoiceActive = userSettings.needsVoiceAssistant;

  // 🎧 Voz inicial si está activa
  useEffect(() => {
    if (userSettings.needsVoiceAssistant) {
      speakText("Bienvenido al cuestionario de accesibilidad");
    } else {
      window.speechSynthesis.cancel();
    }
  }, [userSettings.needsVoiceAssistant]);

  // 🎨 Colores iguales al login
  const theme = userSettings?.theme;
  const isDark = theme === "dark";
  const isHighContrast = theme === "high-contrast";
  const bgColor = isHighContrast ? "#0f172a" : isDark ? "#0f172a" : "#f3f4f6";
  const cardBg = isHighContrast ? "#0a0a0a" : isDark ? "#252423" : "#0f172a";
  const textColor = isHighContrast ? "#ffffff" : isDark ? "#e2e8f0" : "#1e293b";
  const borderColor = isHighContrast ? "#19e6ff" : isDark ? "#334155" : "#d1d5db";
  const accentColor = isHighContrast ? "#19e6ff" : "#0078D4";

  return (
    <AppWrapper userSettings={userSettings}>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: bgColor,
          color: textColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px", // 👈 más ancho que login, pero mantiene equilibrio
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "transparent",
          }}
        >
          {/* 🔹 Título */}
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "6px" }}>
            Cuestionario de Accesibilidad
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              opacity: 0.85,
              textAlign: "center",
              marginBottom: "10px",
              maxWidth: "320px",
            }}
          >
            Ayúdanos a adaptar tu experiencia bancaria a tus necesidades.
          </p>

          {/* 🔸 Campos del formulario */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* 🗣️ 1. Asistente de voz */}
            <section>
              <label style={{ fontWeight: 600 }}>
                ¿Necesitas apoyo de un asistente de voz?
              </label>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
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
                        padding: "10px",
                        borderRadius: "10px",
                        border: active
                          ? `2px solid ${accentColor}`
                          : `1px solid ${borderColor}`,
                        backgroundColor: active
                          ? accentColor
                          : isDark
                            ? "#1e293b"
                            : "#fff",
                        color: active ? "#fff" : textColor,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 👤 2. Nombre */}
            <section>
              <label style={{ fontWeight: 600 }}>¿Cómo te llamamos?</label>
              <input
                type="text"
                placeholder="Ej. María"
                value={userSettings.name}
                onChange={(e) => saveAnswer("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                  color: textColor,
                }}
              />
            </section>

            {/* 🎂 3. Edad */}
            <section>
              <label style={{ fontWeight: 600 }}>Tu rango de edad</label>
              <select
                value={userSettings.ageRange}
                onChange={(e) => saveAnswer("ageRange", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                  color: textColor,
                }}
              >
                <option value="18_30">18 a 30 años</option>
                <option value="31_50">31 a 50 años</option>
                <option value="51_60">51 a 60 años</option>
                <option value="60_plus">Más de 60 años</option>
              </select>
            </section>

            {/* 👓 4. Lectura */}
            <section>
              <label style={{ fontWeight: 600 }}>¿Te cuesta leer texto pequeño?</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
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
                          padding: "10px",
                          borderRadius: "10px",
                          border: active
                            ? `2px solid ${accentColor}`
                            : `1px solid ${borderColor}`,
                          backgroundColor: active
                            ? accentColor
                            : isDark
                              ? "#1e293b"
                              : "#fff",
                          color: active ? "#fff" : textColor,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* 📱 5. Lector de pantalla */}
            <section>
              <label style={{ fontWeight: 600 }}>¿Usas lector de pantalla?</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
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
                        padding: "10px",
                        borderRadius: "10px",
                        border: active
                          ? `2px solid ${accentColor}`
                          : `1px solid ${borderColor}`,
                        backgroundColor: active
                          ? accentColor
                          : isDark
                            ? "#1e293b"
                            : "#fff",
                        color: active ? "#fff" : textColor,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 🧭 6. Confianza */}
            <section>
              <label style={{ fontWeight: 600 }}>
                ¿Qué tan cómoda te sientes usando apps?
              </label>
              <select
                value={userSettings.confidence}
                onChange={(e) => saveAnswer("confidence", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                  color: textColor,
                }}
              >
                <option value="low">Me cuesta bastante</option>
                <option value="medium">Más o menos</option>
                <option value="high">Muy cómoda</option>
              </select>
            </section>

            {/* ✍️ 7. Lectura y escritura */}
            <section>
              <label style={{ fontWeight: 600 }}>
                ¿Qué tan fácil es para ti leer y escribir mensajes?
              </label>
              <select
                value={userSettings.literacy}
                onChange={(e) => saveAnswer("literacy", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                  color: textColor,
                }}
              >
                <option value="low">Me cuesta leer o escribir mensajes largos</option>
                <option value="medium">A veces me cuesta</option>
                <option value="high">No tengo problemas</option>
              </select>
            </section>

            {/* 🎨 8. Tema */}
            <section>
              <label style={{ fontWeight: 600 }}>Selecciona tema</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                {["light", "dark", "high-contrast"].map((t) => (
                  <div
                    key={t}
                    onClick={() => updateTheme(t)}
                    onMouseEnter={() =>
                      isVoiceActive &&
                      speakText(
                        t === "light"
                          ? "Claro"
                          : t === "dark"
                            ? "Oscuro"
                            : "Alto contraste"
                      )
                    }
                    style={{
                      flex: 1,
                      padding: "16px",
                      cursor: "pointer",
                      borderRadius: "10px",
                      border:
                        userSettings.theme === t
                          ? `2px solid ${accentColor}`
                          : `1px solid ${borderColor}`,
                      backgroundColor:
                        t === "light"
                          ? "#fff"
                          : t === "dark"
                            ? "#1e293b"
                            : "#000", // alto contraste
                      color:
                        t === "light"
                          ? "#333"
                          : t === "dark"
                            ? "#f9fafb"
                            : "#fff", // alto contraste
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {t === "light"
                      ? "Claro"
                      : t === "dark"
                        ? "Oscuro"
                        : "Alto Contraste"}
                  </div>
                ))}
              </div>
            </section>


            {/* ✅ Botón Finalizar */}
            <section style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => onFinish(userSettings)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: accentColor,
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#005EA6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = accentColor)}
              >
                Finalizar
              </button>
            </section>
          </div>

          {/* 🔹 Pie */}
          <p
            style={{
              fontSize: "0.7rem",
              opacity: 0.6,
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Tu información se usará solo para personalizar tu experiencia.
          </p>
        </div>
      </div>
    </AppWrapper>
  );
};

export default WizardView;
