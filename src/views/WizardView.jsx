// src/views/WizardView.jsx
import React from 'react';
import StepWrapper from '../components/StepWrapper';
import FontSelector from '../components/FontSelector';
import FontSizeSelector from '../components/FontSizeSelector';
import ProgressBar from '../components/ProgressBar';
import { useFormController } from '../controllers/formController';

const WizardView = ({ onFinish }) => {
  const {
    userSettings,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    updateFont,
    updateFontSize,
    updateTheme,
    saveAnswer,
  } = useFormController();

  const steps = [
    <div key="step1">
      <h2>Paso 1: Personaliza tu fuente</h2>
      <FontSelector userSettings={userSettings} updateFont={updateFont} />
    </div>,

    <div key="step2">
      <h2>Paso 2: Selecciona tamaño de letra</h2>
      <FontSizeSelector userSettings={userSettings} updateFontSize={updateFontSize} />
    </div>,

    <div key="step3">
      <h2>Paso 3: Selecciona tema</h2>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {['light', 'dark'].map((theme) => (
          <div
            key={theme}
            onClick={() => updateTheme(theme)}
            style={{
              padding: '20px',
              cursor: 'pointer',
              borderRadius: '10px',
              border: userSettings.theme === theme ? '2px solid #4caf50' : '1px solid #ccc',
              background: theme === 'light' ? '#fff' : '#333',
              color: theme === 'light' ? '#333' : '#f5f5f5',
              textAlign: 'center',
              flex: 1,
            }}
          >
            {theme === 'light' ? 'Claro' : 'Oscuro'}
          </div>
        ))}
      </div>
    </div>,

    <div key="step4">
      <h2>Paso 4: Pregunta ejemplo</h2>
      <input
        type="text"
        placeholder="Escribe tu respuesta..."
        onChange={(e) => saveAnswer(currentStep, e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      />
    </div>,

    <div key="step5">
      <h2>Paso 5: Revisión</h2>
      <pre>{JSON.stringify(userSettings, null, 2)}</pre>
    </div>,
  ];

  return (
    <StepWrapper userSettings={userSettings}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {steps[currentStep]}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && <button onClick={prevStep}>Anterior</button>}
        {currentStep < totalSteps - 1 ? (
          <button onClick={nextStep}>Siguiente</button>
        ) : (
          <button onClick={() => onFinish(userSettings)}>Finalizar</button>
        )}
      </div>
    </StepWrapper>
  );
};

export default WizardView;
