import React, { useState } from "react";
import LoginView from "./views/LoginView";
import WizardView from "./views/WizardView";
import HomeView from "./views/HomeView";
import TransferView from "./views/TransferView";
import ReceiveView from "./views/ReceiveView";
import PayServicesView from "./views/PayServicesView";
import AccountsView from "./views/AccountsView";
import CardsView from "./views/CardsView";

const App = () => {
  // "login" | "wizard" | "home" | "transfer" | "receive"
  const [currentView, setCurrentView] = useState("login");

  const [userSettings, setUserSettings] = useState({
    theme: "light",
    font: "Arial",
    fontSize: "16px",
  });

  const [hasSeenQuestionnaireThisSession, setHasSeenQuestionnaireThisSession] = useState(false);

  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings);
    setHasSeenQuestionnaireThisSession(true);
    setCurrentView("login");
  };

  const handleLoginSuccess = () => setCurrentView("home");

  return (
    <>
      {currentView === "login" && (
        <LoginView
          userSettings={userSettings}
          onLoginSuccess={handleLoginSuccess}
          onShowQuestionnaire={() => setCurrentView("wizard")}
          hasSeenQuestionnaire={hasSeenQuestionnaireThisSession}
        />
      )}

      {currentView === "wizard" && (
        <WizardView onFinish={handleFinishWizard} />
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
