import React, { useMemo, useState, useEffect } from "react";
import { FaBolt, FaTint, FaWifi, FaPhone, FaPlus } from "react-icons/fa";
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
    'high_amount': 'El monto es más alto de lo habitual para pagos de servicios',
    'unusual_time': 'Estás realizando el pago en un horario poco común',
    'geolocation_change': 'La ubicación desde donde realizas el pago ha cambiado',
    'new_device': 'Estás usando un dispositivo nuevo',
    'first_transaction': 'Es una de tus primeras transacciones',
    'unusual_pattern': 'El patrón de pago es diferente a tu comportamiento normal',
    'low_history': 'Tienes poco historial de transacciones',
    'suspicious_service': 'El servicio tiene características inusuales',
    'new_service_provider': 'Es la primera vez que pagas este servicio',
    'routine_transaction': 'Pago rutinario',
    
    // Factores específicos de pagos de servicios
    'unusual_service_amount': 'El monto es inusual para este tipo de servicio',
    'irregular_payment_frequency': 'La frecuencia de pago es irregular',
    
    // Factores en español por si acaso
    'Monto elevado': 'El monto es más alto de lo habitual para pagos de servicios',
    'Horario inusual': 'Estás realizando el pago en un horario poco común',
    'Ubicación diferente': 'La ubicación desde donde realizas el pago ha cambiado',
    'Dispositivo nuevo': 'Estás usando un dispositivo nuevo',
    'Poco historial': 'Tienes poco historial de transacciones',
    'Proveedor nuevo': 'Es la primera vez que pagas este servicio',
    'Transacción normal': 'Transacción rutinaria'
  };

  return factores.map(factor => 
    mapeoFactores[factor] || `Factor de riesgo: ${factor}`
  );
};

// ====== Generar mensaje de riesgo accesible ======
const generarMensajeRiesgo = (nivel, factores, esServicioNuevo) => {
  const nivelTraducido = mapearNivelRiesgo(nivel);
  
  if (nivelTraducido === 'alto') {
    return 'Revisa cuidadosamente este pago';
  }
  
  if (nivelTraducido === 'intermedio') {
    return esServicioNuevo ? 'Servicio nuevo - Verifica datos' : 'Revisa los detalles del pago';
  }
  
  return esServicioNuevo ? 'Servicio nuevo' : 'Transacción segura';
};

export default function PayServicesView({ userSettings, onBack }) {
  // ===== Función de lectura en voz =====
  const speakTextLocal = (text) => speakText(text, userSettings);

  // ===== Servicios predefinidos =====
  const presets = [
    { id: "agua", label: "Agua", icon: <FaTint /> },
    { id: "luz", label: "Luz", icon: <FaBolt /> },
    { id: "internet", label: "Internet", icon: <FaWifi /> },
    { id: "telefono", label: "Teléfono", icon: <FaPhone /> },
  ];

  // ===== Cuentas de origen (mock) =====
  const sourceAccounts = [
    {
      id: "acc1",
      alias: "Cuenta Nómina",
      number: "1234 5678 9012 3456",
      bank: "Banco Inclusivo",
      balance: 8200.55,
    },
    {
      id: "acc2",
      alias: "Ahorros",
      number: "6543 2109 8765 4321",
      bank: "Banco Inclusivo",
      balance: 25000.0,
    },
    {
      id: "acc3",
      alias: "Gastos",
      number: "1111 2222 3333 4444",
      bank: "Banco Inclusivo",
      balance: 1200.0,
    },
  ];
  const [selectedSourceId, setSelectedSourceId] = useState(
    sourceAccounts[0].id
  );
  const selectedSource = useMemo(
    () => sourceAccounts.find((a) => a.id === selectedSourceId),
    [selectedSourceId]
  );

  // ===== Estado de la vista =====
  const [mode, setMode] = useState("preset"); // "preset" | "custom"
  const [selectedService, setSelectedService] = useState("agua");

  const [form, setForm] = useState({
    amountStr: "",
    refPreset: "",
    customName: "",
    customConvenio: "",
    customRef: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  // ===== Estado para IA de riesgo =====
  const [aiRiskData, setAiRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toNumber = (v) => {
    const x = String(v).replace(",", ".").replace(/[^\d.]/g, "");
    const n = Number.parseFloat(x);
    return Number.isFinite(n) ? n : 0;
  };
  const amount = useMemo(() => toNumber(form.amountStr), [form.amountStr]);

  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(n || 0);

  const summaryName =
    mode === "preset"
      ? presets.find((p) => p.id === selectedService)?.label || "Servicio"
      : form.customName || "Servicio personalizado";
  const summaryRef = mode === "preset" ? form.refPreset : form.customRef;
  const summaryConvenio =
    mode === "preset" ? "(automático)" : form.customConvenio || "-";

  // ====== Función para consultar riesgo de IA ======
  const consultarRiesgoIA = async () => {
    if (!amount || amount <= 0) return;

    setLoadingRisk(true);
    try {
      const payload = {
        user_id: "current_user",
        amount: amount,
        transaction_type: "service_payment",
        service_type: mode === "preset" ? selectedService : "custom",
        service_name: mode === "preset" ? summaryName : form.customName,
        is_new_service: form.refPreset === "" && form.customConvenio === "",
        hour_of_day: new Date().getHours(),
        num_past_transactions: 0,
        avg_transaction_amount: amount,
        max_transaction_amount: amount,
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
          risk_level: amount > 5000 ? "medium" : "low",
          risk_score: amount > 5000 ? 65 : 25,
          risk_factors: amount > 5000 ? ["high_amount"] : ["routine_transaction"]
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
      const esServicioNuevo = form.refPreset === "" && form.customConvenio === "";
      const mensaje = generarMensajeRiesgo(riskLevel, factoresTraducidos, esServicioNuevo);

      return { 
        level: riskLevel, 
        levelTraducido: nivelTraducido,
        msg: mensaje,
        factors: factoresTraducidos
      };
    }

    // Lógica de respaldo si no hay datos de IA
    const esServicioNuevo = form.refPreset === "" && form.customConvenio === "";
    const montoAlto = amount > 5000;
    
    if (esServicioNuevo) {
      return { 
        level: "medium", 
        levelTraducido: "intermedio",
        msg: "Servicio nuevo - Verifica datos", 
        factors: ["Es la primera vez que pagas este servicio"] 
      };
    } else if (montoAlto) {
      return { 
        level: "medium", 
        levelTraducido: "intermedio",
        msg: "Revisa los detalles del pago", 
        factors: ["El monto es más alto de lo habitual para servicios"] 
      };
    } else {
      return { 
        level: "low", 
        levelTraducido: "bajo",
        msg: "Transacción segura", 
        factors: ["Pago rutinario"] 
      };
    }
  };

  const riesgoActual = determinarRiesgo();

  // ====== Efectos para consultar riesgo cuando cambien los parámetros ======
  useEffect(() => {
    if (amount > 0) {
      const timeoutId = setTimeout(consultarRiesgoIA, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [amount, mode, selectedService, form.refPreset, form.customConvenio]);

  // ===== Estilos =====
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
    fontFamily,
  };

  const shell = {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };

  const h1 = { fontSize: "1.4rem", fontWeight: 700, margin: 0, textAlign: "center" };

  const fieldCard = {
    background: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 18,
    padding: 16,
    boxShadow: isDark
      ? "0 4px 10px rgba(0,0,0,0.25)"
      : "0 4px 10px rgba(0,0,0,0.08)",
  };
  const legend = { fontSize: "0.95rem", fontWeight: 700, marginBottom: 8, color: textColor };
  const label = { fontSize: fontSizeBase, fontWeight: 700, color: textColor };
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
  const chip = (active) => ({
    padding: "10px 12px",
    borderRadius: 14,
    border: active ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
    background: active ? (isDark ? "#0b1220" : "#f0f8ff") : cardColor,
    cursor: "pointer",
    flex: 1,
    display: "grid",
    placeItems: "center",
    gap: 6,
    color: textColor,
    transition: "border-color 0.2s ease, transform 0.1s ease",
  });
  const sourceChip = (active) => ({
    padding: "10px 12px",
    borderRadius: 14,
    border: active ? `2px solid ${accentColor}` : `1px solid ${borderColor}`,
    background: active ? (isDark ? "#0b1220" : "#f0f8ff") : cardColor,
    cursor: "pointer",
    display: "grid",
    gap: 4,
    textAlign: "left",
    color: textColor,
    transition: "border-color 0.2s ease, transform 0.1s ease",
  });
  const toastBox = (type) => ({
    borderRadius: 12,
    padding: 10,
    fontSize: "0.95rem",
    border:
      type === "success" ? "1px solid #86efac" :
      type === "error" ? "1px solid #fca5a5" :
      `1px solid ${borderColor}`,
    background:
      type === "success" ? (isDark ? "#052e1b" : "#f0fdf4") :
      type === "error" ? (isDark ? "#3a0d0d" : "#fef2f2") :
      (isDark ? "#0b1220" : "#eff6ff"),
    color: textColor,
  });

  // Hovers/press
  const onHoverIn = (e) => (e.currentTarget.style.backgroundColor = buttonHover);
  const onHoverOut = (e) => (e.currentTarget.style.backgroundColor = accentColor);
  const onPressIn = (e) => (e.currentTarget.style.transform = "scale(0.98)");
  const onPressOut = (e) => (e.currentTarget.style.transform = "scale(1)");

  // ===== Validación =====
  const validate = () => {
    const e = {};
    if (!amount || amount <= 0) e.amountStr = "Ingresa un monto mayor a 0.";
    if (amount > 150000) e.amountStr = "Máximo 150,000 MXN.";

    if (selectedSource && amount > selectedSource.balance) {
      e.amountStr = `Saldo insuficiente en ${selectedSource.alias} (${toMXN(
        selectedSource.balance
      )})`;
    }

    if (mode === "preset") {
      if (!form.refPreset.trim())
        e.refPreset = "Ingresa la referencia de tu servicio.";
    } else {
      if (!form.customName.trim())
        e.customName = "Nombre del servicio requerido.";
      if (!/^\d{4,}$/.test(form.customConvenio.trim()))
        e.customConvenio = "Convenio (solo dígitos, al menos 4).";
      if (!form.customRef.trim()) e.customRef = "Referencia requerida.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Simulación de pago
  const pay = async (ev) => {
    ev?.preventDefault?.();
    if (!validate()) {
      setToast({ type: "error", msg: "Revisa los campos marcados." });
      speakTextLocal("Revisa los campos marcados, hay errores.");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setToast({ type: "success", msg: "Pago realizado correctamente" });
      speakTextLocal("Pago realizado correctamente.");
      setSuccessOpen(true);
      setForm((f) => ({ ...f, amountStr: "" }));
    } catch (e) {
      setToast({ type: "error", msg: "No se pudo completar el pago." });
      speakTextLocal("No se pudo completar el pago.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ position: "relative", marginBottom: "25px" }}>
          {onBack && (
            <button
              onClick={() => {
                onBack?.();
                speakTextLocal("Volviendo a la pantalla anterior.");
              }}
              style={{ ...ghostBtn, position: "absolute", top: 0, left: 0 }}
              onMouseDown={onPressIn}
              onMouseUp={onPressOut}
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

        <h1 style={h1}>Pagar Servicios</h1>

        {toast && toast.type !== "success" && (
          <div style={toastBox(toast.type)}>{toast.msg}</div>
        )}

        {/* Indicador de riesgo */}
        <div style={fieldCard}>
          <div style={legend}>Evaluación de riesgo</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: textColor }}>
                Nivel de riesgo:{" "}
                <b style={{
                  color:
                    riesgoActual.levelTraducido === "alto" ? "#f87171" :
                    riesgoActual.levelTraducido === "intermedio" ? "#eab308" : 
                    riesgoActual.levelTraducido === "calculando" ? subtleText : "#22c55e",
                }}>
                  {riesgoActual.levelTraducido === "calculando" ? "CALCULANDO..." : riesgoActual.levelTraducido.toUpperCase()}
                </b>
              </p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: subtleText }}>
                {riesgoActual.msg}
              </p>
            </div>
          </div>
          {riesgoActual.factors && riesgoActual.factors.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: subtleText }}>
                {riesgoActual.factors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Cuenta de origen */}
        <div style={fieldCard}>
          <div style={legend}>Cuenta de origen</div>
          <div style={{ display: "grid", gap: 8 }}>
            {sourceAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setSelectedSourceId(acc.id);
                  speakTextLocal(`Seleccionaste ${acc.alias} como cuenta de origen`);
                }}
                style={sourceChip(selectedSourceId === acc.id)}
                aria-label={`Usar ${acc.alias} como cuenta de origen`}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div style={{ fontWeight: 700 }}>{acc.alias}</div>
                <div style={{ fontSize: "0.9rem", color: subtleText }}>
                  {acc.bank} · {acc.number.slice(-4).padStart(4, "•")}
                </div>
                <div style={{ fontSize: "0.95rem" }}>
                  Saldo: <b>{toMXN(acc.balance)}</b>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de servicio */}
        <div style={fieldCard}>
          <div style={legend}>Tipo de servicio</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => {
                setMode("preset");
                speakTextLocal("Modo servicios predefinidos seleccionado");
              }}
              style={chip(mode === "preset")}
            >
              <div style={{ fontWeight: 700 }}>Servicios</div>
              <div style={small}>Agua/Luz/Internet</div>
            </button>
            <button
              onClick={() => {
                setMode("custom");
                speakTextLocal("Modo servicio personalizado seleccionado");
              }}
              style={chip(mode === "custom")}
            >
              <div
                style={{
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaPlus /> Personalizado
              </div>
              <div style={small}>Convenio/Referencia</div>
            </button>
          </div>

          {mode === "preset" ? (
            <>
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedService(p.id);
                      speakTextLocal(`Seleccionaste ${p.label}`);
                    }}
                    style={chip(selectedService === p.id)}
                    aria-label={`Seleccionar ${p.label}`}
                  >
                    <div style={{ fontSize: 18 }}>{p.icon}</div>
                    <div style={{ fontWeight: 700 }}>{p.label}</div>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <label htmlFor="refPreset" style={label}>
                  Referencia del servicio
                </label>
                <input
                  id="refPreset"
                  style={input}
                  value={form.refPreset}
                  onChange={(e) => setField("refPreset", e.target.value)}
                  placeholder="Ej. Número de contrato/servicio"
                  onFocus={() =>
                    speakTextLocal(
                      "Ingresa la referencia de tu servicio predefinido, por ejemplo el número de contrato"
                    )
                  }
                />
                {errors.refPreset && (
                  <p style={{ fontSize: "0.85rem", color: "#f87171" }}>
                    {errors.refPreset}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              <div>
                <label htmlFor="customName" style={label}>
                  Nombre del servicio
                </label>
                <input
                  id="customName"
                  style={input}
                  value={form.customName}
                  onChange={(e) => setField("customName", e.target.value)}
                  placeholder="Ej. Agua Municipal Xalapa"
                  onFocus={() =>
                    speakTextLocal("Ingresa el nombre del servicio personalizado")
                  }
                />
                {errors.customName && (
                  <p style={{ fontSize: "0.85rem", color: "#f87171" }}>
                    {errors.customName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="customConvenio" style={label}>
                  Número de convenio
                </label>
                <input
                  id="customConvenio"
                  inputMode="numeric"
                  style={input}
                  value={form.customConvenio}
                  onChange={(e) =>
                    setField(
                      "customConvenio",
                      e.target.value.replace(/[^\d]/g, "")
                    )
                  }
                  placeholder="Solo dígitos"
                  onFocus={() => speakTextLocal("Ingresa el número de convenio")}
                />
                {errors.customConvenio && (
                  <p style={{ fontSize: "0.85rem", color: "#f87171" }}>
                    {errors.customConvenio}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="customRef" style={label}>
                  Referencia
                </label>
                <input
                  id="customRef"
                  style={input}
                  value={form.customRef}
                  onChange={(e) => setField("customRef", e.target.value)}
                  placeholder="Número de referencia del servicio"
                  onFocus={() =>
                    speakTextLocal("Ingresa la referencia del servicio personalizado")
                  }
                />
                {errors.customRef && (
                  <p style={{ fontSize: "0.85rem", color: "#f87171" }}>
                    {errors.customRef}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Monto */}
        <div style={fieldCard}>
          <div style={legend}>Monto</div>
          <label htmlFor="amount" style={label}>
            Cantidad a pagar (MXN)
          </label>
          <input
            id="amount"
            style={input}
            inputMode="decimal"
            value={form.amountStr}
            onChange={(e) => setField("amountStr", e.target.value)}
            placeholder="0.00"
            onFocus={() => speakTextLocal("Ingresa la cantidad a pagar en pesos")}
          />
          <p style={small}>
            {amount ? `Se pagarán ${toMXN(amount)}` : "Ej. 350.00"}
            {selectedSource && amount > 0 && (
              <>
                {" "}
                · Saldo en {selectedSource.alias}: <b>{toMXN(selectedSource.balance)}</b>
              </>
            )}
          </p>
          {errors.amountStr && (
            <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{errors.amountStr}</p>
          )}
        </div>

        {/* Resumen */}
        <div style={fieldCard}>
          <div style={legend}>Resumen</div>
          <div style={{ fontSize: "0.95rem", color: subtleText }}>
            <div>
              <b>Cuenta de origen:</b> {selectedSource?.alias} · {selectedSource?.bank} · **** {selectedSource?.number.slice(-4)}
            </div>
            <div>
              <b>Servicio:</b> {summaryName}
            </div>
            <div>
              <b>Convenio:</b> {summaryConvenio}
            </div>
            <div>
              <b>Referencia:</b> {summaryRef || "-"}
            </div>
            <div>
              <b>Monto:</b> {toMXN(amount)}
            </div>
            <div style={{ marginTop: "8px", padding: "8px", borderRadius: "8px", backgroundColor: 
              riesgoActual.levelTraducido === "alto" ? (isDark ? "#3a0d0d" : "#fef2f2") :
              riesgoActual.levelTraducido === "intermedio" ? (isDark ? "#3b2e05" : "#fffbeb") :
              (isDark ? "#052e1b" : "#f0fdf4") }}>
              <b>Evaluación:</b> Riesgo {riesgoActual.levelTraducido} - {riesgoActual.msg}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button
            onClick={() => {
              onBack?.();
              speakTextLocal("Cancelando pago y volviendo al inicio");
            }}
            style={ghostBtn}
            onMouseDown={onPressIn}
            onMouseUp={onPressOut}
          >
            Cancelar
          </button>
          <button
            onClick={pay}
            disabled={submitting || loadingRisk}
            style={{
              ...primaryBtn,
              backgroundColor: accentColor,
              opacity: (submitting || loadingRisk) ? 0.8 : 1,
            }}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            onMouseDown={onPressIn}
            onMouseUp={onPressOut}
          >
            {submitting ? "Procesando..." : loadingRisk ? "Calculando..." : "Pagar ahora"}
          </button>
        </div>

        {/* Modal de éxito */}
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
              padding: 16,
              zIndex: 60,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                background: cardColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 18,
                padding: 16,
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                textAlign: "center",
                color: textColor,
              }}
            >
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>
                ¡Pago realizado!
              </h3>
              <p style={{ color: subtleText, fontSize: "0.95rem", marginBottom: 12 }}>
                Tu pago se realizó correctamente.
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
                <div>
                  <b>Cuenta de origen:</b> {selectedSource?.alias} · **** {selectedSource?.number.slice(-4)}
                </div>
                <div>
                  <b>Servicio:</b> {summaryName}
                </div>
                <div>
                  <b>Convenio:</b> {summaryConvenio}
                </div>
                <div>
                  <b>Referencia:</b> {summaryRef || "-"}
                </div>
                <div>
                  <b>Monto:</b> {toMXN(amount)}
                </div>
                <div>
                  <b>Folio:</b> {`SIM-${Date.now().toString().slice(-6)}`}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  onClick={() => {
                    setSuccessOpen(false);
                    speakTextLocal("Preparado para hacer otro pago");
                  }}
                  style={ghostBtn}
                  onMouseDown={onPressIn}
                  onMouseUp={onPressOut}
                >
                  Hacer otro pago
                </button>
                <button
                  onClick={() => {
                    setSuccessOpen(false);
                    onBack?.();
                    speakTextLocal("Volviendo al inicio");
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