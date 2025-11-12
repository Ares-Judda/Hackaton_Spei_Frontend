import React, { useState, useEffect } from "react";
import StepWrapper from "../components/StepWrapper";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const LoginView = ({ userSettings, onLoginSuccess, onGoToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState(userSettings?.theme || "dark");

  const { login, loading } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);

      onLoginSuccess();
    } catch (err) {
      if (err && err.message) {
        setError(err.message);
      } else {
        setError("Error inesperado. Inténtalo de nuevo.");
      }
    }
  };

  const isDark = theme === "dark";
  const bgColor = isDark ? "#0f172a" : "#f3f4f6";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const borderColor = isDark ? "#334155" : "#d1d5db";
  const accentColor = "#0078D4";

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
        {/* 🔹 Logo */}
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

          {/* 👈 4. Mostrar error si existe */}
          {error && (
            <div
              style={{
                color: "#ef4444", // (rojo)
                fontSize: "0.85rem",
                textAlign: "center",
                padding: "8px",
                backgroundColor: isDark
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                borderRadius: "8px",
                border: `1px solid ${isDark ? "#ef4444" : "#f87171"}`,
              }}
            >
              {error}
            </div>
          )}

          {/* ✅ Botón */}
          <button
            type="submit"
            disabled={loading} // 👈 5. Deshabilitar botón mientras carga
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: loading ? "#555" : accentColor, // Cambia color si carga
              color: "white",
              fontWeight: "600",
              cursor: loading ? "wait" : "pointer", // Cambia cursor
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = loading ? "#555" : "#005EA6")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = loading ? "#555" : accentColor)
            }
          >
            {/* 👈 6. Mostrar texto diferente si carga */}
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div style={{ marginTop: 8, fontSize: ".9rem", opacity: .9 }}>
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={onGoToSignup}
            style={{
              background: "none",
              border: "none",
              color: "#0078D4",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Crear cuenta
          </button>
        </div>

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
