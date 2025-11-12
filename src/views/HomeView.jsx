import React, { useState, useEffect } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCreditCard,
  FaWallet,
  FaMoneyBillWave,
  FaCog,
  FaChartLine,
} from "react-icons/fa";
import logo from "../assets/logo.png";

// 🔊 Función de lectura accesible
function speakText(text, userSettings) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  // Leer si tiene voz activada o lector de pantalla
  if (!userSettings?.needsVoiceAssistant && !userSettings?.usesScreenReader) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch {}
}

const HomeView = ({
  userSettings,
  setSimpleMode,
  simpleMode,
  goToTransfer,
  goToReceive,
  goToPay,
  goToAccouts,
  goToCards,
}) => {
  const theme = userSettings?.theme;
  const isDark = theme === "dark";
  const isHighContrast = theme === "high-contrast";

  const accentColor = isHighContrast ? "#19e6ff" : "#0078D4";
  const bgColor = isHighContrast ? "#0f172a" : isDark ? "#0f172a" : "#f9fafb";
  const textColor = isHighContrast ? "#ffffff" : isDark ? "#f1f5f9" : "#1e293b";
  const buttonBg = isHighContrast ? "#0a0a0a" : accentColor;
  const fontSize = userSettings?.fontSize || "16px";
  const fontFamily = userSettings?.font || "Segoe UI";

  const userName = userSettings?.name || "Usuario";
  const balance = "12,345.67";
  const accountNumber = "1234 5678 9012 3456";

  // Activar modo simple automáticamente si usa lector de pantalla
  useEffect(() => {
    if (userSettings?.usesScreenReader) {
      setSimpleMode(true);
      localStorage.setItem("simpleMode", true);
    }
  }, [userSettings?.usesScreenReader, setSimpleMode]);

  // Leer información principal al cargar la vista
  useEffect(() => {
    speakText(`Bienvenido, ${userName}. Tu saldo disponible es ${balance} pesos.`, userSettings);
  }, [userName, balance, userSettings]);

  // Definición de botones
  const fullActions = [
    {
      icon: <FaArrowDown />,
      label: "Recibir dinero",
      onClick: () => goToReceive(),
    },
    {
      icon: <FaArrowUp />,
      label: "Enviar dinero",
      onClick: () => goToTransfer(),
    },
    {
      icon: <FaWallet />,
      label: "Consultar saldos",
      onClick: () => goToAccouts(),
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Pagar servicios",
      onClick: () => goToPay(),
    },


    {
      icon: <FaCreditCard />,
      label: "Mis Tarjetas",
      onClick: () => goToCards(),
    },
    {
      icon: <FaChartLine />,
      label: "Ahorrar e invertir",
      onClick: () => alert("Ver inversiones"),
    },
    {
      icon: <FaCog />,
      label: "Preferencias",
      onClick: () => goToPreferences(),
    },

  ];

  const simpleActions = [
    {
      icon: <FaArrowDown />,
      label: "Recibir dinero",
      onClick: () => goToReceive(),
    },
    {
      icon: <FaArrowUp />,
      label: "Enviar dinero",
      onClick: () => goToTransfer(),
    },
    {
      icon: <FaWallet />,
      label: "Consultar saldos",
      onClick: () => goToAccouts(),
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Pagar servicios",
      onClick: () => goToPay(),
    },
  ];

  const actions = simpleMode ? simpleActions : fullActions;

  // Cambiar modo simple/completo
  const toggleMode = () => {
    setSimpleMode((prev) => {
      const next = !prev;
      localStorage.setItem("simpleMode", JSON.stringify(next));
      speakText(next ? "Modo simple activado" : "Modo completo activado", userSettings);
      return next;
    });
  };

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "35px 20px",
        fontFamily,
      }}
    >
      {/* Encabezado */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "30px", width: "100%", maxWidth: "500px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <img src={logo} alt="Logo B-accesible" style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", backgroundColor: "white" }} />
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize, fontWeight: "700", marginBottom: "8px", lineHeight: "1.4" }}>
              Hola, <span style={{ color: accentColor }}>{userName}</span>
            </h1>
            <p style={{ fontSize, opacity: 0.75, fontWeight: "500" }}>Te damos la bienvenida a tu banca digital</p>
          </div>
        </div>

        {/* Tarjeta de saldo */}
        <div
          style={{
            background: isHighContrast ? "#0a0a0a" : isDark ? "linear-gradient(135deg, #1e3a8a, #3b82f6)" : "linear-gradient(135deg, #0078D4, #60a5fa)",
            border: isHighContrast ? `2px solid #19e6ff` : "1px solid rgba(0,0,0,0.25)",
            borderRadius: 18,
            padding: "24px 28px",
            color: "#fff",
            boxShadow: isHighContrast ? "none" : "0 6px 25px rgba(0,0,0,0.25)",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p style={{ fontSize, opacity: isHighContrast ? 1 : 0.9, marginBottom: 6, fontWeight: 500, color: isHighContrast ? "#19e6ff" : "#fff" }}>
            Saldo disponible
          </p>
          <h2 style={{ fontSize: `calc(${fontSize} * 2.2)`, fontWeight: 700, margin: 0, color: "#fff" }}>
            ${balance} MXN
          </h2>
          <p style={{ marginTop: 10, fontSize, opacity: isHighContrast ? 1 : 0.85, fontWeight: 500, color: isHighContrast ? "#cccccc" : "#fff" }}>
            Cuenta terminada en {accountNumber.slice(-4)}
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "18px", width: "100%", maxWidth: "500px", marginTop: "10px" }}>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            onFocus={() => speakText(action.label, userSettings)}
            onMouseEnter={() => speakText(action.label, userSettings)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "18px 10px",
              borderRadius: "16px",
              border: "none",
              backgroundColor: buttonBg,
              color: "#fff",
              fontWeight: "600",
              fontSize,
              cursor: "pointer",
              minHeight: "110px",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: `calc(${fontSize} * 1.8)` }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* Botón modo simple/completo */}
      <button
        onClick={toggleMode}
        onFocus={() => speakText(simpleMode ? "Activar modo completo" : "Activar modo simple", userSettings)}
        onMouseEnter={() => speakText(simpleMode ? "Activar modo completo" : "Activar modo simple", userSettings)}
        style={{
          marginTop: "35px",
          padding: "12px 22px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: buttonBg,
          color: "#fff",
          fontWeight: "600",
          fontSize,
          cursor: "pointer",
        }}
      >
        {simpleMode ? "🔓 Modo Completo" : "🔒 Modo Simple"}
      </button>

      {/* Pie de página */}
      <p style={{ fontSize: `calc(${fontSize} * 0.75)`, opacity: 0.6, marginTop: "25px", textAlign: "center" }}>
        © 2025 Banco Inclusivo — Interfaz accesible para todos
      </p>
    </div>
  );
};

export default HomeView;
