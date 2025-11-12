
// src/views/SignupView.jsx
import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import StepWrapper from "../components/StepWrapper";

const SignupView = ({ userSettings, onBackToLogin, onSignupSuccess }) => {
  const [theme, setTheme] = useState(userSettings?.theme || "dark");

  // Campos del formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("appTheme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const isDark = theme === "dark";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const borderColor = isDark ? "#334155" : "#d1d5db";
  const accentColor = "#0078D4";

  const validate = () => {
    if (!fullName.trim()) { setErrorMsg("Escribe tu nombre completo."); return false; }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setErrorMsg("Correo electrónico inválido."); return false; }
    if (password.length < 8) { setErrorMsg("La contraseña debe tener al menos 8 caracteres."); return false; }
    if (password !== confirm) { setErrorMsg("Las contraseñas no coinciden."); return false; }
    if (!accept) { setErrorMsg("Debes aceptar los términos y condiciones."); return false; }
    setErrorMsg("");
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // 👇 Aquí iría tu llamada real al backend
      // await api.signup({ fullName, email, password });

      // Simulación de éxito
      await new Promise((r) => setTimeout(r, 900));
      onSignupSuccess?.(); // te lleva a Wizard o Home según App.jsx
    } catch (err) {
      setErrorMsg(err?.message || "No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepWrapper userSettings={{ ...userSettings, theme }}>
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          color: textColor,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          padding: "32px 28px",
          backgroundColor: "transparent",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
            backgroundColor: "#ffffff", // opcional
          }}
        >
          <img
            src={logo}
            alt="Logo B-accesible"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* 🔹 Título */}
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          B-Accesible
        </h1>

        {/* Título */}
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "4px" }}>
          Crear cuenta
        </h1>
        <p style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "16px", maxWidth: "300px" }}>
          Abre tu cuenta para comenzar a usar Banco Inclusivo.
        </p>

        {/* Formulario */}
        <form
          onSubmit={handleSignup}
          style={{
            width: "100%",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {/* Nombre */}
          <div>
            <label
              htmlFor="fullName"
              style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Ej. Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0f172a" : "#f9fafb",
                color: textColor,
                outline: "none",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0f172a" : "#f9fafb",
                color: textColor,
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0f172a" : "#f9fafb",
                color: textColor,
                outline: "none",
              }}
            />
            <div style={{ fontSize: ".75rem", opacity: .7, marginTop: 4 }}>
              Mínimo 8 caracteres.
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label
              htmlFor="confirm"
              style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Repite la contraseña
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0f172a" : "#f9fafb",
                color: textColor,
                outline: "none",
              }}
            />
          </div>

          {/* Términos */}
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: ".85rem" }}>
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
            />
            Acepto los términos y condiciones.
          </label>

          {/* Error */}
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

          {/* Botones */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: accentColor,
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: submitting ? 0.8 : 1,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#005EA6")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = accentColor)}
          >
            {submitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              backgroundColor: "transparent",
              color: textColor,
              cursor: "pointer",
            }}
          >
            ← Volver a iniciar sesión
          </button>
        </form>

        {/* Pie */}
        <p style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: "12px", textAlign: "center" }}>
          Este es un entorno de demostración. No se guardan datos reales.
        </p>
      </div>
    </StepWrapper>
  );
};

export default SignupView;
