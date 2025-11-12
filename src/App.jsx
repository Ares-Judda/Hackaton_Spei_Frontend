import React, { useState, useEffect } from "react";
import LoginView from "./views/LoginView";
import WizardView from "./views/WizardView";
import HomeView from "./views/HomeView";
import TransferView from "./views/TransferView";
import ReceiveView from "./views/ReceiveView";
import PayServicesView from "./views/PayServicesView";
import AccountsView from "./views/AccountsView";
import CardsView from "./views/CardsView";

const App = () => {
  // "login" | "wizard" | "home" | "transfer" | "receive" | "pay" | "accounts" | "cards"
  const [currentView, setCurrentView] = useState("login");

  const [userSettings, setUserSettings] = useState({
    theme: "white",
    font: "Arial",
    fontSize: "16px",
    canReadSmallText: true,
    usesScreenReader: false,
    confidence: "medium",
    literacy: "medium",
    name: "",
    ageRange: "18_30",
  });

  const [hasCompletedWizard, setHasCompletedWizard] = useState(false);

  // Cargar tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) {
      setUserSettings((prev) => ({ ...prev, theme: savedTheme }));
    }
  }, []);

  // Al terminar el Wizard
  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings);
    localStorage.setItem("appTheme", finalSettings.theme);
    setHasCompletedWizard(true);
    setCurrentView("home");
  };

  // Al iniciar sesión
  const handleLoginSuccess = () => {
    if (hasCompletedWizard) {
      setCurrentView("home");
    } else {
      setCurrentView("wizard");
    }
  };

  return (
    <>
      {currentView === "login" && (
        <LoginView
          userSettings={userSettings}
          onLoginSuccess={handleLoginSuccess}
          // si quieres forzar mostrar el cuestionario desde login:
          onShowQuestionnaire={() => setCurrentView("wizard")}
          hasSeenQuestionnaire={hasCompletedWizard}
        />
      )}

      {currentView === "wizard" && (
        <WizardView
          userSettings={userSettings}
          onFinish={handleFinishWizard}
        />
      )}

      {currentView === "home" && (
        <HomeView
          userSettings={userSettings}
          goToTransfer={() => setCurrentView("transfer")}
          goToReceive={() => setCurrentView("receive")}
          goToPay={() => setCurrentView("pay")}
          goToAccouts={() => setCurrentView("accounts")}
          goToCards={() => setCurrentView("cards")}
        />
      )}

      {currentView === "transfer" && (
        <TransferView
          userSettings={userSettings}
          onBack={() => setCurrentView("home")} />
      )}

      {currentView === "receive" && (
        <ReceiveView
          userSettings={userSettings}
          onBack={() => setCurrentView("home")}
        />
      )}

      {currentView === "pay" && (
        <PayServicesView
          userSettings={userSettings}
          onBack={() => setCurrentView("home")}
        />
      )}

      {currentView === "accounts" && (
        <AccountsView
          userSettings={userSettings}
          onBack={() => setCurrentView("home")}
        />
      )}

      {currentView === "cards" && (
        <CardsView
          userSettings={userSettings}
          onBack={() => setCurrentView("home")}
        />
      )}
    </>
  );
};

export default App;
