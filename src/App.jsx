import React, { useState } from "react";
import LoginView from "./views/LoginView";
import WizardView from "./views/WizardView";
import HomeView from "./views/HomeView";

const App = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [userSettings, setUserSettings] = useState({
    theme: "light",
    font: "Arial",
    fontSize: "16px",
    canReadSmallText: true,
    usesScreenReader: false,
    confidence: "medium",
    literacy: "medium",
    name: "",
    ageRange: "18_30",
  });

  // Saber si el usuario ya terminó la encuesta en esta sesión
  const [hasCompletedWizard, setHasCompletedWizard] = useState(false);

  // Cuando finaliza el Wizard
  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings); // aplicar cambios visuales
    setShowWizard(false); // ocultar Wizard
    setShowHome(true); // mostrar Home
    setHasCompletedWizard(true); // marcar que ya terminó la encuesta
  };

  // Login exitoso
  const handleLoginSuccess = () => {
    // Si ya completó la encuesta alguna vez en esta sesión, vamos directo al Home
    if (hasCompletedWizard) {
      setShowHome(true);
    } else {
      setShowWizard(true); // mostrar Wizard
    }
  };

  return (
    <>
      {!showHome ? (
        !showWizard ? (
          <LoginView
            userSettings={userSettings}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <WizardView onFinish={handleFinishWizard} />
        )
      ) : (
        <HomeView userSettings={userSettings} />
      )}
    </>
  );
};

export default App;
