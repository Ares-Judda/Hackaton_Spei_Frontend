import React, { useState, useEffect, useRef } from "react";
import LoginView from "./views/LoginView";
import WizardView from "./views/WizardView";
import HomeView from "./views/HomeView";
import TransferView from "./views/TransferView";
import ReceiveView from "./views/ReceiveView";
import PayServicesView from "./views/PayServicesView";
import AccountsView from "./views/AccountsView";
import CardsView from "./views/CardsView";
import SignupView from "./views/SignupView";
import PreferencesView from "./views/PreferencesView";

// 🔊 Función de lectura accesible
export function speakText(text, userSettings) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch {}
}

const App = () => {
  const [currentView, setCurrentView] = useState("login");

  const [userSettings, setUserSettings] = useState({
    theme: "white",
    font: "Arial",
    fontSize: "16px",
    canReadSmallText: true,
    usesScreenReader: false,
    needsVoiceAssistant: false,
    confidence: "medium",
    literacy: "medium",
    name: "",
    ageRange: "18_30",
  });

  const [hasCompletedWizard, setHasCompletedWizard] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);

  // ===== Estados para voz =====
  const recognitionRef = useRef(null);
  const [voiceNavActive, setVoiceNavActive] = useState(true); // activo por defecto
  const [voiceSupported, setVoiceSupported] = useState(false);

  // 🔄 Cargar configuraciones y modo simple
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) setUserSettings(JSON.parse(savedSettings));

    const savedMode = localStorage.getItem("simpleMode");
    if (savedMode) setSimpleMode(JSON.parse(savedMode));

    setVoiceSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  // 🔊 Función principal de comandos de voz (directa)
  function handleVoiceCommand(rawText) {
    if (!rawText) return;
    const text = rawText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Navegación directa por voz
    if (text.includes("inicio") || text.includes("principal") || text.includes("home")) {
      setCurrentView("home");
      speakText("", userSettings);
      return;
    }
    if (text.includes("saldo") || text.includes("mis saldos")) {
      setCurrentView("accounts");
      speakText("", userSettings);
      return;
    }
    if (text.includes("pagar") || text.includes("servicios")) {
      setCurrentView("pay");
      speakText("", userSettings);
      return;
    }
    if (text.includes("enviar") && text.includes("dinero")) {
      setCurrentView("transfer");
      speakText("", userSettings);
      return;
    }
    if (text.includes("recibir") && text.includes("dinero")) {
      setCurrentView("receive");
      speakText("", userSettings);
      return;
    }
    if (text.includes("tarjetas") || text.includes("mis tarjetas")) {
      setCurrentView("cards");
      speakText("", userSettings);
      return;
    }
    if (text.includes("preferencias")) {
      setCurrentView("preferences");
      speakText("", userSettings);
      return;
    }
    if (text.includes("ayuda")) {
      speakText(
        "Puedes decir: inicio, mis saldos, pagar servicios, enviar dinero, recibir dinero, mis tarjetas o preferencias.",
        userSettings
      );
      return;
    }
  }

  // 🔈 Inicializar reconocimiento de voz (modo directo)
  useEffect(() => {
    if (!voiceNavActive || !voiceSupported) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-MX";
    rec.continuous = true;
    rec.interimResults = false;

    rec.onstart = () => console.log("Escuchando comandos de voz...");
    rec.onend = () => {
      if (voiceNavActive) rec.start(); // reinicia automáticamente
    };
    rec.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult || !lastResult[0]) return;
      const transcript = lastResult[0].transcript;
      handleVoiceCommand(transcript);
    };

    rec.start();
    recognitionRef.current = rec;

    return () => rec.stop();
  }, [voiceNavActive, voiceSupported]);

  // ===== Funciones de flujo principal =====
  const handleFinishWizard = (finalSettings) => {
    setUserSettings(finalSettings);
    localStorage.setItem("userSettings", JSON.stringify(finalSettings));
    setHasCompletedWizard(true);
    setCurrentView("home");
  };

  const handleLoginSuccess = () => {
    if (hasCompletedWizard) setCurrentView("home");
    else setCurrentView("wizard");
  };

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
          onSignupSuccess={() => setCurrentView("wizard")}
        />
      )}

      {currentView === "wizard" && (
        <WizardView
          userSettings={userSettings}
          setUserSettings={setUserSettings}
          onFinish={handleFinishWizard}
        />
      )}

      {currentView === "home" && (
        <HomeView
          userSettings={userSettings}
          simpleMode={simpleMode}
          setSimpleMode={setSimpleMode}
          goToTransfer={() => setCurrentView("transfer")}
          goToReceive={() => setCurrentView("receive")}
          goToPay={() => setCurrentView("pay")}
          goToAccouts={() => setCurrentView("accounts")}
          goToCards={() => setCurrentView("cards")}
          goToLogin={() => setCurrentView("login")}
          goToPreferences={() => setCurrentView("preferences")}
          voiceNavActive={voiceNavActive}
          setVoiceNavActive={setVoiceNavActive}
        />
      )}

      {currentView === "transfer" && (
        <TransferView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "receive" && (
        <ReceiveView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "pay" && (
        <PayServicesView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "accounts" && (
        <AccountsView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "cards" && (
        <CardsView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}

      {currentView === "preferences" && (
        <PreferencesView userSettings={userSettings} onBack={() => setCurrentView("home")} />
      )}
    </>
  );
};

export default App;
