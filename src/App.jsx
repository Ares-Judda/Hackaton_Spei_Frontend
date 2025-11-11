import React, { useState } from 'react';
import LoginView from './views/LoginView';
import WizardView from './views/WizardView';

const App = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [hasSeenQuestionnaire, setHasSeenQuestionnaire] = useState(false);
  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    font: 'Segoe UI',
    fontSize: '16px',
  });

  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings);
    setShowWizard(false);
  };

  return (
    <div className="phone-frame">
      {!showWizard ? (
        <LoginView
          userSettings={userSettings}
          onLoginSuccess={() => console.log('Login exitoso')}
          onShowQuestionnaire={() => {
            setShowWizard(true);
            setHasSeenQuestionnaire(true);
          }}
          hasSeenQuestionnaire={hasSeenQuestionnaire}
        />
      ) : (
        <WizardView onFinish={handleFinishWizard} />
      )}
    </div>
  );
};

export default App;
