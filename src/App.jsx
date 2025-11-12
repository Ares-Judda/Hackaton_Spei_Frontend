import React, { useState, useEffect } from "react";
import LoginView from "./views/LoginView";
import WizardView from "./views/WizardView";
import HomeView from "./views/HomeView";
import TransferView from "./views/TransferView";
import ReceiveView from "./views/ReceiveView";
import PayServicesView from "./views/PayServicesView";
import AccountsView from "./views/AccountsView";
import CardsView from "./views/CardsView";
import SignupView from "./views/SignupView";

const App = () => {
  // "login" | "signup" | "wizard" | "home" | "transfer" | "receive" | "pay" | "accounts" | "cards"
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

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) {
      setUserSettings((prev) => ({ ...prev, theme: savedTheme }));
    }
  }, []);

  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings);
    localStorage.setItem("appTheme", finalSettings.theme);
    setHasCompletedWizard(true);
    setCurrentView("home");
  };

  const handleLoginSuccess = () => {
    if (hasCompletedWizard) setCurrentView("home");
    else setCurrentView("wizard");
  };

  return (
    <>
      {currentView === "login" && (
        <LoginView
          userSettings={userSettings}
          onLoginSuccess={handleLoginSuccess}
          onShowQuestionnaire={() => setCurrentView("wizard")}
          hasSeenQuestionnaire={hasCompletedWizard}
          // 👇 NUEVO: botón "Crear cuenta"
          onGoToSignup={() => setCurrentView("signup")}
        />
      )}

      {/* 👇 NUEVO: caso de registro */}
      {currentView === "signup" && (
        <SignupView
          userSettings={userSettings}
          onBackToLogin={() => setCurrentView("login")}
          onSignupSuccess={() => {
            // Puedes llevar a wizard o directo al home
            setCurrentView("wizard"); // o: setCurrentView("home")
          }}
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
          onBack={() => setCurrentView("home")}
        />
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
