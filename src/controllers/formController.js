import { useState, useEffect } from "react";

export const useFormController = () => {
  const [userSettings, setUserSettings] = useState(() => {
    // 🔁 Recuperar tema guardado si existe
    const savedTheme =
      typeof window !== "undefined" ? localStorage.getItem("appTheme") : null;

    return {
      font: "Arial",
      theme: savedTheme || "light",
      fontSize: "16px",
      canReadSmallText: true,
      usesScreenReader: false,
      confidence: "medium",
      literacy: "medium",
      name: "",
      ageRange: "18_30",
      simpleMode: false,
    };
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCount, setStepsCount] = useState(7);

  // 👇 Aplica la clase CSS del tema al <body>
  const applyThemeClass = (theme) => {
    if (typeof document === "undefined") return;
    document.body.classList.remove("theme-dark", "theme-high-contrast");
    if (theme === "dark") document.body.classList.add("theme-dark");
    if (theme === "high-contrast")
      document.body.classList.add("theme-high-contrast");
  };

  // 🟢 Asegura que el tema actual tenga su clase aplicada
  useEffect(() => {
    applyThemeClass(userSettings.theme);
  }, [userSettings.theme]);

  const nextStep = () => {
    if (currentStep < stepsCount - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const saveAnswer = (field, value) => {
    setUserSettings((prev) => {
      const updated = { ...prev, [field]: value };

      // Ajustar tamaño de letra
      if (field === "canReadSmallText") {
        updated.fontSize = value ? "16px" : "20px";
      }

      // Modo simple si tiene baja confianza o baja lectoescritura
      if (field === "confidence" || field === "literacy") {
        updated.simpleMode =
          (field === "confidence" ? value : updated.confidence) === "low" ||
          (field === "literacy" ? value : updated.literacy) === "low";
      }

      return updated;
    });
  };

  const updateFont = (font) =>
    setUserSettings((prev) => ({ ...prev, font }));

  // 🌈 Actualiza tema + aplica clase + guarda en localStorage
  const updateTheme = (theme) => {
    applyThemeClass(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("appTheme", theme);
    }
    setUserSettings((prev) => ({ ...prev, theme }));
  };

  return {
    userSettings,
    currentStep,
    stepsCount,
    setStepsCount,
    nextStep,
    prevStep,
    saveAnswer,
    updateFont,
    updateTheme,
  };
};
