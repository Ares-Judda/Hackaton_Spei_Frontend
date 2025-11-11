import React from "react";

const AccountCard = ({ userSettings, userName, balance, accountNumber }) => {
  const isDark = userSettings.theme === "dark";

  return (
    <div
      style={{
        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
        color: isDark ? "#f5f5f5" : "#0f172a",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "20px",
        fontFamily: `'${userSettings.font}', sans-serif`,
        fontSize: userSettings.fontSize,
        lineHeight: 1.5,
      }}
    >
      <h2>Hola, {userName}</h2>
      <p>Saldo disponible:</p>
      <h3>${balance}</h3>
      <p>Número de cuenta: {accountNumber}</p>
    </div>
  );
};

export default AccountCard;
