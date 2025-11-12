import { useTransferController } from "../controllers/useTransferController";
import React, { useEffect, useState } from "react";

export default function TransferView({ onBack }) {
  const {
    accounts,
    form, errors, savedContacts, selectedContact, selectedSourceAccount,
    amount, risk, submitting, toast, confirmOpen,
    setField, submit, confirm, setConfirmOpen,
  } = useTransferController();

  const [successOpen, setSuccessOpen] = useState(false);

  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  // ===== estilos consistentes con Home =====
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
  };

  const shell = {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    color: palette.text,
  };

  const h1 = { fontSize: "22px", fontWeight: 600, marginBottom: "4px" };

  const fieldset = {
    display: "grid",
    gap: "10px",
    backgroundColor: palette.card,
    border: `1px solid ${palette.border}`,
    borderRadius: "15px",
    padding: "14px",
  };

  const legend = {
    padding: "0 6px",
    fontSize: "14px",
    fontWeight: 600,
  };

  const label = { fontSize: "14px", fontWeight: 500 };
  const hint = { fontSize: "12px", color: palette.subtle };
  const errorText = { fontSize: "12px", color: "#b91c1c" };

  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: `1px solid ${palette.border}`,
    outline: "none",
  };

  const radioRow = { display: "flex", gap: "16px", alignItems: "center" };

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

  const ghostBtn = {
    border: `1px solid ${palette.border}`,
    borderRadius: "12px",
    background: "#fff",
    padding: "8px 14px",
    cursor: "pointer",
  };

  const toastBox = (type) => ({
    borderRadius: "12px",
    padding: "10px",
    fontSize: "14px",
    border:
      type === "success" ? "1px solid #86efac" :
      type === "error"   ? "1px solid #fca5a5" :
      type === "warn"    ? "1px solid #fde68a" : "1px solid #bfdbfe",
    background:
      type === "success" ? "#f0fdf4" :
      type === "error"   ? "#fef2f2" :
      type === "warn"    ? "#fffbeb" : "#eff6ff",
  });

  useEffect(() => {
    if (toast?.type === "success") setSuccessOpen(true);
  }, [toast]);

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {onBack && (
            <button onClick={onBack} style={ghostBtn}>← Volver</button>
          )}
          <h1 style={h1}>Transferir dinero</h1>
        </div>

        {toast && toast.type !== "success" && (
          <div style={toastBox(toast.type)}>
            {toast.msg}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "grid", gap: "14px" }}>
          {/* Cuenta origen */}
          <fieldset style={fieldset}>
            <legend style={legend}>Cuenta origen</legend>
            <div>
              <label htmlFor="sourceAccountId" style={label}>Selecciona la cuenta desde la que enviarás</label>
              <select
                id="sourceAccountId"
                style={input}
                value={form.sourceAccountId}
                onChange={(e) => setField("sourceAccountId", e.target.value)}
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
                />
                Nuevo contacto
              </label>
            </div>

            {form.contactMode === "saved" ? (
              <div>
                <label htmlFor="contactId" style={label}>Selecciona un contacto</label>
                <select
                  id="contactId"
                  style={input}
                  value={form.contactId}
                  onChange={(e) => setField("contactId", e.target.value)}
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
                <div>
                  <label htmlFor="alias" style={label}>Alias / Nombre</label>
                  <input
                    id="alias"
                    style={input}
                    value={form.alias}
                    onChange={(e) => setField("alias", e.target.value)}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label htmlFor="clabe" style={label}>CLABE (18 dígitos)</label>
                  <input
                    id="clabe"
                    inputMode="numeric"
                    style={input}
                    value={form.clabe}
                    onChange={(e) =>
                      setField("clabe", e.target.value.replace(/[^\d]/g, "").slice(0, 18))
                    }
                    placeholder="__________"
                  />
                  {errors.clabe && <p style={errorText}>{errors.clabe}</p>}
                </div>
              </div>
            )}
          </fieldset>

          {/* Detalle */}
          <fieldset style={fieldset}>
            <legend style={legend}>Detalle</legend>

            <div>
              <div>
                <label htmlFor="amount" style={label}>Monto (MXN)</label>
                <input
                  id="amount"
                  style={input}
                  inputMode="decimal"
                  value={form.amountStr}
                  onChange={(e) => setField("amountStr", e.target.value)}
                  placeholder="0.00"
                />
                <p style={hint}>
                  {amount ? `Se enviarán ${toMXN(amount)}` : "Ej. 250.50"}
                  {selectedSourceAccount && amount
                    ? ` · Te quedarían ${toMXN(Math.max(0, selectedSourceAccount.balance - amount))}`
                    : ""}
                </p>
                {errors.amountStr && <p style={errorText}>{errors.amountStr}</p>}
              </div>

              <div>
                <label htmlFor="concepto" style={label}>Concepto</label>
                <input
                  id="concepto"
                  style={input}
                  value={form.concepto}
                  onChange={(e) => setField("concepto", e.target.value)}
                  placeholder="Pago de servicios / renta / etc."
                />
                {errors.concepto && <p style={errorText}>{errors.concepto}</p>}
              </div>
            </div>
          </fieldset>

          {/* Pie */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "14px", color: palette.subtle }}>
              Riesgo estimado:{" "}
              <b
                style={{
                  color:
                    risk.level === "alto" ? "#b91c1c" :
                    risk.level === "medio" ? "#a16207" : "#166534",
                }}
              >
                {risk.level.toUpperCase()}
              </b>{" "}
              · {risk.msg}
            </p>

            <button type="submit" disabled={submitting} style={primaryBtn}>
              {submitting ? "Procesando..." : "Continuar"}
            </button>
          </div>
        </form>

        {/* Modal de confirmación */}
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
                maxWidth: "400px",
                background: "#fff",
                borderRadius: "15px",
                padding: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                Confirma la transferencia
              </h3>
              <ul style={{ marginBottom: "12px", fontSize: "14px", color: palette.subtle }}>
                <li><b>Cuenta origen:</b> {selectedSourceAccount?.alias} — {selectedSourceAccount?.accountNumber}</li>
                <li><b>Destinatario:</b> {selectedContact?.alias}</li>
                <li><b>CLABE:</b> {selectedContact?.clabe}</li>
                <li><b>Monto:</b> {toMXN(amount)}</li>
                <li><b>Concepto:</b> {form.concepto}</li>
                {form.schedule === "later" && (
                  <li><b>Programación:</b> {new Date(form.scheduleDate).toLocaleString("es-MX")}</li>
                )}
              </ul>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={() => setConfirmOpen(false)} style={ghostBtn}>Cancelar</button>
                <button onClick={confirm} style={primaryBtn}>Confirmar y enviar</button>
              </div>
            </div>
          </div>
        )}

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
              padding: "16px",
              zIndex: 60,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "#fff",
                borderRadius: "15px",
                padding: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>
                ¡Transferencia enviada!
              </h3>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 12 }}>
                Tu operación se realizó correctamente.
              </p>

              <div
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 12,
                  padding: 12,
                  textAlign: "left",
                  marginBottom: 12,
                  fontSize: 14,
                  color: "#444",
                }}
              >
                <div><b>Cuenta origen:</b> {selectedSourceAccount?.alias}</div>
                <div><b>Monto:</b> {toMXN(amount)}</div>
                {selectedContact?.alias && (
                  <div><b>Destinatario:</b> {selectedContact.alias}</div>
                )}
                {form.concepto && <div><b>Concepto:</b> {form.concepto}</div>}
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  onClick={() => setSuccessOpen(false)}
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    background: "#fff",
                    padding: "8px 14px",
                    cursor: "pointer",
                  }}
                >
                  Hacer otra transferencia
                </button>
                <button
                  onClick={() => {
                    setSuccessOpen(false);
                    onBack?.();
                  }}
                  style={{
                    border: "none",
                    borderRadius: "15px",
                    backgroundColor: "#0078D4",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "12px 18px",
                    minHeight: "44px",
                    cursor: "pointer",
                  }}
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
