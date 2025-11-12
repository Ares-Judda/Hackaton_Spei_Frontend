// src/views/WizardView.jsx
import React, { useEffect } from 'react';
import StepWrapper from '../components/StepWrapper';
import FontSelector from '../components/FontSelector';
import FontSizeSelector from '../components/FontSizeSelector';
import ProgressBar from '../components/ProgressBar';
import { useFormController } from '../controllers/formController';

const WizardView = ({ onFinish }) => {
  const {
    userSettings,
    currentStep,
    stepsCount,
    setStepsCount,
    nextStep,
    prevStep,
    updateFont,
    updateFontSize,
    updateTheme,
    saveAnswer,
  } = useFormController();

  // Configuramos el total de pasos según el arreglo de steps
  const steps = [
    <div key="step0">
      <h2>Paso 1: ¿Cómo te llamamos?</h2>
      <input
        type="text"
        placeholder="Ej. María"
        value={userSettings.name}
        onChange={(e) => saveAnswer("name", e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      />
    </div>,

    <div key="step1">
      <h2>Paso 2: Tu rango de edad</h2>
      <select
        value={userSettings.ageRange}
        onChange={(e) => saveAnswer("ageRange", e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      >
        <option value="18_30">18 a 30 años</option>
        <option value="31_50">31 a 50 años</option>
        <option value="51_60">51 a 60 años</option>
        <option value="60_plus">Más de 60 años</option>
      </select>
    </div>,

    <div key="step2">
      <h2>Paso 3: ¿Te cuesta leer texto pequeño?</h2>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={() => saveAnswer("canReadSmallText", false)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: userSettings.canReadSmallText === false ? '2px solid #4caf50' : '1px solid #ccc',
            backgroundColor: userSettings.canReadSmallText === false ? '#0078D4' : '#fff',
            color: userSettings.canReadSmallText === false ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Sí, prefiero letra grande
        </button>
        <button
          onClick={() => saveAnswer("canReadSmallText", true)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: userSettings.canReadSmallText === true ? '2px solid #4caf50' : '1px solid #ccc',
            backgroundColor: userSettings.canReadSmallText === true ? '#0078D4' : '#fff',
            color: userSettings.canReadSmallText === true ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          No, puedo leer bien
        </button>
      </div>
    </div>,

    <div key="step3">
      <h2>Paso 4: ¿Usas lector de pantalla?</h2>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={() => saveAnswer("usesScreenReader", true)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: userSettings.usesScreenReader ? '2px solid #4caf50' : '1px solid #ccc',
            backgroundColor: userSettings.usesScreenReader ? '#0078D4' : '#fff',
            color: userSettings.usesScreenReader ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Sí
        </button>
        <button
          onClick={() => saveAnswer("usesScreenReader", false)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '10px',
            border: !userSettings.usesScreenReader ? '2px solid #4caf50' : '1px solid #ccc',
            backgroundColor: !userSettings.usesScreenReader ? '#0078D4' : '#fff',
            color: !userSettings.usesScreenReader ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          No
        </button>
      </div>
    </div>,

    <div key="step4">
      <h2>Paso 5: ¿Qué tan cómoda te sientes usando apps?</h2>
      <select
        value={userSettings.confidence}
        onChange={(e) => saveAnswer("confidence", e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      >
        <option value="low">Me cuesta bastante</option>
        <option value="medium">Más o menos</option>
        <option value="high">Muy cómoda</option>
      </select>
    </div>,

    <div key="step5">
      <h2>Paso 6: ¿Qué tan fácil es para ti leer y escribir mensajes?</h2>
      <select
        value={userSettings.literacy}
        onChange={(e) => saveAnswer("literacy", e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      >
        <option value="low">Me cuesta leer o escribir mensajes largos</option>
        <option value="medium">A veces me cuesta</option>
        <option value="high">No tengo problemas</option>
      </select>
    </div>,

    <div key="step6">
      <h2>Paso 7: Tema</h2>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {['light', 'dark'].map((theme) => (
          <div
            key={theme}
            onClick={() => updateTheme(theme)}
            style={{
              flex: 1,
              padding: '20px',
              cursor: 'pointer',
              borderRadius: '10px',
              border: userSettings.theme === theme ? '2px solid #4caf50' : '1px solid #ccc',
              backgroundColor: theme === 'light' ? '#fff' : '#333',
              color: theme === 'light' ? '#333' : '#f5f5f5',
              textAlign: 'center',
            }}
          >
            {theme === 'light' ? 'Claro' : 'Oscuro'}
          </div>
        ))}
      </div>
    </div>,
  ];

  useEffect(() => {
    setStepsCount(steps.length);
  }, [steps.length, setStepsCount]);

  return (
    <StepWrapper userSettings={userSettings}>
      <ProgressBar currentStep={currentStep} totalSteps={stepsCount} />
      {steps[currentStep]}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && (
          <button onClick={prevStep} style={{ padding: '10px 20px' }}>
            Anterior
          </button>
        )}
        {currentStep < stepsCount - 1 ? (
          <button onClick={nextStep} style={{ padding: '10px 20px' }}>
            Siguiente
          </button>
        ) : (
          <button onClick={() => onFinish(userSettings)} style={{ padding: '10px 20px' }}>
            Finalizar
          </button>
        )}
      </div>
    </StepWrapper>
  );
};

export default WizardView;
