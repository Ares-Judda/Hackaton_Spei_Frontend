import { useState } from "react";

export const useFormController = () => {
  const [userSettings, setUserSettings] = useState({
    font: "Segoe UI",
    theme: "light",
    fontSize: "16px",
    canReadSmallText: true,
    usesScreenReader: false,
    confidence: "medium",
    literacy: "medium",
    name: "",
    ageRange: "18_30",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCount, setStepsCount] = useState(7); // <-- ahora es state

  const nextStep = () => {
    if (currentStep < stepsCount - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const saveAnswer = (field, value) => {
    setUserSettings((prev) => {
      const updated = { ...prev, [field]: value };

      // Tamaño de letra
      if (field === "canReadSmallText") {
        updated.fontSize = value ? "16px" : "20px";
      }

      // Modo simple según confianza o literacy
      if (field === "confidence" || field === "literacy") {
        updated.simpleMode =
          updated.confidence === "low" || updated.literacy === "low";
      }

      return updated;
    });
  };

  const updateFont = (font) => setUserSettings((prev) => ({ ...prev, font }));
  const updateTheme = (theme) => setUserSettings((prev) => ({ ...prev, theme }));

  return {
    userSettings,
    currentStep,
    stepsCount,
    setStepsCount, // <-- expuesto para WizardView
    nextStep,
    prevStep,
    saveAnswer,
    updateFont,
    updateTheme,
  };
};
