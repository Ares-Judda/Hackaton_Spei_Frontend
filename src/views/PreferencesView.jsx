import React, { useMemo, useState } from "react";
import logo from "../assets/logo.png";
import {
  FaChevronRight,
  FaUniversalAccess,
  FaBell,
  FaShieldAlt,
  FaGlobe,
  FaFont,
  FaMoon,
  FaSun,
  FaAdjust,
} from "react-icons/fa";

/**
 * Props esperadas:
 * - userSettings: { theme, fontSize, needsVoiceAssistant, language, ... }
 * - GoTo?: (route: string) => void   // navegación
 * - onBack?: () => void              // volver
 * - onChangeSettings?: (partial: object) => void // persiste cambios hacia arriba (opcional)
 */
export default function PreferencesView({
  userSettings,
  GoTo,
  onBack,
  onChangeSettings,
}) {
  // ===== Estado local editable =====
  const [prefs, setPrefs] = useState(() => ({
    theme: userSettings?.theme || "light",
    fontSize: userSettings?.fontSize || "16px",
    needsVoiceAssistant: !!userSettings?.needsVoiceAssistant,
    language: userSettings?.language || "es-MX",
    pushReminders: true,
    pushFraudAlerts: true,
    monthlyDigest: false,
  }));
  const [toast, setToast] = useState(null); // {type,msg}

  const setP = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));

  // ===== Tokens de tema (coherentes con Accounts/Transfer) =====
  const theme = prefs.theme;
  const isDark = theme === "dark";
  const isHC = theme === "high-contrast";

  const accentColor = isHC ? "#19e6ff" : "#0078D4";
  const buttonHover = isHC ? "#19e6ff" : "#005EA6";
  const bgColor = isHC ? "#0f172a" : isDark ? "#0f172a" : "#f9fafb";
  const textColor = isHC ? "#ffffff" : isDark ? "#e2e8f0" : "#1e293b";
  const cardColor = isHC ? "#0a0a0a" : isDark ? "#111827" : "#ffffff";
  const inputBg = isHC ? "#111111" : isDark ? "#0b1220" : "#ffffff";
  const borderColor = isHC ? "#19e6ff" : isDark ? "#293548" : "#d1d5db";
  const subtleText = isHC ? "#cccccc" : isDark ? "#94a3b8" : "#6b7280";

  const fontSizeBase = prefs.fontSize || "0.95rem";
  const fontFamily =
    userSettings?.font || "system-ui, -apple-system, Segoe UI, Roboto, Arial";

  // ===== Estilos reutilizables =====
  const container = {
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "30px 20px",
    backgroundColor: bgColor,
    color: textColor,
    transition: "background-color 0.3s ease, color 0.3s ease",
    fontFamily,
  };
  const shell = {
    width: "100%",
    maxWidth: "520px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  };
  const fieldCard = {
    background: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 18,
    padding: 16,
    boxShadow: isDark
      ? "0 4px 10px rgba(0,0,0,0.25)"
      : "0 4px 10px rgba(0,0,0,0.08)",
  };
  const h1 = { fontSize: "1.4rem", fontWeight: 700, margin: 0, textAlign: "center" };
  const small = { fontSize: "0.9rem", color: subtleText };

  const ghostBtn = {
    border: `1px solid ${borderColor}`,
    borderRadius: 12,
    background: cardColor,
    color: textColor,
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: fontSizeBase,
    transition: "background-color 0.3s ease, transform 0.1s ease",
  };
  const primaryBtn = {
    border: "none",
    borderRadius: 16,
    backgroundColor: accentColor,
    color: "#fff",
    fontWeight: 700,
    padding: "12px 18px",
    minHeight: 44,
    cursor: "pointer",
    fontSize: fontSizeBase,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease, transform 0.1s ease",
  };
  const selectStyle = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${borderColor}`,
    background: inputBg,
    color: textColor,
    fontSize: fontSizeBase,
    outline: "none",
  };
  const switchWrap = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${borderColor}`,
    background: inputBg,
  };
  const chip = (active) => ({
    padding: "10px 12px",
    borderRadius: 14,
    border: active ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
    background: active ? (isDark ? "#0b1220" : "#f0f8ff") : cardColor,
    cursor: "pointer",
    flex: 1,
    display: "grid",
    placeItems: "center",
    gap: 6,
    color: textColor,
    transition: "border-color 0.2s ease, transform 0.1s ease",
    minHeight: 44,
  });
  const rowNav = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${borderColor}`,
    background: inputBg,
    cursor: "pointer",
  };
  const toastBox = (type) => ({
    borderRadius: 12,
    padding: 10,
    fontSize: "0.95rem",
    border:
      type === "success" ? "1px solid #86efac" :
      type === "error" ? "1px solid #fca5a5" :
      `1px solid ${borderColor}`,
    background:
      type === "success" ? (isDark ? "#052e1b" : "#f0fdf4") :
      type === "error" ? (isDark ? "#3a0d0d" : "#fef2f2") :
      (isDark ? "#0b1220" : "#eff6ff"),
    color: textColor,
  });

  // Interacciones
  const onHoverIn = (e) => (e.currentTarget.style.backgroundColor = buttonHover);
  const onHoverOut = (e) => (e.currentTarget.style.backgroundColor = accentColor);
  const onPressIn = (e) => (e.currentTarget.style.transform = "scale(0.98)");
  const onPressOut = (e) => (e.currentTarget.style.transform = "scale(1)");

  // Guardar cambios (opcionalmente sube a padre)
  const savePrefs = () => {
    onChangeSettings?.(prefs);
    setToast({ type: "success", msg: "Preferencias guardadas." });
    setTimeout(() => setToast(null), 1500);
  };

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        {/* Header simple con volver + logo */}
        <div style={{ position: "relative", marginBottom: 18 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{ ...ghostBtn, position: "absolute", top: 0, left: 0 }}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
              aria-label="Volver"
            >
              ← Volver
            </button>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              src={logo}
              alt="Logo Banco Inclusivo"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "white",
              }}
            />
            <p style={{ margin: 0 }}>B-Accesible</p>
          </div>
        </div>

        <h1 style={h1}>Preferencias</h1>
        

        

        {/* Accesibilidad */}
        <div style={fieldCard}>
          <div style={{ fontWeight: 700, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <FaUniversalAccess /> Accesibilidad
          </div>

          {/* Configurar perfil de accesibilidad */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => (GoTo ? GoTo("accessibility-profile") : null)}
            style={rowNav}
            aria-label="Configurar perfil de accesibilidad"
          >
            <div>
              <div style={{ fontWeight: 700 }}>Configurar perfil de accesibilidad</div>
              <div style={small}>
                Ajusta voz, lectura, tamaño de texto y tema guiado.
              </div>
            </div>
            <FaChevronRight />
          </div>

          {/* Asistente de voz (toggle) */}
          
        </div>

        {/* Notificaciones */}
        <div style={fieldCard}>
          <div style={{ fontWeight: 700, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <FaBell /> Notificaciones
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={switchWrap}>
              <span>Recordatorios y avisos</span>
              <input
                type="checkbox"
                checked={prefs.pushReminders}
                onChange={(e) => setP("pushReminders", e.target.checked)}
                aria-label="Recordatorios"
              />
            </div>
            <div style={switchWrap}>
              <span>Alertas de posible fraude</span>
              <input
                type="checkbox"
                checked={prefs.pushFraudAlerts}
                onChange={(e) => setP("pushFraudAlerts", e.target.checked)}
                aria-label="Alertas de fraude"
              />
            </div>
            <div style={switchWrap}>
              <span>Resumen mensual</span>
              <input
                type="checkbox"
                checked={prefs.monthlyDigest}
                onChange={(e) => setP("monthlyDigest", e.target.checked)}
                aria-label="Resumen mensual"
              />
            </div>
          </div>
        </div>

        {/* Idioma & Seguridad */}
        <div style={fieldCard}>
          <div style={{ fontWeight: 700, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <FaGlobe /> Idioma
          </div>
          <select
            value={prefs.language}
            onChange={(e) => setP("language", e.target.value)}
            style={selectStyle}
          >
            <option value="es-MX">Español (México)</option>
            <option value="es-ES">Español (España)</option>
            <option value="en-US">English (US)</option>
          </select>

          <div style={{ height: 12 }} />

          <div style={{ fontWeight: 700, marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
            <FaShieldAlt /> Seguridad
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => GoTo && GoTo("trusted-devices")}
              style={rowNav}
              aria-label="Dispositivos de confianza"
            >
              <span>Dispositivos de confianza</span>
              <FaChevronRight />
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => GoTo && GoTo("change-pin")}
              style={rowNav}
              aria-label="Cambiar NIP"
            >
              <span>Cambiar NIP</span>
              <FaChevronRight />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={ghostBtn}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
            >
              Cancelar
            </button>
          )}
          <button
            onClick={savePrefs}
            style={primaryBtn}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            onMouseDown={onPressIn}
            onMouseUp={onPressOut}
          >
            Guardar cambios
          </button>
        </div>

        {/* Toast */}
        {toast && <div style={toastBox(toast.type)}>{toast.msg}</div>}
      </div>
    </div>
  );
}
