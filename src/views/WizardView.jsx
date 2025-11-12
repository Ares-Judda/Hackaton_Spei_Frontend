import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppWrapper from "../components/AppWrapper";
import { useFormController } from "../controllers/formController";
import logo from "../assets/logo.png";

// 🔊 Función de lectura (segura en SSR)
function speakText(text) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) {
    console.warn("speechSynthesis no disponible en este navegador.");
    return;
  }
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    // cancela lo anterior y habla
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (err) {
    console.warn("Error en speechSynthesis:", err);
  }
}

const WizardView = ({ onFinish }) => {
  // controlador (asegúrate que useFormController devuelva userSettings con defaults)
  const { userSettings: rawSettings = {}, updateTheme, saveAnswer } =
    useFormController();

  // aseguramos defaults para evitar errores si algo viene undefined
  const userSettings = {
    needsVoiceAssistant: false,
    name: "",
    ageRange: "18_30",
    canReadSmallText: true,
    usesScreenReader: false,
    confidence: "medium",
    literacy: "medium",
    theme: "light",
    fontSize: "16px",
    accentColor: undefined,
    ...rawSettings,
  };

  const fontSizeStyle = { fontSize: userSettings.fontSize };
  const isVoiceActive = !!userSettings.needsVoiceAssistant;

  // 🎧 Voz inicial si está activa; limpieza on unmount
  useEffect(() => {
    if (isVoiceActive) {
      speakText("Bienvenido al cuestionario de accesibilidad");
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceActive]);

  // 🎨 Tomar accentColor desde settings (se pedía "jale el color del login")
  const accentColor = userSettings.accentColor || "#0078D4";

  const theme = userSettings.theme;
  const isDark = theme === "dark";
  const isHighContrast = theme === "high-contrast";
  const bgColor = isHighContrast ? "#0f172a" : isDark ? "#0f172a" : "#f3f4f6";
  const cardBg = isHighContrast ? "#0a0a0a" : isDark ? "#252423" : "#0f172a";
  const textColor = isHighContrast ? "#ffffff" : isDark ? "#e2e8f0" : "#1e293b";
  const borderColor = isHighContrast ? "#19e6ff" : isDark ? "#334155" : "#d1d5db";
  const accentColor = isHighContrast ? "#19e6ff" : "#0078D4";


  // helper para accesibilidad en botones (enter / space)
  const handleKeyActivate = (e, fn) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

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
          padding: "28px",
          transition: "background 0.25s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backgroundColor: "transparent",
            padding: "8px",
          }}
        >
        <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <img
              src={logo}
              alt="Logo B-accesible"
              style={{
                backgroundColor: "white", // opcional
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
          {/* Encabezado */}
          <header style={{ textAlign: "center", marginBottom: "6px" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              Cuestionario de Accesibilidad
            </h1>
            <p style={{ fontSize: "0.95rem", opacity: 0.85 }}>
              Ayúdanos a adaptar tu experiencia bancaria a tus necesidades.
            </p>
          </header>

          {/* 1. Asistente de voz */}
          <section aria-labelledby="q-voice">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-voice" style={{ margin: 0, ...fontSizeStyle }}>
                ¿Necesitas apoyo de un asistente de voz?
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta asistente de voz"
                  title="Reproducir pregunta"
                  onClick={() => speakText("¿Necesitas apoyo de un asistente de voz?")}
                  style={{
                    marginLeft: 8,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    color: accentColor,
                  }}
                >
                  🔊
                </button>
              )}
            </div>

            <div
              role="group"
              aria-label="Seleccionar si necesita asistente de voz"
              style={{ display: "flex", gap: "10px", marginTop: "10px" }}
            >
              {[
                { label: "Sí", value: true },
                { label: "No", value: false },
              ].map((opt) => {
                const active = userSettings.needsVoiceAssistant === opt.value;
                return (
                  <div
                    key={String(opt.value)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() => saveAnswer("needsVoiceAssistant", opt.value)}
                    onKeyDown={(e) =>
                      handleKeyActivate(e, () =>
                        saveAnswer("needsVoiceAssistant", opt.value)
                      )
                    }
                    onMouseEnter={() => isVoiceActive && speakText(opt.label)}
                    onFocus={() => isVoiceActive && speakText(opt.label)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border: active ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
                      backgroundColor: active ? accentColor : isDark ? "#0f172a" : "#fff",
                      color: active ? "#fff" : textColor,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center",
                      ...fontSizeStyle,
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. Nombre */}
          <section aria-labelledby="q-name">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-name" style={{ margin: 0, ...fontSizeStyle }}>
                ¿Cómo te llamamos?
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta nombre"
                  onClick={() => speakText("¿Cómo te llamamos?")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>
            <input
              aria-label="Nombre de usuario"
              placeholder="Ej. María"
              value={userSettings.name}
              onChange={(e) => saveAnswer("name", e.target.value)}
              onFocus={() => isVoiceActive && speakText(`Nombre, actualmente ${userSettings.name || "vacío"}`)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                color: textColor,
                outline: "none",
                marginTop: "8px",
                ...fontSizeStyle,
              }}
            />
          </section>

          {/* 3. Edad */}
          <section aria-labelledby="q-age">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-age" style={{ margin: 0, ...fontSizeStyle }}>
                Tu rango de edad
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta edad"
                  onClick={() => speakText("Tu rango de edad")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>
            <select
              aria-label="Seleccionar rango de edad"
              value={userSettings.ageRange}
              onChange={(e) => saveAnswer("ageRange", e.target.value)}
              onFocus={() => isVoiceActive && speakText(`Rango de edad seleccionado ${userSettings.ageRange}`)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                color: textColor,
                marginTop: "8px",
                ...fontSizeStyle,
              }}
            >
              <option value="18_30">18 a 30 años</option>
              <option value="31_50">31 a 50 años</option>
              <option value="51_60">51 a 60 años</option>
              <option value="60_plus">Más de 60 años</option>
            </select>
          </section>

          {/* 4. Lectura (texto pequeño) */}
          <section aria-labelledby="q-reading">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-reading" style={{ margin: 0, ...fontSizeStyle }}>
                ¿Te cuesta leer texto pequeño?
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta texto pequeño"
                  onClick={() => speakText("¿Te cuesta leer texto pequeño?")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>

            <div role="group" aria-label="Preferencia de tamaño de letra" style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {[
                { label: "Sí, prefiero letra grande", value: false },
                { label: "No, puedo leer bien", value: true },
              ].map((opt) => {
                const active = userSettings.canReadSmallText === opt.value;
                return (
                  <div
                    key={opt.label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() => saveAnswer("canReadSmallText", opt.value)}
                    onKeyDown={(e) =>
                      handleKeyActivate(e, () => saveAnswer("canReadSmallText", opt.value))
                    }
                    onMouseEnter={() => isVoiceActive && speakText(opt.label)}
                    onFocus={() => isVoiceActive && speakText(opt.label)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border: active ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
                      backgroundColor: active ? accentColor : isDark ? "#0b1220" : "#fff",
                      color: active ? "#fff" : textColor,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center",
                      ...fontSizeStyle,
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Lector de pantalla */}
          <section aria-labelledby="q-screenreader">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-screenreader" style={{ margin: 0, ...fontSizeStyle }}>
                ¿Usas lector de pantalla?
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta lector de pantalla"
                  onClick={() => speakText("¿Usas lector de pantalla?")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>

            <div role="group" aria-label="Usa lector de pantalla" style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {[
                { label: "Sí", value: true },
                { label: "No", value: false },
              ].map((opt) => {
                const active = userSettings.usesScreenReader === opt.value;
                return (
                  <div
                    key={opt.label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() => saveAnswer("usesScreenReader", opt.value)}
                    onKeyDown={(e) => handleKeyActivate(e, () => saveAnswer("usesScreenReader", opt.value))}
                    onMouseEnter={() => isVoiceActive && speakText(opt.label)}
                    onFocus={() => isVoiceActive && speakText(opt.label)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border: active ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
                      backgroundColor: active ? accentColor : isDark ? "#0b1220" : "#fff",
                      color: active ? "#fff" : textColor,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center",
                      ...fontSizeStyle,
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. Confianza usando apps */}
          <section aria-labelledby="q-confidence">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-confidence" style={{ margin: 0, ...fontSizeStyle }}>
                ¿Qué tan cómoda te sientes usando apps?
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta confianza"
                  onClick={() => speakText("¿Qué tan cómoda te sientes usando apps?")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>
            <select
              aria-label="Nivel de confianza usando aplicaciones"
              value={userSettings.confidence}
              onChange={(e) => saveAnswer("confidence", e.target.value)}
              onFocus={() => isVoiceActive && speakText(`Nivel de confianza ${userSettings.confidence}`)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                color: textColor,
                marginTop: "8px",
                ...fontSizeStyle,
              }}
            >
              <option value="low">Me cuesta bastante</option>
              <option value="medium">Más o menos</option>
              <option value="high">Muy cómoda</option>
            </select>
          </section>

          {/* 7. Lectura y escritura (alfabetización digital) */}
          <section aria-labelledby="q-literacy">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-literacy" style={{ margin: 0, ...fontSizeStyle }}>
                ¿Qué tan fácil es para ti leer y escribir mensajes?
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta lectura y escritura"
                  onClick={() => speakText("¿Qué tan fácil es para ti leer y escribir mensajes?")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>
            <select
              aria-label="Nivel de alfabetización/lectura y escritura"
              value={userSettings.literacy}
              onChange={(e) => saveAnswer("literacy", e.target.value)}
              onFocus={() => isVoiceActive && speakText(`Nivel de lectura seleccionado ${userSettings.literacy}`)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0b1220" : "#f9fafb",
                color: textColor,
                marginTop: "8px",
                ...fontSizeStyle,
              }}
            >
              <option value="low">Me cuesta leer o escribir mensajes largos</option>
              <option value="medium">A veces me cuesta</option>
              <option value="high">No tengo problemas</option>
            </select>
          </section>

          {/* 8. Tema (claro / oscuro) */}
          <section aria-labelledby="q-theme">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-theme" style={{ margin: 0, ...fontSizeStyle }}>
                Selecciona tema
              </h2>
              {isVoiceActive && (
                <button
                  aria-label="Reproducir pregunta tema"
                  onClick={() => speakText("Selecciona tema")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: "8px" }} role="group" aria-label="Selector de tema">
              {["light", "dark", "high-contrast"].map((t) => {
                const active = userSettings.theme === t;
                return (
                  <div
                    key={t}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
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
                      padding: "14px 18px",
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
                      fontWeight: 700,
                      cursor: "pointer",
                      ...fontSizeStyle,
                    }}
                  >
                    {t === "light"
                      ? "Claro"
                      : t === "dark"
                        ? "Oscuro"
                        : "Alto Contraste"}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Botones adicionales / incisos extra (si quieres añadir más controles) */}
          {/* Aquí puedes agregar más incisos si los necesitas. */}

          {/* Botón Finalizar */}
          <section style={{ textAlign: "center", marginTop: 12 }}>
            <button
              onClick={() => onFinish(userSettings)}
              onMouseEnter={() => isVoiceActive && speakText("Finalizar")}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                backgroundColor: accentColor,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005EA6")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
              aria-label="Finalizar cuestionario"
            >
              Finalizar
            </button>
          </section>

          {/* Pie */}
          <footer>
            <p style={{ fontSize: "0.75rem", opacity: 0.65, textAlign: "center", marginTop: 8 }}>
              Tu información se usará sólo para personalizar tu experiencia.
            </p>
          </footer>
        </div>
      </div>
    </AppWrapper>
  );
};

WizardView.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default WizardView;
