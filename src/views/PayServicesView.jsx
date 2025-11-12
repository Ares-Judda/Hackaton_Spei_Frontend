import React, { useMemo, useState } from "react";
import { FaBolt, FaTint, FaWifi, FaPhone, FaPlus } from "react-icons/fa";

export default function PayServicesView({ userSettings, onBack }) {
  // ===== Servicios predefinidos =====
  const presets = [
    { id: "agua", label: "Agua", icon: <FaTint /> },
    { id: "luz", label: "Luz", icon: <FaBolt /> },
    { id: "internet", label: "Internet", icon: <FaWifi /> },
    { id: "telefono", label: "Teléfono", icon: <FaPhone /> },
  ];

  // ===== Cuentas de origen (mock) =====
  const sourceAccounts = [
    { id: "acc1", alias: "Cuenta Nómina", number: "1234 5678 9012 3456", bank: "Banco Inclusivo", balance: 8200.55 },
    { id: "acc2", alias: "Ahorros",       number: "6543 2109 8765 4321", bank: "Banco Inclusivo", balance: 25000.00 },
    { id: "acc3", alias: "Gastos",        number: "1111 2222 3333 4444", bank: "Banco Inclusivo", balance: 1200.00 },
  ];
  const [selectedSourceId, setSelectedSourceId] = useState(sourceAccounts[0].id);
  const selectedSource = useMemo(
    () => sourceAccounts.find(a => a.id === selectedSourceId),
    [selectedSourceId]
  );

  // ===== Estado de la vista =====
  const [mode, setMode] = useState("preset"); // "preset" | "custom"
  const [selectedService, setSelectedService] = useState("agua");

  const [form, setForm] = useState({
    amountStr: "",
    // preset
    refPreset: "",
    // custom
    customName: "",
    customConvenio: "",
    customRef: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // {type, msg}
  const [successOpen, setSuccessOpen] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toNumber = (v) => {
    const x = String(v).replace(",", ".").replace(/[^\d.]/g, "");
    const n = Number.parseFloat(x);
    return Number.isFinite(n) ? n : 0;
  };
  const amount = useMemo(() => toNumber(form.amountStr), [form.amountStr]);

  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  const summaryName = mode === "preset"
    ? presets.find((p) => p.id === selectedService)?.label || "Servicio"
    : form.customName || "Servicio personalizado";
  const summaryRef = mode === "preset" ? form.refPreset : form.customRef;
  const summaryConvenio = mode === "preset" ? "(automático)" : form.customConvenio || "-";

  // ===== Estilos (coherentes con Home/Transfer/Accounts/Receive) =====
  const isDark = userSettings?.theme === "dark";
  const accentColor = "#0078D4";
  const buttonHover = "#005EA6";
  const bgColor = isDark ? "#0f172a" : "#f9fafb";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const cardColor = isDark ? "#111827" : "#ffffff";
  const inputBg = isDark ? "#0b1220" : "#ffffff";
  const borderColor = isDark ? "#293548" : "#d1d5db";
  const subtleText = isDark ? "#94a3b8" : "#6b7280";
  const fontSizeBase = userSettings?.fontSize || "0.95rem";
  const fontFamily = userSettings?.font || "system-ui, -apple-system, Segoe UI, Roboto, Arial";

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
  const h1 = { fontSize: "1.4rem", fontWeight: 700, margin: 0 };
  const fieldCard = {
    background: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 18,
    padding: 16,
    boxShadow: isDark ? "0 4px 10px rgba(0,0,0,0.25)" : "0 4px 10px rgba(0,0,0,0.08)",
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
      type === "error"   ? "1px solid #fca5a5" :
                           `1px solid ${borderColor}`,
    background:
      type === "success" ? (isDark ? "#052e1b" : "#f0fdf4") :
      type === "error"   ? (isDark ? "#3a0d0d" : "#fef2f2") :
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
      e.amountStr = `Saldo insuficiente en ${selectedSource.alias} (${toMXN(selectedSource.balance)})`;
    }

    if (mode === "preset") {
      if (!form.refPreset.trim()) e.refPreset = "Ingresa la referencia de tu servicio.";
    } else {
      if (!form.customName.trim()) e.customName = "Nombre del servicio requerido.";
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
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setToast({ type: "success", msg: "Pago realizado correctamente" });
      setSuccessOpen(true);
      setForm((f) => ({ ...f, amountStr: "" }));
    } catch (e) {
      setToast({ type: "error", msg: "No se pudo completar el pago." });
    } finally {
      setSubmitting(false);
    }
  };

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={ghostBtn}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ← Volver
            </button>
          )}
          <h1 style={h1}>Pagar servicios</h1>
        </div>

        {toast && toast.type !== "success" && (
          <div style={toastBox(toast.type)}>{toast.msg}</div>
        )}

        {/* Cuenta de origen */}
        <div style={fieldCard}>
          <div style={legend}>Cuenta de origen</div>
          <div style={{ display: "grid", gap: 8 }}>
            {sourceAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedSourceId(acc.id)}
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
            <button onClick={() => setMode("preset")} style={chip(mode === "preset")}>
              <div style={{ fontWeight: 700 }}>Servicios</div>
              <div style={small}>Agua/Luz/Internet</div>
            </button>
            <button onClick={() => setMode("custom")} style={chip(mode === "custom")}>
              <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <FaPlus /> Personalizado
              </div>
              <div style={small}>Convenio/Referencia</div>
            </button>
          </div>

          {mode === "preset" ? (
            <>
              <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedService(p.id)}
                    style={chip(selectedService === p.id)}
                    aria-label={`Seleccionar ${p.label}`}
                  >
                    <div style={{ fontSize: 18 }}>{p.icon}</div>
                    <div style={{ fontWeight: 700 }}>{p.label}</div>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <label htmlFor="refPreset" style={label}>Referencia del servicio</label>
                <input
                  id="refPreset"
                  style={input}
                  value={form.refPreset}
                  onChange={(e) => setField("refPreset", e.target.value)}
                  placeholder="Ej. Número de contrato/servicio"
                />
                {errors.refPreset && <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{errors.refPreset}</p>}
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              <div>
                <label htmlFor="customName" style={label}>Nombre del servicio</label>
                <input
                  id="customName"
                  style={input}
                  value={form.customName}
                  onChange={(e) => setField("customName", e.target.value)}
                  placeholder="Ej. Agua Municipal Xalapa"
                />
                {errors.customName && <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{errors.customName}</p>}
              </div>

              <div>
                <label htmlFor="customConvenio" style={label}>Número de convenio</label>
                <input
                  id="customConvenio"
                  inputMode="numeric"
                  style={input}
                  value={form.customConvenio}
                  onChange={(e) => setField("customConvenio", e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="Solo dígitos"
                />
                {errors.customConvenio && <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{errors.customConvenio}</p>}
              </div>

              <div>
                <label htmlFor="customRef" style={label}>Referencia</label>
                <input
                  id="customRef"
                  style={input}
                  value={form.customRef}
                  onChange={(e) => setField("customRef", e.target.value)}
                  placeholder="Número de referencia del servicio"
                />
                {errors.customRef && <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{errors.customRef}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Monto */}
        <div style={fieldCard}>
          <div style={legend}>Monto</div>
          <label htmlFor="amount" style={label}>Cantidad a pagar (MXN)</label>
          <input
            id="amount"
            style={input}
            inputMode="decimal"
            value={form.amountStr}
            onChange={(e) => setField("amountStr", e.target.value)}
            placeholder="0.00"
          />
          <p style={small}>
            {amount ? `Se pagarán ${toMXN(amount)}` : "Ej. 350.00"}
            {selectedSource && amount > 0 && (
              <> · Saldo en {selectedSource.alias}: <b>{toMXN(selectedSource.balance)}</b></>
            )}
          </p>
          {errors.amountStr && <p style={{ fontSize: "0.85rem", color: "#f87171" }}>{errors.amountStr}</p>}
        </div>

        {/* Resumen */}
        <div style={fieldCard}>
          <div style={legend}>Resumen</div>
          <div style={{ fontSize: "0.95rem", color: subtleText }}>
            <div><b>Cuenta de origen:</b> {selectedSource?.alias} · {selectedSource?.bank} · **** {selectedSource?.number.slice(-4)}</div>
            <div><b>Servicio:</b> {summaryName}</div>
            <div><b>Convenio:</b> {summaryConvenio}</div>
            <div><b>Referencia:</b> {summaryRef || "-"}</div>
            <div><b>Monto:</b> {toMXN(amount)}</div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button
            onClick={onBack}
            style={ghostBtn}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Cancelar
          </button>
          <button
            onClick={pay}
            disabled={submitting}
            style={{ ...primaryBtn, backgroundColor: accentColor, opacity: submitting ? 0.8 : 1 }}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            onMouseDown={onPressIn}
            onMouseUp={onPressOut}
          >
            {submitting ? "Procesando..." : "Pagar ahora"}
          </button>
        </div>

        {/* Toast */}
        {toast && toast.type !== "success" && (
          <div style={toastBox(toast.type)}>{toast.msg}</div>
        )}

        {/* Modal de éxito */}
        {successOpen && (
          <div
            role="dialog"
            aria-modal="true"
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "grid", placeItems: "center", padding: 16, zIndex: 60 }}
          >
            <div style={{
              width: "100%", maxWidth: 420, background: cardColor,
              border: `1px solid ${borderColor}`, borderRadius: 18, padding: 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)", textAlign: "center", color: textColor
            }}>
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>¡Pago realizado!</h3>
              <p style={{ color: subtleText, fontSize: "0.95rem", marginBottom: 12 }}>
                Tu pago se realizó correctamente.
              </p>
              <div style={{
                border: `1px solid ${borderColor}`, borderRadius: 12, padding: 12,
                textAlign: "left", marginBottom: 12, fontSize: "0.95rem", color: textColor, background: inputBg
              }}>
                <div><b>Cuenta de origen:</b> {selectedSource?.alias} · **** {selectedSource?.number.slice(-4)}</div>
                <div><b>Servicio:</b> {summaryName}</div>
                <div><b>Convenio:</b> {summaryConvenio}</div>
                <div><b>Referencia:</b> {summaryRef || "-"}</div>
                <div><b>Monto:</b> {toMXN(amount)}</div>
                <div><b>Folio:</b> {`SIM-${Date.now().toString().slice(-6)}`}</div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  onClick={() => setSuccessOpen(false)}
                  style={ghostBtn}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Hacer otro pago
                </button>
                <button
                  onClick={() => { setSuccessOpen(false); onBack?.(); }}
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
