import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppWrapper from "../components/AppWrapper";
import { useFormController } from "../controllers/formController";
import logo from "../assets/logo.png";

// 🔊 Voz (SSR-safe)
function speakText(text) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-MX";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { }
}

const WizardView = ({ onFinish }) => {
  const { userSettings: rawSettings = {}, updateTheme, saveAnswer } = useFormController();

  // Defaults
  const userSettings = {
    needsVoiceAssistant: false,
    name: "",
    ageRange: "18_30",
    canReadSmallText: true,
    usesScreenReader: false,
    confidence: "medium",
    literacy: "medium",
    theme: "light", // "light" | "dark" | "high-contrast"
    fontSize: "16px",
    accentColor: undefined,
    ...rawSettings,
  };

  const isVoiceActive = !!userSettings.needsVoiceAssistant;
  const fontSizeStyle = { fontSize: userSettings.fontSize };

  useEffect(() => {
    if (isVoiceActive) speakText("Bienvenido al cuestionario de accesibilidad");
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isVoiceActive]);

  // 🎨 Tokens por tema (3 temas)
  const theme = userSettings.theme;
  const isDark = theme === "dark";
  const isHC = theme === "high-contrast";

  const accentColor = userSettings.accentColor || (isHC ? "#19e6ff" : "#0078D4");

  // Fondo principal y texto
  const bgColor = isHC ? "#0f172a" : isDark ? "#0f172a" : "#f3f4f6";
  const textColor = isHC ? "#ffffff" : isDark ? "#e2e8f0" : "#1e293b";

  // Controles
  const controlBg = isHC ? "#0b1220" : isDark ? "#0b1220" : "#ffffff";
  const controlText = textColor;
  const controlBorderPassive = isHC ? "#19e6ff" : isDark ? "#334155" : "#d1d5db";
  const controlBorderActive = accentColor;

  // Sin card/bordes exteriores (como tu primera imagen)
  const cardBg = "transparent";
  const cardShadow = "none";

  // Estilos reutilizables
  const pillStyle = (active) => ({
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: active
      ? `2px solid ${controlBorderActive}`       // solo borde acento cuando está activo
      : `1px solid ${controlBorderPassive}`,
    backgroundColor: controlBg,                  // nunca relleno con acento
    color: controlText,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    ...fontSizeStyle,
  });

  const fieldStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1px solid ${controlBorderPassive}`,
    backgroundColor: controlBg,
    color: controlText,
    outline: "none",
    marginTop: "8px",
    ...fontSizeStyle,
  };

  const themeTileStyle = (t, active) => ({
    flex: 1,
    padding: "14px 18px",
    borderRadius: "10px",
    border: active ? `2px solid ${controlBorderActive}` : `1px solid ${controlBorderPassive}`,
    backgroundColor:
      t === "light" ? "#ffffff" : t === "dark" ? "#0b1220" : "#000000",
    color: t === "light" ? "#111827" : "#f9fafb",
    textAlign: "center",
    fontWeight: 700,
    cursor: "pointer",
    ...fontSizeStyle,
  });

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
          {/* Logo simple como en la primera imagen */}



          {/* Encabezado */}
          <header style={{ textAlign: "center", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: accentColor }}>
              Cuestionario de Accesibilidad
            </h1>
            <p style={{ fontSize: "0.95rem", opacity: isDark || isHC ? 0.85 : 0.75 }}>
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
                  onClick={() => speakText("¿Necesitas apoyo de un asistente de voz?")}
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: accentColor }}
                >
                  🔊
                </button>
              )}
            </div>

            <div role="group" aria-label="Seleccionar si necesita asistente de voz" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
                    onKeyDown={(e) => handleKeyActivate(e, () => saveAnswer("needsVoiceAssistant", opt.value))}
                    onMouseEnter={() => isVoiceActive && speakText(opt.label)}
                    onFocus={() => isVoiceActive && speakText(opt.label)}
                    style={pillStyle(active)}
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
              <h2 id="q-name" style={{ margin: 0, ...fontSizeStyle }}>¿Cómo te llamamos?</h2>
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
              style={fieldStyle}
            />
          </section>

          {/* 3. Edad */}
          <section aria-labelledby="q-age">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-age" style={{ margin: 0, ...fontSizeStyle }}>Tu rango de edad</h2>
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
              style={fieldStyle}
            >
              <option value="18_30">18 a 30 años</option>
              <option value="31_50">31 a 50 años</option>
              <option value="51_60">51 a 60 años</option>
              <option value="60_plus">Más de 60 años</option>
            </select>
          </section>

          {/* 4. Lectura */}
          <section aria-labelledby="q-reading">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-reading" style={{ margin: 0, ...fontSizeStyle }}>¿Te cuesta leer texto pequeño?</h2>
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
                    onKeyDown={(e) => handleKeyActivate(e, () => saveAnswer("canReadSmallText", opt.value))}
                    onMouseEnter={() => isVoiceActive && speakText(opt.label)}
                    onFocus={() => isVoiceActive && speakText(opt.label)}
                    style={pillStyle(active)}
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
              <h2 id="q-screenreader" style={{ margin: 0, ...fontSizeStyle }}>¿Usas lector de pantalla?</h2>
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
                    style={pillStyle(active)}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. Confianza */}
          <section aria-labelledby="q-confidence">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-confidence" style={{ margin: 0, ...fontSizeStyle }}>¿Qué tan cómoda te sientes usando apps?</h2>
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
              style={fieldStyle}
            >
              <option value="low">Me cuesta bastante</option>
              <option value="medium">Más o menos</option>
              <option value="high">Muy cómoda</option>
            </select>
          </section>

          {/* 7. Alfabetización */}
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
              style={fieldStyle}
            >
              <option value="low">Me cuesta leer o escribir mensajes largos</option>
              <option value="medium">A veces me cuesta</option>
              <option value="high">No tengo problemas</option>
            </select>
          </section>

          {/* 8. Tema */}
          <section aria-labelledby="q-theme">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 id="q-theme" style={{ margin: 0, ...fontSizeStyle }}>Selecciona tema</h2>
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
                const label = t === "light" ? "Claro" : t === "dark" ? "Oscuro" : "Alto Contraste";
                return (
                  <div
                    key={t}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                    onClick={() => updateTheme(t)}
                    onKeyDown={(e) => handleKeyActivate(e, () => updateTheme(t))}
                    onMouseEnter={() => isVoiceActive && speakText(label)}
                    onFocus={() => isVoiceActive && speakText(label)}
                    style={themeTileStyle(t, active)}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Finalizar */}
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
                color: isDark || isHC ? "#00151c" : "#003a63",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "filter 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
              onMouseOut={(e) => (e.currentTarget.style.filter = "none")}
              aria-label="Finalizar cuestionario"
            >
              Finalizar
            </button>
          </section>

          <footer>
            <p style={{ fontSize: "0.75rem", opacity: isDark || isHC ? 0.65 : 0.55, textAlign: "center", marginTop: 8 }}>
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
