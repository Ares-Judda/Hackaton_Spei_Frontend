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

  const toNumber = (v) => {
    const x = String(v).replace(",", ".").replace(/[^\d.]/g, "");
    const n = Number.parseFloat(x);
    return Number.isFinite(n) ? n : 0;
  };
  const amount = useMemo(() => toNumber(form.amountStr), [form.amountStr]);

  // ===== Estilos coherentes =====
  const palette = {
    primary: "#0078D4",
    bg: "#f0f0f0",
    card: "#ffffff",
    text: "#000",
    subtle: "#666",
    border: "#d1d5db",
  };

  const container = {
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: palette.bg,
    fontFamily: userSettings?.font || "Arial",
    fontSize: userSettings?.fontSize || "16px",
  };
  const shell = {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    color: palette.text,
  };
  const h1 = { fontSize: "22px", fontWeight: 600, marginBottom: "4px" };
  const fieldCard = {
    background: palette.card,
    border: `1px solid ${palette.border}`,
    borderRadius: 15,
    padding: 14,
  };
  const legend = { fontSize: 14, fontWeight: 600, marginBottom: 8 };
  const label = { fontSize: 13, fontWeight: 600 };
  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: `1px solid ${palette.border}`,
    outline: "none",
  };
  const small = { fontSize: 12, color: palette.subtle };
  const ghostBtn = {
    border: `1px solid ${palette.border}`,
    borderRadius: "12px",
    background: "#fff",
    padding: "8px 14px",
    cursor: "pointer",
  };
  const primaryBtn = {
    border: "none",
    borderRadius: "15px",
    backgroundColor: palette.primary,
    color: "#fff",
    fontWeight: "bold",
    padding: "12px 18px",
    minHeight: "44px",
    cursor: "pointer",
  };
  const chip = (active) => ({
    padding: "8px 10px",
    borderRadius: 10,
    border: active ? `2px solid ${palette.primary}` : `1px solid ${palette.border}`,
    background: active ? "#f0f8ff" : "#fff",
    cursor: "pointer",
    flex: 1,
    display: "grid",
    placeItems: "center",
    gap: 6,
  });
  const sourceChip = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: active ? `2px solid ${palette.primary}` : `1px solid ${palette.border}`,
    background: active ? "#f0f8ff" : "#fff",
    cursor: "pointer",
    display: "grid",
    gap: 4,
    textAlign: "left",
  });
  const toastBox = (type) => ({
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    border:
      type === "success" ? "1px solid #86efac" :
      type === "error"   ? "1px solid #fca5a5" :
                           "1px solid #bfdbfe",
    background:
      type === "success" ? "#f0fdf4" :
      type === "error"   ? "#fef2f2" :
                           "#eff6ff",
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  const summaryName = mode === "preset"
    ? presets.find((p) => p.id === selectedService)?.label || "Servicio"
    : form.customName || "Servicio personalizado";
  const summaryRef = mode === "preset" ? form.refPreset : form.customRef;
  const summaryConvenio = mode === "preset" ? "(automático)" : form.customConvenio || "-";

  // ===== Validación =====
  const validate = () => {
    const e = {};
    if (!amount || amount <= 0) e.amountStr = "Ingresa un monto mayor a 0.";
    if (amount > 150000) e.amountStr = "Máximo 150,000 MXN.";

    // Validar fondos en la cuenta de origen
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

  // Simulación de pago (sin backend): muestra éxito
  const pay = async (ev) => {
    ev?.preventDefault?.();
    if (!validate()) {
      setToast({ type: "error", msg: "Revisa los campos marcados." });
      return;
    }
    setSubmitting(true);
    try {
      // Aquí iría tu llamada real:
      // await payService({...})
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
          {onBack && <button onClick={onBack} style={ghostBtn}>← Volver</button>}
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
              >
                <div style={{ fontWeight: 700 }}>{acc.alias}</div>
                <div style={{ fontSize: 13, color: palette.subtle }}>
                  {acc.bank} · {acc.number.slice(-4).padStart(4, "•")}
                </div>
                <div style={{ fontSize: 13 }}>
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
              <div style={{ fontWeight: 600 }}>Servicios</div>
              <div style={small}>Agua/Luz/Internet</div>
            </button>
            <button onClick={() => setMode("custom")} style={chip(mode === "custom")}>
              <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
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
                    <div style={{ fontWeight: 600 }}>{p.label}</div>
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
                {errors.refPreset && <p style={{ fontSize: 12, color: "#b91c1c" }}>{errors.refPreset}</p>}
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
                {errors.customName && <p style={{ fontSize: 12, color: "#b91c1c" }}>{errors.customName}</p>}
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
                {errors.customConvenio && <p style={{ fontSize: 12, color: "#b91c1c" }}>{errors.customConvenio}</p>}
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
                {errors.customRef && <p style={{ fontSize: 12, color: "#b91c1c" }}>{errors.customRef}</p>}
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
          {errors.amountStr && <p style={{ fontSize: 12, color: "#b91c1c" }}>{errors.amountStr}</p>}
        </div>

        {/* Resumen */}
        <div style={fieldCard}>
          <div style={legend}>Resumen</div>
          <div style={{ fontSize: 14, color: palette.subtle }}>
            <div><b>Cuenta de origen:</b> {selectedSource?.alias} · {selectedSource?.bank} · **** {selectedSource?.number.slice(-4)}</div>
            <div><b>Servicio:</b> {summaryName}</div>
            <div><b>Convenio:</b> {summaryConvenio}</div>
            <div><b>Referencia:</b> {summaryRef || "-"}</div>
            <div><b>Monto:</b> {toMXN(amount)}</div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button onClick={onBack} style={ghostBtn}>Cancelar</button>
          <button onClick={pay} disabled={submitting} style={primaryBtn}>
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
            <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 15, padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>¡Pago realizado!</h3>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 12 }}>
                Tu pago se realizó correctamente.
              </p>
              <div style={{ border: "1px solid #d1d5db", borderRadius: 12, padding: 12, textAlign: "left", marginBottom: 12, fontSize: 14, color: "#444" }}>
                <div><b>Cuenta de origen:</b> {selectedSource?.alias} · **** {selectedSource?.number.slice(-4)}</div>
                <div><b>Servicio:</b> {summaryName}</div>
                <div><b>Convenio:</b> {summaryConvenio}</div>
                <div><b>Referencia:</b> {summaryRef || "-"}</div>
                <div><b>Monto:</b> {toMXN(amount)}</div>
                <div><b>Folio:</b> {`SIM-${Date.now().toString().slice(-6)}`}</div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button onClick={() => setSuccessOpen(false)} style={ghostBtn}>Hacer otro pago</button>
                <button onClick={() => { setSuccessOpen(false); onBack?.(); }} style={primaryBtn}>Ir al inicio</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
