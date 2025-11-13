import React, { useEffect, useState } from "react";
import { useTransferController } from "../controllers/useTransferController";
import { getAiRisk } from "../services/aiService";
import logo from "../assets/logo.png";

// 🔊 Función de lectura accesible
function speakText(text, userSettings) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  if (!userSettings?.needsVoiceAssistant && !userSettings?.usesScreenReader) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.error("Error en lectura de voz:", e);
  }
}

// ====== Mapeo de niveles de riesgo ======
const mapearNivelRiesgo = (nivel) => {
  const mapeo = {
    'low': 'bajo',
    'medium': 'intermedio', 
    'high': 'alto',
    'bajo': 'bajo',
    'medio': 'intermedio',
    'alto': 'alto'
  };
  return mapeo[nivel?.toLowerCase()] || 'intermedio';
};

// ====== Mapeo de factores de riesgo a mensajes CLAROS para el usuario ======
const traducirFactoresRiesgo = (factores) => {
  if (!factores || !Array.isArray(factores)) return [];
  
  const mapeoFactores = {
    // Factores técnicos de la API
    'new_beneficiary': 'Es la primera vez que transfieres a este contacto',
    'high_amount': 'El monto es más alto de lo habitual',
    'unusual_time': 'Estás transfiriendo en un horario poco común',
    'geolocation_change': 'La ubicación desde donde transfieres ha cambiado',
    'new_device': 'Estás usando un dispositivo nuevo',
    'first_transaction': 'Es una de tus primeras transferencias',
    'unusual_pattern': 'El patrón de transferencia es diferente a tu comportamiento normal',
    'low_history': 'Tienes poco historial de transacciones',
    'suspicious_beneficiary': 'El destinatario tiene características inusuales',
    
    // Factores en español por si acaso
    'Nuevo beneficiario': 'Es la primera vez que transfieres a este contacto',
    'Monto elevado': 'El monto es más alto de lo habitual',
    'Horario inusual': 'Estás transfiriendo en un horario poco común',
    'Ubicación diferente': 'La ubicación desde donde transfieres ha cambiado',
    'Dispositivo nuevo': 'Estás usando un dispositivo nuevo',
    'Poco historial': 'Tienes poco historial de transacciones',
    'Transacción normal': 'Transacción rutinaria'
  };

  return factores.map(factor => 
    mapeoFactores[factor] || `Factor de riesgo: ${factor}`
  );
};

// ====== Generar mensaje de riesgo accesible ======
const generarMensajeRiesgo = (nivel, factores, esNuevoContacto) => {
  const nivelTraducido = mapearNivelRiesgo(nivel);
  
  if (nivelTraducido === 'alto') {
    return 'Revisa cuidadosamente esta transferencia';
  }
  
  if (nivelTraducido === 'intermedio') {
    return esNuevoContacto ? 'Contacto nuevo - Verifica datos' : 'Revisa los detalles de la transferencia';
  }
  
  return esNuevoContacto ? 'Contacto nuevo' : 'Transacción segura';
};

export default function TransferView({ userSettings, onBack }) {
  const {
    accounts,
    form,
    errors,
    savedContacts,
    selectedContact,
    selectedSourceAccount,
    amount,
    risk,
    submitting,
    toast,
    confirmOpen,
    setField,
    submit,
    confirm,
    setConfirmOpen,
  } = useTransferController();

  const [successOpen, setSuccessOpen] = useState(false);
  const [aiRiskData, setAiRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);

  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(n || 0);

  // ====== Función para consultar riesgo de IA ======
  const consultarRiesgoIA = async () => {
    if (!amount || amount <= 0) return;

    setLoadingRisk(true);
    try {
      const payload = {
        user_id: "current_user",
        amount: amount,
        is_new_beneficiary: form.contactMode === "new",
        hour_of_day: new Date().getHours(),
        num_past_transactions: 0,
        avg_transaction_amount: amount,
        max_transaction_amount: amount,
        num_transactions_to_beneficiary: form.contactMode === "saved" ? 1 : 0,
        is_new_device: false,
        geolocation_changed: false
      };

      const response = await getAiRisk(payload);
      setAiRiskData(response.data);
    } catch (error) {
      console.error("Error al consultar riesgo de IA:", error);
      // En caso de error, usar lógica de respaldo
      setAiRiskData({
        result: {
          risk_level: form.contactMode === "new" ? "medium" : "low",
          risk_score: form.contactMode === "new" ? 65 : 25,
          risk_factors: form.contactMode === "new" 
            ? ["new_beneficiary"] 
            : ["routine_transaction"]
        }
      });
    } finally {
      setLoadingRisk(false);
    }
  };

  // ====== Determinar nivel de riesgo basado en IA o lógica de respaldo ======
  const determinarRiesgo = () => {
    if (loadingRisk) {
      return { 
        level: "calculando", 
        msg: "Calculando riesgo...",
        levelTraducido: "calculando",
        factors: [] 
      };
    }

    if (aiRiskData) {
      const riskLevel = aiRiskData.result.risk_level;
      const riskFactors = aiRiskData.result.risk_factors;
      const nivelTraducido = mapearNivelRiesgo(riskLevel);
      const factoresTraducidos = traducirFactoresRiesgo(riskFactors);
      const mensaje = generarMensajeRiesgo(riskLevel, factoresTraducidos, form.contactMode === "new");

      return { 
        level: riskLevel, 
        levelTraducido: nivelTraducido,
        msg: mensaje,
        factors: factoresTraducidos
      };
    }

    // Lógica de respaldo si no hay datos de IA
    const esNuevoContacto = form.contactMode === "new";
    const montoAlto = amount > 10000;
    
    if (esNuevoContacto) {
      return { 
        level: "medium", 
        levelTraducido: "intermedio",
        msg: "Contacto nuevo - Verifica datos", 
        factors: ["Es la primera vez que transfieres a este contacto"] 
      };
    } else if (montoAlto) {
      return { 
        level: "medium", 
        levelTraducido: "intermedio",
        msg: "Revisa los detalles de la transferencia", 
        factors: ["El monto es más alto de lo habitual"] 
      };
    } else {
      return { 
        level: "low", 
        levelTraducido: "bajo",
        msg: "Transacción segura", 
        factors: ["Transacción rutinaria"] 
      };
    }
  };

  const riesgoActual = determinarRiesgo();

  // ====== Efectos para consultar riesgo cuando cambien los parámetros ======
  useEffect(() => {
    if (amount > 0 && form.clabe) {
      const timeoutId = setTimeout(consultarRiesgoIA, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [amount, form.contactMode, form.clabe]);

  useEffect(() => {
    if (form.contactMode === "saved" && form.contactId) {
      consultarRiesgoIA();
    }
  }, [form.contactMode, form.contactId]);

  // ====== Capturar el monto cuando se confirma la transferencia ======
  useEffect(() => {
    if (confirmOpen && amount > 0) {
      setTransferAmount(amount);
    }
  }, [confirmOpen, amount]);

  // ====== Estilos consistentes con HomeView (usa userSettings) ======
  const theme = userSettings?.theme;
  const isDark = theme === "dark";
  const isHighContrast = theme === "high-contrast";

  const accentColor = isHighContrast ? "#19e6ff" : "#0078D4";
  const buttonHover = isHighContrast ? "#19e6ff" : "#005EA6";
  const bgColor = isHighContrast ? "#0f172a" : isDark ? "#0f172a" : "#f9fafb";
  const textColor = isHighContrast ? "#ffffff" : isDark ? "#e2e8f0" : "#1e293b";
  const cardColor = isHighContrast ? "#0a0a0a" : isDark ? "#111827" : "#ffffff";
  const inputBg = isHighContrast ? "#111111" : isDark ? "#0b1220" : "#ffffff";
  const borderColor = isHighContrast ? "#19e6ff" : isDark ? "#293548" : "#d1d5db";
  const subtleText = isHighContrast ? "#cccccc" : isDark ? "#94a3b8" : "#6b7280";

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
  };

  const shell = {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };

  const headerRow = { display: "flex", alignItems: "center", gap: "10px" };
  const h1 = {
    fontSize: `calc(${fontSizeBase} * 1.5)`,
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
  };

  const fieldset = {
    display: "grid",
    gap: "10px",
    backgroundColor: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: "18px",
    padding: "16px",
    boxShadow: isDark
      ? "0 4px 10px rgba(0,0,0,0.25)"
      : "0 4px 10px rgba(0,0,0,0.08)",
  };

  const legend = {
    padding: "0 6px",
    fontSize: fontSizeBase,
    fontWeight: 700,
    opacity: 0.9,
  };

  const label = { fontSize: fontSizeBase, fontWeight: 600 };
  const hint = { fontSize: `calc(${fontSizeBase} * 0.85)`, color: subtleText };
  const errorText = { fontSize: `calc(${fontSizeBase} * 0.85)`, color: "#f87171" };

  const input = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: "12px",
    border: `1px solid ${borderColor}`,
    outline: "none",
    background: inputBg,
    color: textColor,
    fontSize: fontSizeBase,
    transition: "border-color 0.2s ease",
  };

  const radioRow = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    color: textColor,
  };

  const primaryBtn = {
    border: "none",
    borderRadius: "16px",
    backgroundColor: accentColor,
    color: "#fff",
    fontWeight: 700,
    padding: "12px 18px",
    minHeight: "44px",
    cursor: "pointer",
    fontSize: fontSizeBase,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease, transform 0.1s ease",
  };

  const ghostBtn = {
    border: `1px solid ${borderColor}`,
    borderRadius: "12px",
    background: cardColor,
    color: textColor,
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: fontSizeBase,
    transition: "background-color 0.3s ease, transform 0.1s ease",
  };

  const toastBox = (type) => ({
    borderRadius: "12px",
    padding: "10px",
    fontSize: fontSizeBase,
    border:
      type === "success"
        ? "1px solid #86efac"
        : type === "error"
        ? "1px solid #fca5a5"
        : type === "warn"
        ? "1px solid #fde68a"
        : `1px solid ${borderColor}`,
    background:
      type === "success"
        ? isDark
          ? "#052e1b"
          : "#f0fdf4"
        : type === "error"
        ? isDark
          ? "#3a0d0d"
          : "#fef2f2"
        : type === "warn"
        ? isDark
          ? "#3b2e05"
          : "#fffbeb"
        : isDark
        ? "#0b1220"
        : "#eff6ff",
    color: textColor,
  });

  // Hovers y clicks
  const onHoverIn = (e) => (e.currentTarget.style.backgroundColor = buttonHover);
  const onHoverOut = (e) => (e.currentTarget.style.backgroundColor = accentColor);
  const onPressIn = (e) => (e.currentTarget.style.transform = "scale(0.98)");
  const onPressOut = (e) => (e.currentTarget.style.transform = "scale(1)");

  useEffect(() => {
    if (toast?.type === "success") setSuccessOpen(true);
  }, [toast]);

  // 🔊 Leer encabezado al cargar
  useEffect(() => {
    speakText("Transferir dinero", userSettings);
  }, [userSettings]);

  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ position: "relative", marginBottom: "25px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                ...ghostBtn,
                position: "absolute",
                top: 0,
                left: 0,
              }}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
              onFocus={() => speakText("Volver", userSettings)}
              onMouseEnter={() => speakText("Volver", userSettings)}
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

        <h1 style={h1}>Enviar dinero</h1>
        {toast && toast.type !== "success" && (
          <div style={toastBox(toast.type)}>{toast.msg}</div>
        )}

        <form onSubmit={submit} style={{ display: "grid", gap: "16px" }}>
          {/* Cuenta origen */}
          <fieldset style={fieldset}>
            <legend style={legend}>Cuenta origen</legend>
            <div>
              <label htmlFor="sourceAccountId" style={label}>
                Selecciona la cuenta desde la que enviarás
              </label>
              <select
                id="sourceAccountId"
                style={input}
                value={form.sourceAccountId}
                onChange={(e) => setField("sourceAccountId", e.target.value)}
                onFocus={() =>
                  speakText(
                    `Cuenta origen seleccionada: ${
                      selectedSourceAccount
                        ? `${selectedSourceAccount.alias}, saldo disponible ${toMXN(
                            selectedSourceAccount.balance
                          )}`
                        : "ninguna"
                    }`,
                    userSettings
                  )
                }
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.alias} — {a.accountNumber}
                  </option>
                ))}
              </select>
              {selectedSourceAccount && (
                <p style={hint}>
                  Saldo disponible: <b>{toMXN(selectedSourceAccount.balance)}</b>
                </p>
              )}
              {errors.sourceAccountId && <p style={errorText}>{errors.sourceAccountId}</p>}
            </div>
          </fieldset>

          {/* Destinatario */}
          <fieldset style={fieldset}>
            <legend style={legend}>Destinatario</legend>
            <div style={radioRow}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="radio"
                  name="mode"
                  value="saved"
                  checked={form.contactMode === "saved"}
                  onChange={() => setField("contactMode", "saved")}
                  onFocus={() => speakText("Seleccionar contacto guardado", userSettings)}
                />
                Contacto guardado
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="radio"
                  name="mode"
                  value="new"
                  checked={form.contactMode === "new"}
                  onChange={() => setField("contactMode", "new")}
                  onFocus={() => speakText("Seleccionar nuevo contacto", userSettings)}
                />
                Nuevo contacto
              </label>
            </div>

            {form.contactMode === "saved" ? (
              <div>
                <label htmlFor="contactId" style={label}>
                  Selecciona un contacto
                </label>
                <select
                  id="contactId"
                  style={input}
                  value={form.contactId}
                  onChange={(e) => setField("contactId", e.target.value)}
                  onFocus={() =>
                    speakText(
                      `Contacto seleccionado: ${
                        selectedContact ? `${selectedContact.alias} - ${selectedContact.clabe}` : "ninguno"
                      }`,
                      userSettings
                    )
                  }
                >
                  {savedContacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.alias} — {c.clabe}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="alias" style={label}>
                  Alias / Nombre
                </label>
                <input
                  id="alias"
                  style={input}
                  value={form.alias}
                  onChange={(e) => setField("alias", e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  onFocus={() => speakText("Ingresa alias o nombre del destinatario", userSettings)}
                />
                <label htmlFor="clabe" style={label}>
                  CLABE (18 dígitos)
                </label>
                <input
                  id="clabe"
                  inputMode="numeric"
                  style={input}
                  value={form.clabe}
                  onChange={(e) =>
                    setField("clabe", e.target.value.replace(/[^\d]/g, "").slice(0, 18))
                  }
                  placeholder="__________"
                  onFocus={() => speakText("Ingresa la CLABE de 18 dígitos del destinatario", userSettings)}
                />
                {errors.clabe && <p style={errorText}>{errors.clabe}</p>}
              </div>
            )}
          </fieldset>

          {/* Detalle */}
          <fieldset style={fieldset}>
            <legend style={legend}>Detalle</legend>
            <label htmlFor="amount" style={label}>
              Monto (MXN)
            </label>
            <input
              id="amount"
              style={input}
              inputMode="decimal"
              value={form.amountStr}
              onChange={(e) => setField("amountStr", e.target.value)}
              placeholder="0.00"
              onFocus={() => speakText(`Ingresa el monto a transferir`, userSettings)}
            />
            {errors.amountStr && <p style={errorText}>{errors.amountStr}</p>}

            <label htmlFor="concepto" style={label}>
              Concepto
            </label>
            <input
              id="concepto"
              style={input}
              value={form.concepto}
              onChange={(e) => setField("concepto", e.target.value)}
              placeholder="Pago de servicios / renta / etc."
              onFocus={() => speakText(`Ingresa el concepto de la transferencia`, userSettings)}
            />
            {errors.concepto && <p style={errorText}>{errors.concepto}</p>}
          </fieldset>

          {/* Pie */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: `calc(${fontSizeBase} * 0.85)`,
                color: subtleText,
              }}
            >
              Riesgo estimado:{" "}
              <b
                style={{
                  color:
                    riesgoActual.levelTraducido === "alto" ? "#f87171" :
                    riesgoActual.levelTraducido === "intermedio" ? "#eab308" : 
                    riesgoActual.levelTraducido === "calculando" ? subtleText : "#22c55e",
                }}
              >
                {riesgoActual.levelTraducido === "calculando" ? "CALCULANDO" : riesgoActual.levelTraducido.toUpperCase()}
              </b>{" "}
              · {riesgoActual.msg}
            </p>

            <button
              type="submit"
              disabled={submitting || loadingRisk}
              style={{
                ...primaryBtn,
                backgroundColor: accentColor,
                opacity: (submitting || loadingRisk) ? 0.8 : 1,
              }}
              onMouseEnter={() => speakText(submitting ? "Procesando..." : loadingRisk ? "Calculando..." : "Continuar", userSettings)}
              onFocus={() => speakText(submitting ? "Procesando..." : loadingRisk ? "Calculando..." : "Continuar", userSettings)}
              onMouseLeave={onHoverOut}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
            >
              {submitting ? "Procesando..." : loadingRisk ? "Calculando..." : "Continuar"}
            </button>
          </div>
        </form>

        {/* Modal de confirmación con información de riesgo */}
        {confirmOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "grid",
              placeItems: "center",
              padding: "16px",
              zIndex: 50,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "420px",
                background: cardColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "18px",
                padding: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                color: textColor,
              }}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
                Confirma la transferencia
              </h3>
              
              {/* Resumen de la transferencia */}
              <ul style={{ marginBottom: "12px", fontSize: "0.95rem", color: subtleText }}>
                <li><b>Cuenta origen:</b> {selectedSourceAccount?.alias} — {selectedSourceAccount?.accountNumber}</li>
                <li><b>Destinatario:</b> {selectedContact?.alias}</li>
                <li><b>CLABE:</b> {selectedContact?.clabe}</li>
                <li><b>Monto:</b> {toMXN(amount)}</li>
                <li><b>Concepto:</b> {form.concepto}</li>
              </ul>

              {/* Información de riesgo de IA */}
              {riesgoActual && (
                <div style={{ 
                  marginBottom: "12px", 
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: 
                    riesgoActual.levelTraducido === "alto" ? (isDark ? "#3a0d0d" : "#fef2f2") :
                    riesgoActual.levelTraducido === "intermedio" ? (isDark ? "#3b2e05" : "#fffbeb") :
                    (isDark ? "#052e1b" : "#f0fdf4"),
                  border: 
                    riesgoActual.levelTraducido === "alto" ? "1px solid #fca5a5" :
                    riesgoActual.levelTraducido === "intermedio" ? "1px solid #fde68a" :
                    "1px solid #86efac",
                }}>
                  <p style={{ 
                    fontSize: "0.9rem", 
                    fontWeight: 600,
                    margin: "0 0 4px 0",
                    color: textColor
                  }}>
                    Riesgo detectado:{" "}
                    <span style={{
                      color:
                        riesgoActual.levelTraducido === "alto" ? "#f87171" :
                        riesgoActual.levelTraducido === "intermedio" ? "#eab308" : "#22c55e",
                    }}>
                      {riesgoActual.levelTraducido.toUpperCase()}
                    </span>
                  </p>
                  {riesgoActual.factors && riesgoActual.factors.length > 0 && (
                    <div>
                      <p style={{ fontSize: "0.8rem", margin: "2px 0", color: subtleText }}>
                        Recomendación:{" "}
                        {riesgoActual.levelTraducido === "alto" 
                          ? "Revisa cuidadosamente antes de continuar" 
                          : riesgoActual.levelTraducido === "intermedio"
                          ? "Verifica que todos los datos sean correctos"
                          : "Todo parece en orden"}
                      </p>
                      <ul style={{ fontSize: "0.75rem", margin: "4px 0 0 0", paddingLeft: "16px", color: subtleText }}>
                        {riesgoActual.factors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  onClick={() => setConfirmOpen(false)}
                  style={ghostBtn}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirm}
                  style={{ ...primaryBtn, backgroundColor: accentColor }}
                  onMouseEnter={onHoverIn}
                  onMouseLeave={onHoverOut}
                  onMouseDown={onPressIn}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Confirmar y enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de éxito - CORREGIDO para mostrar el monto correcto */}
        {successOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "grid",
              placeItems: "center",
              padding: "16px",
              zIndex: 60,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "420px",
                background: cardColor,
                border: `1px solid ${borderColor}`,
                borderRadius: "18px",
                padding: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                textAlign: "center",
                color: textColor,
              }}
            >
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "6px" }}>
                ¡Transferencia enviada!
              </h3>
              <p style={{ color: subtleText, fontSize: "0.95rem", marginBottom: 12 }}>
                Tu operación se realizó correctamente.
              </p>

              <div
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                  padding: 12,
                  textAlign: "left",
                  marginBottom: 12,
                  fontSize: "0.95rem",
                  color: textColor,
                  background: inputBg,
                }}
              >
                <div><b>Cuenta origen:</b> {selectedSourceAccount?.alias}</div>
                <div><b>Monto:</b> {toMXN(transferAmount || amount)}</div>
                {selectedContact?.alias && (
                  <div><b>Destinatario:</b> {selectedContact.alias}</div>
                )}
                {form.concepto && <div><b>Concepto:</b> {form.concepto}</div>}
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  onClick={() => setSuccessOpen(false)}
                  style={ghostBtn}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Hacer otra transferencia
                </button>
                <button
                  onClick={() => {
                    setSuccessOpen(false);
                    onBack?.();
                  }}
                  style={{ ...primaryBtn, backgroundColor: accentColor }}
                  onMouseEnter={onHoverIn}
                  onMouseLeave={onHoverOut}
                  onMouseDown={onPressIn}
                  onMouseUp={onPressOut}
                >
                  Ir al inicio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}