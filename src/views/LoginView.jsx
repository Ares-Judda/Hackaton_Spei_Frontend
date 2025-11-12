import React, { useState, useEffect } from "react";
import StepWrapper from "../components/StepWrapper";

const LoginView = ({ userSettings, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState(userSettings?.theme || "light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const handleLogin = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f172a" : "#f3f4f6";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const borderColor = isDark ? "#334155" : "#d1d5db";
  const accentColor = "#0078D4";

  return (
    <StepWrapper userSettings={{ ...userSettings, theme }}>
      {/* 🔹 Contenedor principal sin recuadro */}
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
          backgroundColor: "transparent", // 👈 sin card
        }}
      >
        {/* 🔹 Logo */}
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: "bold",
            color: "#fff",
            fontSize: "1.5rem",
            marginBottom: "8px",
          }}
        >
          BI
        </div>

        {/* 🔹 Título */}
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          Banco Inclusivo
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            opacity: 0.8,
            marginBottom: "16px",
            maxWidth: "300px",
          }}
        >
          Inicia sesión para continuar con tu experiencia bancaria segura y
          accesible.
        </p>

        {/* 🔹 Formulario */}
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {/* 📧 Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
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

          {/* 🔒 Contraseña */}
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
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
          </div>

          {/* ✅ Botón */}
          <button
            type="submit"
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
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#005EA6")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = accentColor)}
          >
            Iniciar sesión
          </button>
        </form>

        {/* 🔹 Pie */}
        <p
          style={{
            fontSize: "0.7rem",
            opacity: 0.6,
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          Este es un entorno de demostración. No se guardan datos reales.
        </p>
      </div>
    </StepWrapper>
  );
};

export default LoginView;
