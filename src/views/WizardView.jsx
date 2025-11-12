import React, { useEffect, useState } from "react";
import { updateAccessibilityProfile } from "../services/profileService.js";
import { getAiAccessibility } from "../services/aiService.js";
import AppWrapper from "../components/AppWrapper";
import { useFormController } from "../controllers/formController";
import { useAuth } from "../context/AuthContext.jsx";

function speakText(text) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "es-MX";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

async function fetchWithRetry(fetchFn, maxRetries = 3, baseDelay = 1500) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fetchFn();
      return result;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

function mapAiThemeToDb(aiTheme, currentTheme) {
  const themeMap = {
    light: "claro",
    dark: "oscuro",
    "high-contrast": "alto_contraste",
    "large-text-high-contrast": "alto_contraste",
    "standard-accessible": "claro",
    "voice-assisted": "claro",
  };

  const normalizedAiTheme = aiTheme?.toLowerCase?.().trim();
  const normalizedCurrent = currentTheme?.toLowerCase?.().trim();

  if (
    normalizedCurrent &&
    !["auto", "default", "ai"].includes(normalizedCurrent)
  ) {
    return themeMap[normalizedCurrent] || normalizedCurrent;
  }

  return themeMap[normalizedAiTheme] || themeMap[normalizedCurrent] || "claro";
}

const WizardView = ({ onFinish, userSettings: initialSettings }) => {
  const { user } = useAuth();
  const { userSettings, updateTheme, saveAnswer } =
    useFormController(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const isVoiceActive = userSettings.needsVoiceAssistant;

  useEffect(() => {
    if (userSettings.needsVoiceAssistant)
      speakText("Bienvenido al cuestionario de accesibilidad");
    else window.speechSynthesis.cancel();
  }, [userSettings.needsVoiceAssistant]);

  const theme = userSettings?.theme;
  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f172a" : "#f3f4f6";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const borderColor = isDark ? "#334155" : "#d1d5db";
  const accentColor = "#0078D4";

  const handleFinish = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    setLoadingMsg("Guardando tu perfil...");

    if (!userSettings.name || userSettings.name.trim() === "") {
      setErrorMsg("Por favor, dinos cómo te llamamos.");
      setIsSubmitting(false);
      setLoadingMsg("");
      return;
    }

    try {
      const aiPayload = {
        user_id: user?.id || "default-user-id",
        can_read_small_text: userSettings.canReadSmallText,
        uses_screen_reader: userSettings.usesScreenReader,
        feels_confident_with_apps: userSettings.confidence,
        age_range: userSettings.ageRange,
        avg_time_per_screen_seconds: 0,
        total_validation_errors: 0,
        requested_help_count: 0,
      };

      const aiResponse = await fetchWithRetry(
        () => getAiAccessibility(aiPayload),
        3,
        1500
      );
      const recommendations = aiResponse.data.recommendation;
      const aiTheme = recommendations.theme;
      const dbTheme = mapAiThemeToDb(aiTheme, userSettings.theme);

      const literacyMap = {
        high: "no_problemas",
        medium: "a_veces_cuesta",
        low: "cuesta",
      };
      const dbLiteracyLevel =
        literacyMap[userSettings.literacy] || "no_problemas";

      const finalPayload = {
        alias: userSettings.name.trim(),
        ageRange: userSettings.ageRange,
        literacyLevel: dbLiteracyLevel,
        theme: dbTheme,
        screenReaderMode: recommendations.screen_reader_mode,
        fontScale: recommendations.font_scale,
        nudgingLevel: recommendations.nudging_level,
        voiceFeedback: recommendations.voice_feedback,
      };

      await updateAccessibilityProfile(finalPayload);

      const uiThemeMap = {
        claro: "light",
        oscuro: "dark",
        alto_contraste: "high-contrast",
      };

      const finalSettings = {
        ...userSettings,
        theme: uiThemeMap[dbTheme] || "light",
        screenReaderMode: recommendations.screen_reader_mode,
        fontScale: recommendations.font_scale,
        nudgingLevel: recommendations.nudging_level,
        voiceFeedback: recommendations.voice_feedback,
      };

      setTimeout(() => onFinish(finalSettings), 1000);
    } catch {
      setErrorMsg("Error al guardar tu perfil. Intenta de nuevo.");
      setIsSubmitting(false);
      setLoadingMsg("");
    }
  };

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
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
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

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
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

            <section>
              <label style={{ fontWeight: 600 }}>
                ¿Te cuesta leer texto pequeño?
              </label>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                {["Sí, me cuesta", "No, puedo leer bien"].map((label, idx) => {
                  const value = idx === 1;
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
                })}
              </div>
            </section>

            <section>
              <label style={{ fontWeight: 600 }}>
                ¿Usas lector de pantalla?
              </label>
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
                <option value="low">
                  Me cuesta leer o escribir mensajes largos
                </option>
                <option value="medium">A veces me cuesta</option>
                <option value="high">No tengo problemas</option>
              </select>
            </section>

            <section>
              <label style={{ fontWeight: 600 }}>
                Vista previa de tema (será ajustado automáticamente)
              </label>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                {["light", "dark"].map((t) => (
                  <div
                    key={t}
                    onClick={() => updateTheme(t)}
                    onMouseEnter={() =>
                      isVoiceActive &&
                      speakText(t === "light" ? "Claro" : "Oscuro")
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
                      backgroundColor: t === "light" ? "#fff" : "#1e293b",
                      color: t === "light" ? "#333" : "#f9fafb",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {t === "light" ? "Claro" : "Oscuro"}
                  </div>
                ))}
              </div>
              <p
                style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "6px" }}
              >
                El tema final será recomendado por nuestro sistema según tus
                respuestas
              </p>
            </section>

            <section
              style={{
                width: "100%",
                textAlign: "center",
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {loadingMsg && !errorMsg && (
                <div
                  style={{
                    border: `1px solid ${accentColor}`,
                    background: isDark ? "#1e3a5f" : "#dbeafe",
                    color: isDark ? "#93c5fd" : "#1e40af",
                    borderRadius: 12,
                    padding: "10px",
                    fontSize: ".9rem",
                  }}
                >
                  {loadingMsg}
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  style={{
                    border: "1px solid #fca5a5",
                    background: "#fef2f2",
                    color: "#991b1b",
                    borderRadius: 12,
                    padding: "10px",
                    fontSize: ".9rem",
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: accentColor,
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: isSubmitting ? "wait" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = isSubmitting
                    ? accentColor
                    : "#005EA6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = accentColor)
                }
              >
                {isSubmitting ? "Guardando..." : "Finalizar"}
              </button>
            </section>
          </div>

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
