import { useState } from 'react';
import { defaultUserSettings } from '../models/userModel';

export const useFormController = () => {
  const [userSettings, setUserSettings] = useState(defaultUserSettings);
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = 5; // por ejemplo

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const updateFont = (font) => setUserSettings(prev => ({ ...prev, font }));
  const updateFontSize = (fontSize) => setUserSettings(prev => ({ ...prev, fontSize }));
  const updateTheme = (theme) => setUserSettings(prev => ({ ...prev, theme }));

  const saveAnswer = (step, answer) => {
    setUserSettings(prev => ({
      ...prev,
      answers: { ...prev.answers, [step]: answer },
    }));
  };

  return {
    userSettings,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    updateFont,
    updateFontSize,
    updateTheme,
    saveAnswer,
  };
};
