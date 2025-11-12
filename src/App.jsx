import React, { useState, useEffect } from "react";
import LoginView from "./views/LoginView";
import WizardView from "./views/WizardView";
import HomeView from "./views/HomeView";

const App = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [hasCompletedWizard, setHasCompletedWizard] = useState(false);

  const [userSettings, setUserSettings] = useState({
    theme: "white", // valor por defecto
    font: "Arial",
    fontSize: "16px",
    canReadSmallText: true,
    usesScreenReader: false,
    confidence: "medium",
    literacy: "medium",
    name: "",
    ageRange: "18_30",
  });

  // 🔹 Cargar tema guardado desde localStorage al inicio
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) {
      setUserSettings((prev) => ({ ...prev, theme: savedTheme }));
    }
  }, []);

  // 🔹 Cuando se cambien las preferencias en Wizard
  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings);
    localStorage.setItem("appTheme", finalSettings.theme); // 💾 guardar tema
    setShowWizard(false);
    setShowHome(true);
    setHasCompletedWizard(true);
  };

  const handleLoginSuccess = () => {
    if (hasCompletedWizard) setShowHome(true);
    else setShowWizard(true);
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
          <WizardView
            userSettings={userSettings}
            onFinish={handleFinishWizard}
          />
        )
      ) : (
        <HomeView userSettings={userSettings} />
      )}
    </>
  );
};

export default App;
