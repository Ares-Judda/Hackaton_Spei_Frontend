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
  const [currentView, setCurrentView] = useState("login");

  const [userSettings, setUserSettings] = useState({
    theme: "white",
    font: "Arial",
    fontSize: "16px",
    canReadSmallText: true,
    usesScreenReader: false,
    confidence: "medium",
    literacy: "medium",
    needsVoiceAssistant: false,
    name: "",
    ageRange: "18_30",
  });

  const [hasCompletedWizard, setHasCompletedWizard] = useState(false);

  // ===== Nuevo estado para modo simple =====
  const [simpleMode, setSimpleMode] = useState(false);

  // 🔄 Cargar configuraciones y modo simple desde localStorage al iniciar
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));

    const savedMode = localStorage.getItem("simpleMode");
    if (savedMode) setSimpleMode(JSON.parse(savedMode));
  }, []);

  // Al terminar el Wizard
  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings);
    localStorage.setItem("userSettings", JSON.stringify(finalSettings));
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
          onShowQuestionnaire={() => setCurrentView("wizard")}
          hasSeenQuestionnaire={hasCompletedWizard}
        />
      )}

      {currentView === "wizard" && (
        <WizardView
          userSettings={userSettings}
          setUserSettings={setUserSettings}
          onFinish={handleFinishWizard}
        />
      )}

      {currentView === "home" && (
        <HomeView
          userSettings={userSettings}
          simpleMode={simpleMode}          // 👈 prop
          setSimpleMode={setSimpleMode}    // 👈 prop
          goToTransfer={() => setCurrentView("transfer")}
          goToReceive={() => setCurrentView("receive")}
          goToPay={() => setCurrentView("pay")}
          goToAccouts={() => setCurrentView("accounts")}
          goToCards={() => setCurrentView("cards")}
        />
      )}

      {currentView === "transfer" && (
        <TransferView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "receive" && (
        <ReceiveView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "pay" && (
        <PayServicesView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "accounts" && (
        <AccountsView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "cards" && (
        <CardsView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}
    </>
  );
};

export default App;
