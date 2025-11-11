import React from "react";
import AccountCard from "../components/AcountCard";
import ActionButton from "../components/ActionButton";
import { FaArrowDown, FaArrowUp, FaCreditCard, FaWallet } from "react-icons/fa";

const HomeView = ({ userSettings }) => {
  const userName = "Juan Pérez";
  const balance = "12,345.67";
  const accountNumber = "1234 5678 9012 3456";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: userSettings.theme === "dark" ? "#020617" : "#f0f0f0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <AccountCard
          userSettings={userSettings}
          userName={userName}
          balance={balance}
          accountNumber={accountNumber}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
          <ActionButton
            icon={<FaArrowDown />}
            label="Recibir"
            userSettings={userSettings}
            onClick={() => alert("Recibir dinero")}
          />
          <ActionButton
            icon={<FaArrowUp />}
            label="Transferir"
            userSettings={userSettings}
            onClick={() => alert("Transferir dinero")}
          />
          <ActionButton
            icon={<FaCreditCard />}
            label="Mis Tarjetas"
            userSettings={userSettings}
            onClick={() => alert("Ver tarjetas")}
          />
          <ActionButton
            icon={<FaWallet />}
            label="Cuentas"
            userSettings={userSettings}
            onClick={() => alert("Ver cuentas")}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
