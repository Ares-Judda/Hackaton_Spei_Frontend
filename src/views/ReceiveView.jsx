import React, { useMemo, useState, useEffect, useRef } from "react";
import { FaCopy, FaQrcode, FaShareAlt, FaDownload, FaQuestionCircle, FaInfoCircle, FaExclamationTriangle, FaLightbulb } from "react-icons/fa";
import { getAiNudge } from "../services/aiService";
import logo from "../assets/logo.png";

export default function ReceiveView({ userSettings, onBack }) {
  const accounts = [
    {
      id: "acc1",
      alias: "Cuenta Nómina",
      clabe: "002010012345678901",
      accountNumber: "1234 5678 9012 3456",
      bank: "Banco Inclusivo",
      name: "Juan Pérez",
    },
    {
      id: "acc2",
      alias: "Ahorros",
      clabe: "012180001234567891",
      accountNumber: "6543 2109 8765 4321",
      bank: "Banco Inclusivo",
      name: "Juan Pérez",
    },
  ];

  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const selected = useMemo(
    () => accounts.find((a) => a.id === selectedId),
    [selectedId]
  );

  const [toast, setToast] = useState(null);
  const dismissToast = () => setToast(null);

  const [qrAmount, setQrAmount] = useState("");
  const [qrConcept, setQrConcept] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  // ===== Estado para Nudging de IA =====
  const [nudgeData, setNudgeData] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [hasTriggeredNudge, setHasTriggeredNudge] = useState(false);
  
  // Usar useRef para valores que cambian frecuentemente
  const interactionCountRef = useRef(0);
  const timeOnScreenRef = useRef(0);
  const validationErrorsRef = useRef(0);
  const backNavigationsRef = useRef(0);
  const sessionIdRef = useRef(`session_${Date.now()}`);
  const lastRequestTimeRef = useRef(0);

  // Estados para UI (solo para mostrar)
  const [uiInteractionCount, setUiInteractionCount] = useState(0);
  const [uiTimeOnScreen, setUiTimeOnScreen] = useState(0);

  // ===== Función de lectura en voz =====
  function speakText(text) {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) {
      console.warn("speechSynthesis no disponible en este navegador.");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  // ===== Función para consultar Nudging de IA =====
  const consultarNudgingIA = async () => {
    // Solo consultar si han pasado al menos 10 segundos desde la última petición
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 10000) {
      console.log("Esperando 10 segundos entre peticiones...");
      return;
    }

    try {
      const payload = {
        user_id: "current_user",
        session_id: sessionIdRef.current,
        screen: "receive_money",
        num_validation_errors: 100,
        time_on_screen_seconds: 100,
        num_back_navigations: backNavigationsRef.current,
        steps_total: 3,
        current_step: 1
      };

      console.log("Enviando payload a IA:", payload);
      
      const response = await getAiNudge(payload);
      console.log("Respuesta completa de IA:", response);
      const responseData = response.data;
      setNudgeData(responseData);
      lastRequestTimeRef.current = now;
      
      if (responseData && responseData.result && responseData.result.needs_help) {
        console.log("IA detectó que necesita ayuda, mostrando nudge...");
        
        setShowNudge(true);
        setShowHelpMessage(true);
        setHasTriggeredNudge(true);
        
        // Leer el mensaje de ayuda
        const mensajeAyuda = getNudgeMessage(
          responseData.result.recommended_nudge_type,
          responseData.result.reason
        );
        speakText(mensajeAyuda);
        
        // Ocultar automáticamente después de 8 segundos
        setTimeout(() => {
          setShowNudge(false);
        }, 8000);

        // Ocultar mensaje de ayuda después de 7 segundos
        setTimeout(() => {
          setShowHelpMessage(false);
        }, 7000);
      } else {
        console.log("IA dice que no necesita ayuda", responseData?.result);
      }
    } catch (error) {
      console.error("Error al consultar nudging de IA:", error);
    }
  };

  // ===== Efectos para tracking de interacciones =====
  useEffect(() => {
    // Timer para tiempo en pantalla - SOLO UNA VEZ
    const timer = setInterval(() => {
      timeOnScreenRef.current += 1;
      setUiTimeOnScreen(timeOnScreenRef.current); // Actualizar UI
      
      console.log(`Tiempo en pantalla: ${timeOnScreenRef.current} segundos, Interacciones: ${interactionCountRef.current}`);
      
      // Consultar IA cada 10 segundos
      if (timeOnScreenRef.current % 10 === 0) {
        console.log(`10 segundos completados, consultando IA...`);
        consultarNudgingIA();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hasTriggeredNudge]); // SOLO hasTriggeredNudge como dependencia

  // ===== Función para registrar interacciones =====
  const registrarInteraccion = () => {
    interactionCountRef.current += 1;
    setUiInteractionCount(interactionCountRef.current); // Actualizar UI
    console.log(`Interacción registrada: ${interactionCountRef.current}`);
  };

  // ===== Mapeo de tipos de nudge a mensajes =====
  const getNudgeMessage = (nudgeType, reason) => {
    const messages = {
      assist: {
        low_difficulty: "¿Necesitas ayuda para compartir tus datos? Puedo guiarte paso a paso.",
        validation_errors: "Revisa que los datos estén correctos. Verifica la CLABE y número de cuenta.",
        time_on_screen: "¿Te ayudo a encontrar lo que buscas? Puedes copiar datos o generar un QR.",
        navigation_confusion: "Puedes copiar o compartir tus datos fácilmente. Selecciona una opción."
      },
      warning: {
        low_difficulty: "Recuerda que puedes copiar cada dato individualmente o todos juntos.",
        validation_errors: "Verifica la información antes de compartir. La CLABE debe tener 18 dígitos.",
        time_on_screen: "Tómate tu tiempo, estamos aquí para ayudarte si lo necesitas.",
        navigation_confusion: "Selecciona la cuenta que prefieras para recibir pagos."
      },
      info: {
        low_difficulty: "Puedes generar un QR con monto específico o dejarlo en blanco.",
        validation_errors: "Todos los campos son opcionales. Puedes personalizar el QR.",
        time_on_screen: "Esta pantalla te ayuda a recibir pagos fácilmente. Comparte tus datos o el QR.",
        navigation_confusion: "Usa los botones de copiar para compartir datos rápidamente."
      }
    };

    return messages[nudgeType]?.[reason] || "¿Necesitas ayuda para recibir pagos? Estoy aquí para ayudarte.";
  };

  // ===== Obtener icono según tipo de ayuda =====
  const getNudgeIcon = (nudgeType) => {
    switch (nudgeType) {
      case 'assist':
        return <FaQuestionCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaLightbulb />;
    }
  };

  // ===== Obtener color según tipo de ayuda =====
  const getNudgeColor = (nudgeType) => {
    switch (nudgeType) {
      case 'assist':
        return '#0078D4'; // Azul
      case 'warning':
        return '#D83B01'; // Naranja
      case 'info':
        return '#107C10'; // Verde
      default:
        return accentColor;
    }
  };

  // ===== Estilos coherentes con Home/Transfer/Accounts usando userSettings =====
  const theme = userSettings?.theme;
  const isDark = theme === "dark";
  const isHighContrast = theme === "high-contrast";

  const accentColor = isHighContrast ? "#19e6ff" : "#0078D4";
  const buttonHover = isHighContrast ? "#19e6ff" : "#005EA6";
  const bgColor = isHighContrast ? "#0f172a" : isDark ? "#0f172a" : "#f9fafb";
  const textColor = isHighContrast ? "#ffffff" : isDark ? "#e2e8f0" : "#1e293b";
  const cardColor = isHighContrast ? "#0a0a0a" : isDark ? "#111827" : "#ffffff";
  const inputBg = isHighContrast ? "#111111" : isDark ? "#0b1220" : "#ffffff";
  const borderColor = isHighContrast
    ? "#19e6ff"
    : isDark
    ? "#293548"
    : "#d1d5db";
  const subtleText = isHighContrast
    ? "#cccccc"
    : isDark
    ? "#94a3b8"
    : "#6b7280";

  const fontSizeBase = userSettings?.fontSize || "0.95rem";
  const fontFamily =
    userSettings?.font || "system-ui, -apple-system, Segoe UI, Roboto, Arial";

  const container = {
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "30px 20px",
    backgroundColor: bgColor,
    color: textColor,
    transition: "background-color 0.3s ease, color 0.3s ease",
    fontFamily,
  };
  const shell = {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };
  const h1 = {
    fontSize: "1.4rem",
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
  };
  const label = { fontSize: fontSizeBase, fontWeight: 700, color: textColor };
  const small = { fontSize: "0.85rem", color: subtleText };

  const ghostBtn = {
    border: `1px solid ${borderColor}`,
    borderRadius: 12,
    background: cardColor,
    color: textColor,
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: fontSizeBase,
    transition: "background-color 0.3s ease, transform 0.1s ease",
  };
  const primaryBtn = {
    border: "none",
    borderRadius: 16,
    backgroundColor: accentColor,
    color: "#fff",
    fontWeight: 700,
    padding: "12px 18px",
    minHeight: 44,
    cursor: "pointer",
    fontSize: fontSizeBase,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease, transform 0.1s ease",
  };
  const fieldCard = {
    background: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 18,
    padding: 16,
    boxShadow: isDark
      ? "0 4px 10px rgba(0,0,0,0.25)"
      : "0 4px 10px rgba(0,0,0,0.08)",
  };
  const input = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${borderColor}`,
    outline: "none",
    background: inputBg,
    color: textColor,
    fontSize: fontSizeBase,
  };
  const toastBox = (type) => ({
    borderRadius: 12,
    padding: 10,
    fontSize: "0.95rem",
    border: type === "success" ? "1px solid #86efac" : "1px solid #fca5a5",
    background:
      type === "success"
        ? isDark
          ? "#052e1b"
          : "#f0fdf4"
        : isDark
        ? "#3a0d0d"
        : "#fef2f2",
    color: textColor,
  });

  // ===== Estilo para el mensaje de ayuda en la UI =====
  const helpMessageBox = {
    background: cardColor,
    border: `2px solid ${nudgeData ? getNudgeColor(nudgeData.result.recommended_nudge_type) : accentColor}`,
    borderRadius: 16,
    padding: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    animation: "slideInDown 0.4s ease-out",
    position: "relative",
  };

  // ===== Estilo para el mensaje de nudge modal =====
  const nudgeBox = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    background: cardColor,
    border: `2px solid ${accentColor}`,
    borderRadius: 16,
    padding: "20px 24px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    maxWidth: "380px",
    textAlign: "center",
    animation: "fadeInScale 0.3s ease-out",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
  };

  const chip = (active) => ({
    padding: "10px 12px",
    borderRadius: 14,
    border: active ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
    background: active ? (isDark ? "#0b1220" : "#f0f8ff") : cardColor,
    cursor: "pointer",
    flex: 1,
    display: "grid",
    placeItems: "center",
    gap: 4,
    color: textColor,
    transition: "border-color 0.2s ease, transform 0.1s ease",
  });

  // ===== Hovers/press como en las otras vistas =====
  const onHoverIn = (e) =>
    (e.currentTarget.style.backgroundColor = buttonHover);
  const onHoverOut = (e) =>
    (e.currentTarget.style.backgroundColor = accentColor);
  const onPressIn = (e) => (e.currentTarget.style.transform = "scale(0.98)");
  const onPressOut = (e) => (e.currentTarget.style.transform = "scale(1)");

  // ===== Clipboard / share =====
  const copyToClipboard = async (text, label) => {
    try {
      if (navigator.clipboard?.writeText)
        await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setToast({ type: "success", msg: `${label} copiado` });
      speakText(`${label} copiado`);
      setTimeout(dismissToast, 1800);
      registrarInteraccion();
    } catch {
      setToast({ type: "error", msg: `No se pudo copiar ${label}` });
      speakText(`No se pudo copiar ${label}`);
      setTimeout(dismissToast, 2000);
    }
  };

  const shareData = async () => {
    const text = `Envía a ${selected.name} (${selected.alias})
CLABE: ${selected.clabe}
Cuenta: ${selected.accountNumber}
Banco: ${selected.bank}`;
    speakText("Compartiendo datos de transferencia");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Datos para transferencia", text });
        setToast({ type: "success", msg: "Compartido" });
        setTimeout(dismissToast, 1500);
      } catch {}
    } else {
      copyToClipboard(text, "Datos de transferencia");
    }
    registrarInteraccion();
  };

  // ===== QR helpers =====
  const buildCodiPayload = () => {
    const amount = String(qrAmount).trim();
    return JSON.stringify({
      type: "CoDiDemo",
      name: selected.name,
      bank: selected.bank,
      clabe: selected.clabe,
      account: selected.accountNumber,
      amount: amount ? Number(amount) : null,
      concept: qrConcept?.trim() || "",
      currency: "MXN",
      ts: Date.now(),
    });
  };

  const generateQr = () => {
    const data = encodeURIComponent(buildCodiPayload());
    const cacheBust = Date.now();
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}&cb=${cacheBust}`
    );
  };

  useEffect(() => {
    generateQr();
  }, []);
  useEffect(() => {
    generateQr();
  }, [selectedId, qrAmount, qrConcept]);

  const downloadQr = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CoDiQR_${selected.alias}.png`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
      speakText("QR descargado");
      registrarInteraccion();
    } catch {
      setToast({ type: "error", msg: "No se pudo descargar el QR" });
      speakText("No se pudo descargar el QR");
      setTimeout(dismissToast, 1800);
    }
  };

  const shareQr = async () => {
    if (!qrUrl || !navigator.share || !navigator.canShare) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const file = new File([blob], `CoDiQR_${selected.alias}.png`, {
        type: "image/png",
      });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QR de cobro",
          text: "Escanea para pagar (demo)",
          files: [file],
        });
        speakText("QR compartido");
      } else {
        await navigator.share({ title: "QR de cobro", text: qrUrl });
      }
      registrarInteraccion();
    } catch {}
  };

  // ===== Render =====
  return (
    <div style={container}>
      <div style={shell}>
        {/* Mensaje de Nudge de IA Modal */}
        
        <div style={{ position: "relative", marginBottom: "25px" }}>
          {onBack && (
            <button
              onClick={() => {
                onBack();
                speakText("Volviendo atrás");
                backNavigationsRef.current += 1;
                registrarInteraccion();
              }}
              style={{
                ...ghostBtn,
                position: "absolute",
                top: 0,
                left: 0,
              }}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
              aria-label="Volver"
            >
              ← Volver
            </button>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "-15px",
            }}
          >
            <img
              src={logo}
              alt="Logo Banco Inclusivo"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "white",
                marginBottom: "-15px",
              }}
            />
            <p>B-Accesible</p>
          </div>
        </div>

        <h1 style={h1}>Recibir dinero</h1>

        {/* Mensaje de ayuda de IA */}
        {showHelpMessage && nudgeData && (
          <div style={helpMessageBox}>
            <div style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              gap: "12px"
            }}>
              <div style={{ 
                color: getNudgeColor(nudgeData.result.recommended_nudge_type),
                fontSize: "1.3rem",
                marginTop: "2px"
              }}>
                {getNudgeIcon(nudgeData.result.recommended_nudge_type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: "8px"
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: textColor
                  }}>
                    Sugerencia de ayuda
                  </h3>
                  <button
                    onClick={() => setShowHelpMessage(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: subtleText,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      padding: "4px"
                    }}
                    aria-label="Cerrar sugerencia"
                  >
                    ×
                  </button>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: "0.95rem",
                  lineHeight: "1.4",
                  color: textColor
                }}>
                  {getNudgeMessage(
                    nudgeData.result.recommended_nudge_type,
                    nudgeData.result.reason
                  )}
                </p>
                <div style={{ 
                  display: "flex", 
                  gap: "8px", 
                  marginTop: "12px"
                }}>
                  <button
                    onClick={() => {
                      setShowHelpMessage(false);
                      speakText("Sugerencia cerrada");
                    }}
                    style={{
                      ...ghostBtn,
                      padding: "6px 12px",
                      fontSize: "0.85rem"
                    }}
                  >
                    Entendido
                  </button>
                  <button
                    onClick={() => {
                      setShowNudge(true);
                      setShowHelpMessage(false);
                      speakText("Mostrando más opciones de ayuda");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: getNudgeColor(nudgeData.result.recommended_nudge_type),
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "underline",
                      padding: "6px 12px"
                    }}
                  >
                    Ver más ayuda
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={fieldCard}>
          <label style={label}>Cuenta a recibir</label>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setSelectedId(acc.id);
                  speakText(`Seleccionaste la cuenta ${acc.alias}`);
                  registrarInteraccion();
                }}
                style={chip(selectedId === acc.id)}
                onMouseDown={onPressIn}
                onMouseUp={onPressOut}
                aria-label={`Seleccionar ${acc.alias}`}
              >
                <div style={{ fontWeight: 700, fontSize: fontSizeBase }}>
                  {acc.alias}
                </div>
                <div style={{ fontSize: fontSizeBase }}>
                  {acc.accountNumber}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Datos principales */}
        <div style={fieldCard}>
          <div style={{ fontSize: fontSizeBase, fontWeight: 700 }}>
            {selected.name}
          </div>
          <div style={small}>{selected.bank}</div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {/* CLABE */}
            <div>
              <div style={small}>CLABE</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div
                  style={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontSize: fontSizeBase,
                  }}
                >
                  {selected.clabe}
                </div>
                <button
                  onClick={() => {
                    copyToClipboard(selected.clabe, "CLABE");
                    registrarInteraccion();
                  }}
                  aria-label="Copiar CLABE"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: accentColor,
                    fontSize: fontSizeBase,
                  }}
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            {/* Número de cuenta */}
            <div>
              <div style={small}>Número de cuenta</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: fontSizeBase }}>
                  {selected.accountNumber}
                </div>
                <button
                  onClick={() => {
                    copyToClipboard(selected.accountNumber, "Número de cuenta");
                    registrarInteraccion();
                  }}
                  aria-label="Copiar número de cuenta"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: accentColor,
                    fontSize: fontSizeBase,
                  }}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={() => {
                copyToClipboard(
                  `CLABE: ${selected.clabe}\nCuenta: ${selected.accountNumber}\nTitular: ${selected.name}\nBanco: ${selected.bank}`,
                  "Datos de transferencia"
                );
                registrarInteraccion();
              }}
              style={ghostBtn}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
            >
              Copiar todo
            </button>
            <button
              onClick={shareData}
              style={primaryBtn}
              onMouseEnter={onHoverIn}
              onMouseLeave={onHoverOut}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaShareAlt /> Compartir
              </div>
            </button>
          </div>
        </div>

        {/* QR siempre visible */}
        <div style={fieldCard}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <FaQrcode />
            <div style={{ fontSize: 16, fontWeight: 700 }}>QR para cobrar</div>
          </div>

          <div
            style={{
              display: "grid",
              placeItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR para cobrar"
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 12,
                  border: `1px solid ${borderColor}`,
                  background: cardColor,
                  padding: 6,
                }}
              />
            ) : (
              <div
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 12,
                  border: `1px dashed ${borderColor}`,
                  display: "grid",
                  placeItems: "center",
                  background: cardColor,
                  color: subtleText,
                }}
              >
                Generando QR…
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={downloadQr}
                type="button"
                style={ghostBtn}
                disabled={!qrUrl}
                onMouseDown={onPressIn}
                onMouseUp={onPressOut}
              >
                <FaDownload style={{ marginRight: 6 }} /> Descargar
              </button>
              {navigator.share && (
                <button
                  onClick={shareQr}
                  type="button"
                  style={ghostBtn}
                  disabled={!qrUrl}
                  onMouseDown={onPressIn}
                  onMouseUp={onPressOut}
                >
                  <FaShareAlt style={{ marginRight: 6 }} /> Compartir QR
                </button>
              )}
            </div>
          </div>

          {/* Opcionales */}
          <div>
            <label style={label}>Monto (opcional)</label>
            <input
              style={input}
              inputMode="decimal"
              placeholder="0.00"
              value={qrAmount}
              onChange={(e) => {
                setQrAmount(
                  e.target.value
                    .replace(",", ".")
                    .replace(/[^\d.]/g, "")
                    .slice(0, 12)
                );
                registrarInteraccion();
              }}
              aria-label="Monto opcional"
              onFocus={() =>
                speakText(
                  "Campo monto opcional. Puedes dejarlo vacío o escribir la cantidad que deseas recibir."
                )
              }
            />
            <div style={small}>
              Puedes dejarlo vacío y la otra persona capturará el monto.
            </div>
          </div>

          <div>
            <label style={label}>Concepto (opcional)</label>
            <input
              style={input}
              placeholder="Ej. Cena, renta, préstamo"
              value={qrConcept}
              onChange={(e) => {
                setQrConcept(e.target.value.slice(0, 60));
                registrarInteraccion();
              }}
              aria-label="Concepto opcional"
              onFocus={() =>
                speakText(
                  "Campo concepto opcional. Puedes dejarlo vacío o escribir la razón del cobro."
                )
              }
            />
            <div style={small}>Este campo también puede ir vacío.</div>
          </div>

          <div style={{ marginTop: 6, ...small }}>
            Este QR es de demostración. En producción, usa el formato oficial de
            CoDi.
          </div>
        </div>

        {toast && <div style={toastBox(toast.type)}>{toast.msg}</div>}
      </div>

      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}