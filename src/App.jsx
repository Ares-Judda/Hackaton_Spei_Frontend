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
  });

  // Estado temporal en memoria para saber si ya se contestó la encuesta durante esta sesión
  const [hasSeenQuestionnaireThisSession, setHasSeenQuestionnaireThisSession] = useState(false);

  // Cuando finaliza el Wizard
  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings); // aplica cambios visuales
    setShowWizard(false); // vuelve al login
    setHasSeenQuestionnaireThisSession(true); // ya no mostrar popup hasta reiniciar app
  };

  // Login exitoso
  const handleLoginSuccess = () => {
    setShowHome(true); // pasa al Home
  };

  return (
    <>
      {!showHome ? (
        !showWizard ? (
          <LoginView
            userSettings={userSettings}
            onLoginSuccess={handleLoginSuccess}
            onShowQuestionnaire={() => setShowWizard(true)}
            hasSeenQuestionnaire={hasSeenQuestionnaireThisSession}
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
