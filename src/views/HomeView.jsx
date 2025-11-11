import React, { useState } from "react";
import AccountCard from "../components/AcountCard";
import ActionButton from "../components/ActionButton";
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

const HomeView = ({ userSettings }) => {
  const [simpleMode, setSimpleMode] = useState(false);

  const userName = "Juan Pérez";
  const balance = "12,345.67";
  const accountNumber = "1234 5678 9012 3456";

  const fullActions = [
    {
      icon: <FaArrowDown />,
      label: "Recibir",
      onClick: () => alert("Recibir dinero"),
    },
    {
      icon: <FaArrowUp />,
      label: "Transferir",
      onClick: () => alert("Transferir dinero"),
    },
    {
      icon: <FaCreditCard />,
      label: "Mis Tarjetas",
      onClick: () => alert("Ver tarjetas"),
    },
    {
      icon: <FaWallet />,
      label: "Cuentas",
      onClick: () => alert("Ver cuentas"),
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Pagos",
      onClick: () => alert("Realizar pagos"),
    },
    {
      icon: <FaHistory />,
      label: "Historial",
      onClick: () => alert("Ver historial"),
    },
    {
      icon: <FaCog />,
      label: "Ajustes",
      onClick: () => alert("Configurar cuenta"),
    },
    {
      icon: <FaChartLine />,
      label: "Inversiones",
      onClick: () => alert("Ver inversiones"),
    },
    {
      icon: <FaExchangeAlt />,
      label: "Cambio de divisas",
      onClick: () => alert("Cambio de divisas"),
    },
  ];

  const simpleActions = [
    {
      icon: <FaArrowDown />,
      label: "Recibir",
      onClick: () => alert("Recibir dinero"),
    },
    {
      icon: <FaArrowUp />,
      label: "Transferir",
      onClick: () => alert("Transferir dinero"),
    },
    {
      icon: <FaWallet />,
      label: "Saldo / Cuentas",
      onClick: () => alert("Ver saldo y cuentas"),
    },
  ];

  const actions = simpleMode ? simpleActions : fullActions;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: userSettings.theme === "dark" ? "#020617" : "#f0f0f0",
        fontFamily: userSettings.font,
        fontSize: userSettings.fontSize,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        {/* Tarjeta de usuario */}
        <AccountCard
          userSettings={userSettings}
          userName={userName}
          balance={balance}
          accountNumber={accountNumber}
        />

        {/* Grid de acciones */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "15px",
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
                padding: "15px",
                borderRadius: "15px",
                border: "none",
                backgroundColor: "#0078D4",
                color: "#fff",
                fontWeight: "bold",
                fontSize: userSettings.fontSize,
                cursor: "pointer",
                minHeight: "100px",
                gap: "10px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "1.8em" }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        {/* Botón modo simple/completo */}
        <button
          onClick={() => setSimpleMode(!simpleMode)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#0078D4",
            color: "#fff",
            fontWeight: "bold",
            fontSize: userSettings.fontSize,
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          {simpleMode ? "Modo Completo" : "Modo Simple"}
        </button>
      </div>
    </div>
  );
};

export default HomeView;
