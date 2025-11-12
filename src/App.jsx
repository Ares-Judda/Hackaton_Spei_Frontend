import React, { useState, useEffect } from "react";
// Importar v3
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { getAccessibilityProfile } from "./services/profileService.js";

// Vistas v3
import LoginView from "./views/LoginView.jsx";
import SignupView from "./views/SignupView.jsx";
import WizardView from "./views/WizardView.jsx";
import HomeView from "./views/HomeView.jsx";
import TransferView from "./views/TransferView.jsx";
import ReceiveView from "./views/ReceiveView.jsx";
import PayServicesView from "./views/PayServicesView.jsx";
import AccountsView from "./views/AccountsView.jsx";
import CardsView from "./views/CardsView.jsx";

// (Asumo que tienes estos componentes de 'StepWrapper' y 'LoadingView')
// import LoadingView from "./components/LoadingView.jsx";

const App = () => {
  // "login" | "signup" | "wizard" | "home" | ...
  const [currentView, setCurrentView] = useState("login");
  const { token, logout } = useAuth(); // Usar v3

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

  // Esta es la validación que funciona DESPUÉS del login
  const handleLoginSuccess = async () => {
    try {
      const response = await getAccessibilityProfile(); // Llama a v3
      const profile = response.data;

      if (profile.alias) {
        setHasCompletedWizard(true);
        setUserSettings(profile);
        setCurrentView("home");
      } else {
        setHasCompletedWizard(false);
        // Pasamos el perfil vacío (con 'user_id' etc.) al wizard
        setUserSettings(profile);
        setCurrentView("wizard");
      }
    } catch (error) {
      console.error("Error al verificar perfil, enviando a wizard:", error);
      setHasCompletedWizard(false);
      setCurrentView("wizard");
    }
  };

  // Se llama desde SignupView
  const handleSignupSuccess = () => {
    setHasCompletedWizard(false);
    setCurrentView("wizard");
  };

  // Se llama desde WizardView
  const handleFinishWizard = (finalSettings) => {
    // Los 'finalSettings' ahora vienen del wizard,
    // (combinando respuestas manuales + IA)
    setUserSettings(finalSettings);
    localStorage.setItem("appTheme", finalSettings.theme);
    setHasCompletedWizard(true);
    setCurrentView("home");
  };

  // --- Renderizado de Vistas ---
  // (Este switch/case gigante es lo que tenías)

  return (
    <>
      {currentView === "login" && (
        <LoginView
          userSettings={userSettings}
          onLoginSuccess={handleLoginSuccess}
          onShowQuestionnaire={() => setCurrentView("wizard")}
          hasSeenQuestionnaire={hasCompletedWizard}
          onGoToSignup={() => setCurrentView("signup")}
        />
      )}

      {currentView === "signup" && (
        <SignupView
          userSettings={userSettings}
          onBackToLogin={() => setCurrentView("login")}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {currentView === "wizard" && (
        <WizardView
          userSettings={userSettings} // Pasamos los settings (vacíos o con datos)
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

// Necesitas exportar la App envuelta en el Provider
// Este sería tu 'main.jsx' o un wrapper
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

// export default App; // <-- No exportes App directamente
export default AppWrapper; // <-- Exporta el Wrapper
