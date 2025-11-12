import React, { useState } from "react";
import AppWrapper from "../components/AppWrapper";
import { useNavigate } from "react-router-dom";
import AccountCard from "../components/AcountCard";
import {
  FaArrowDown,
  FaArrowUp,
  FaCreditCard,
  FaWallet,
  FaMoneyBillWave,
  FaHistory,
  FaCog,
  FaChartLine,
  FaExchangeAlt,
} from "react-icons/fa";

const HomeView = ({ userSettings, goToTransfer, goToReceive, goToPay, goToAccouts, goToCards  }) => {
  
  const [simpleMode, setSimpleMode] = useState(false);

  const isDark = userSettings.theme === "dark";
  const accentColor = "#0078D4";
  const bgColor = isDark ? "#0f172a" : "#f9fafb";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const buttonBg = accentColor;
  const buttonHover = "#005EA6";
  
  const userName = "Juan Pérez";
  const balance = "12,345.67";
  const accountNumber = "1234 5678 9012 3456";

  const fullActions = [
    {
      icon: <FaArrowDown />,
      label: "Recibir",
      onClick: () => goToReceive(),
    },
    {
      icon: <FaArrowUp />,
      label: "Transferir",
      onClick: () => goToTransfer() ,
    },
    {
      icon: <FaWallet />,
      label: "Saldo / Cuentas",
      onClick: () => goToAccouts(),
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Pago de servicios",
      onClick: () => goToPay(),
    },
    
    
    {
      icon: <FaCreditCard />,
      label: "Mis Tarjetas",
      onClick: () => goToCards(),
    },
    {
      icon: <FaChartLine />,
      label: "Inversiones",
      onClick: () => alert("Ver inversiones"),
    },
    {
      icon: <FaCog />,
      label: "Ajustes",
      onClick: () => alert("Configurar cuenta"),
    },
    
  ];

  const simpleActions = [
    {
      icon: <FaArrowDown />,
      label: "Recibir",
      onClick: () => goToReceive(),
    },
    {
      icon: <FaArrowUp />,
      label: "Transferir",
      onClick: () => goToTransfer(),
    },
    {
      icon: <FaWallet />,
      label: "Saldo / Cuentas",
      onClick: () => goToAccouts(),
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Pago de servicios",
      onClick: () => goToPay(),
    },
  ];

  const actions = simpleMode ? simpleActions : fullActions;

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 20px",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* 🔹 Header profesional */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
            opacity: 0.8,
            marginBottom: "6px",
          }}
        >
          Hola, <span style={{ fontWeight: "600" }}>{userName}</span>
        </h2>

        <div
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1e3a8a, #3b82f6)"
              : "linear-gradient(135deg, #0078D4, #60a5fa)",
            borderRadius: "18px",
            padding: "24px 28px",
            color: "#fff",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            transition: "transform 0.3s ease",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              opacity: 0.9,
              marginBottom: "6px",
            }}
          >
            Saldo disponible
          </p>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: "700",
              margin: "0",
              letterSpacing: "0.5px",
            }}
          >
            ${balance} MXN
          </h1>
          <p
            style={{
              marginTop: "10px",
              fontSize: "0.85rem",
              opacity: 0.8,
            }}
          >
            Cuenta terminada en {accountNumber.slice(-4)}
          </p>
        </div>
      </div>

      {/* 🔹 Acciones */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "18px",
          width: "100%",
          maxWidth: "500px",
          marginTop: "25px",
        }}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 10px",
              borderRadius: "16px",
              border: "none",
              backgroundColor: buttonBg,
              color: "#fff",
              fontWeight: "600",
              fontSize: userSettings.fontSize,
              cursor: "pointer",
              minHeight: "110px",
              gap: "10px",
              transition: "background-color 0.3s ease, transform 0.1s ease",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHover)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonBg)}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "1.8em" }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* 🔹 Botón modo simple */}
      <button
        onClick={() => setSimpleMode(!simpleMode)}
        style={{
          marginTop: "35px",
          padding: "12px 22px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: buttonBg,
          color: "#fff",
          fontWeight: "600",
          fontSize: userSettings.fontSize,
          cursor: "pointer",
          transition: "0.3s",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHover)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonBg)}
      >
        {simpleMode ? "🔓 Modo Completo" : "🔒 Modo Simple"}
      </button>

      {/* 🔹 Pie */}
      <p
        style={{
          fontSize: "0.75rem",
          opacity: 0.6,
          marginTop: "25px",
          textAlign: "center",
        }}
      >
        © 2025 Banco Inclusivo — Interfaz accesible para todos
      </p>
    </div>
  );
};

export default HomeView;
