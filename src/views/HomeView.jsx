import React from "react";
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

const HomeView = ({
  userSettings,
  goToTransfer,
  goToReceive,
  goToPay,
  goToAccouts,
  goToCards,
  simpleMode,
  setSimpleMode
}) => {
  const isDark = userSettings.theme === "dark";
  const accentColor = "#0078D4";
  const bgColor = isDark ? "#0f172a" : "#f9fafb";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const buttonBg = accentColor;
  const buttonHover = "#005EA6";
  const fontSize = userSettings.fontSize || "16px";
  const fontFamily = userSettings.font || "Segoe UI";

  const userName = "Juan Pérez";
  const balance = "12,345.67";
  const accountNumber = "1234 5678 9012 3456";

  // Acciones completas
  const fullActions = [
    { icon: <FaArrowDown />, label: "Recibir", onClick: goToReceive },
    { icon: <FaArrowUp />, label: "Transferir", onClick: goToTransfer },
    { icon: <FaWallet />, label: "Saldo / Cuentas", onClick: goToAccouts },
    { icon: <FaMoneyBillWave />, label: "Pago de servicios", onClick: goToPay },
    { icon: <FaCreditCard />, label: "Mis Tarjetas", onClick: goToCards },
    { icon: <FaChartLine />, label: "Inversiones", onClick: () => alert("Ver inversiones") },
    { icon: <FaCog />, label: "Ajustes", onClick: () => alert("Configurar cuenta") },
  ];

  // Acciones simplificadas
  const simpleActions = fullActions.slice(0, 4);
  const actions = simpleMode ? simpleActions : fullActions;

  // Función para cambiar modo y guardar en localStorage
  const toggleMode = () => {
    setSimpleMode(prev => {
      localStorage.setItem("simpleMode", JSON.stringify(!prev));
      return !prev;
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
        transition: "all 0.3s ease",
        fontFamily,
      }}
    >
      {/* Encabezado con logo a la izquierda y tarjeta debajo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "30px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {/* Logo + texto de bienvenida */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px", // espacio entre logo y texto
            marginBottom: "20px",
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            alt="Logo B-accesible"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              backgroundColor: "white", // opcional
            }}
          />

          {/* Texto de bienvenida */}
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize, fontWeight: "700", marginBottom: "8px", lineHeight: "1.4" }}>
              Hola, <span style={{ color: accentColor }}>{userName}</span>
            </h1>
            <p style={{ fontSize, opacity: 0.75, fontWeight: "500" }}>
              Te damos la bienvenida a tu banca digital
            </p>
          </div>
        </div>

        {/* Tarjeta de saldo debajo */}
        <div
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1e3a8a, #3b82f6)"
              : "linear-gradient(135deg, #0078D4, #60a5fa)",
            borderRadius: "18px",
            padding: "24px 28px",
            color: "#fff",
            boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
            textAlign: "center",
            transition: "transform 0.3s ease",
            width: "100%",
          }}
        >
          <p style={{ fontSize, opacity: 0.9, marginBottom: "6px", fontWeight: "500" }}>
            Saldo disponible
          </p>
          <h2 style={{ fontSize: `calc(${fontSize} * 2.2)`, fontWeight: "700", margin: 0, letterSpacing: "0.5px" }}>
            ${balance} MXN
          </h2>
          <p style={{ marginTop: "10px", fontSize, opacity: 0.85, fontWeight: "500" }}>
            Cuenta terminada en {accountNumber.slice(-4)}
          </p>
        </div>
      </div>


      {/* Botones de acción */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "18px",
          width: "100%",
          maxWidth: "500px",
          marginTop: "10px",
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
              transition: "background-color 0.3s ease, transform 0.1s ease",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHover)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonBg)}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: `calc(${fontSize} * 1.8)` }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* Botón modo simple */}
      <button
        onClick={toggleMode}
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
          transition: "0.3s",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHover)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonBg)}
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
