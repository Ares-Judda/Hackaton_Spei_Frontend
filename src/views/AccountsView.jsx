import React, { useMemo, useState } from "react";
import {
  FaWallet,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaDownload,
  FaExchangeAlt,
  FaQrcode,
  FaShareAlt,
} from "react-icons/fa";

export default function AccountsView({ userSettings, onBack }) {
  // ===== Datos simulados =====
  const accounts = [
    {
      id: "acc1",
      alias: "Cuenta Nómina",
      clabe: "002010012345678901",
      accountNumber: "1234 5678 9012 3456",
      bank: "Banco Inclusivo",
      balance: 12543.75,
      currency: "MXN",
      movements: [
        { id: "m1", concept: "Pago nómina", amount: 8200.0, date: "2025-11-08", type: "in" },
        { id: "m2", concept: "Transferencia a Ahorros", amount: -500.0, date: "2025-11-07", type: "out" },
        { id: "m3", concept: "Supermercado", amount: -785.4, date: "2025-11-06", type: "out" },
      ],
    },
    {
      id: "acc2",
      alias: "Ahorros",
      clabe: "012180001234567891",
      accountNumber: "6543 2109 8765 4321",
      bank: "Banco Inclusivo",
      balance: 32450.0,
      currency: "MXN",
      movements: [
        { id: "m4", concept: "Abono desde Nómina", amount: 500.0, date: "2025-11-07", type: "in" },
        { id: "m5", concept: "Intereses", amount: 35.2, date: "2025-11-01", type: "in" },
      ],
    },
  ];

  // ===== Estado =====
  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [toast, setToast] = useState(null); // {type, msg}
  const [successOpen, setSuccessOpen] = useState(false);

  // Modal de transferencia interna
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveForm, setMoveForm] = useState({ from: accounts[0].id, to: accounts[1].id, amountStr: "" });
  const [submitting, setSubmitting] = useState(false);

  // ===== Helpers =====
  const sel = useMemo(() => accounts.find(a => a.id === selectedId), [selectedId]);
  const totalBalance = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), []);
  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  const copyToClipboard = async (text, label) => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setToast({ type: "success", msg: `${label} copiado al portapapeles` });
      setTimeout(() => setToast(null), 2000);
    } catch {
      setToast({ type: "error", msg: `No se pudo copiar ${label}` });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const shareAccount = async () => {
    const txt = `${sel.alias} - ${sel.bank}
CLABE: ${sel.clabe}
Cuenta: ${sel.accountNumber}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Datos de cuenta", text: txt });
        setToast({ type: "success", msg: "Compartido" });
        setTimeout(() => setToast(null), 1600);
      } catch { /* cancelado */ }
    } else {
      copyToClipboard(txt, "Datos de cuenta");
    }
  };

  const toNumber = (v) => {
    const x = String(v).replace(",", ".").replace(/[^\d.]/g, "");
    const n = Number.parseFloat(x);
    return Number.isFinite(n) ? n : 0;
  };

  // ===== Estilos (coherentes con Home/Transfer/Receive) =====
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

  const fieldCard = {
    background: palette.card,
    border: `1px solid ${palette.border}`,
    borderRadius: 15,
    padding: 14,
  };

  const h1 = { fontSize: "22px", fontWeight: 600, marginBottom: "4px" };
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
    gap: 4,
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

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onBack && <button onClick={onBack} style={ghostBtn}>← Volver</button>}
          <h1 style={h1}>Saldo y cuentas</h1>
        </div>

        {/* Tarjeta total + ocultar montos */}
        <div style={fieldCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FaWallet /> <div style={{ fontWeight: 700 }}>Saldo total</div>
            </div>
            <button
              onClick={() => setHideAmounts(!hideAmounts)}
              aria-label="Ocultar/mostrar montos"
              style={{ border: "none", background: "transparent", cursor: "pointer" }}
            >
              {hideAmounts ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>
            {hideAmounts ? "••••••" : toMXN(totalBalance)}
          </div>
          <div style={small}>Suma de todas tus cuentas</div>
        </div>

        {/* Selector de cuenta */}
        <div style={fieldCard}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Tus cuentas</div>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedId(acc.id)}
                style={chip(selectedId === acc.id)}
                aria-label={`Seleccionar ${acc.alias}`}
              >
                <div style={{ fontWeight: 700 }}>{acc.alias}</div>
                <div style={small}>{acc.accountNumber}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle de la cuenta seleccionada */}
        <div style={fieldCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{sel.alias}</div>
              <div style={small}>{sel.bank}</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {hideAmounts ? "••••••" : toMXN(sel.balance)}
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div style={small}>CLABE</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 700, letterSpacing: 1 }}>{sel.clabe}</div>
                <button
                  onClick={() => copyToClipboard(sel.clabe, "CLABE")}
                  aria-label="Copiar CLABE"
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: palette.primary }}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
            <div>
              <div style={small}>Número de cuenta</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>{sel.accountNumber}</div>
                <button
                  onClick={() => copyToClipboard(sel.accountNumber, "Número de cuenta")}
                  aria-label="Copiar número de cuenta"
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: palette.primary }}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={shareAccount} style={{ flex: 1, ...ghostBtn }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <FaShareAlt /> Compartir
              </div>
            </button>
            <button onClick={() => copyToClipboard(`CLABE: ${sel.clabe}\nCuenta: ${sel.accountNumber}`, "Datos")} style={{ flex: 1, ...ghostBtn }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <FaCopy /> Copiar datos
              </div>
            </button>
            <button onClick={() => setMoveOpen(true)} style={{ flex: 1, ...primaryBtn }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <FaExchangeAlt /> Mover $
              </div>
            </button>
          </div>
        </div>

        {/* Movimientos */}
        <div style={fieldCard}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Movimientos recientes</div>
          <div style={{ display: "grid", gap: 8 }}>
            {sel.movements.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${palette.border}`,
                  paddingBottom: 6,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.concept}</div>
                  <div style={small}>{new Date(m.date).toLocaleDateString("es-MX")}</div>
                </div>
                <div style={{ fontWeight: 700, color: m.amount >= 0 ? "#166534" : "#b91c1c" }}>
                  {hideAmounts ? (m.amount >= 0 ? "+•••" : "−•••") : `${m.amount >= 0 ? "+" : "−"}${toMXN(Math.abs(m.amount))}`}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => setToast({ type: "success", msg: "Descargando estado de cuenta..." }) || setTimeout(() => setToast(null), 1600)}
              style={{ flex: 1, ...ghostBtn }}
            >
              <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                <FaDownload /> Estado de cuenta
              </div>
            </button>
            <button
              onClick={() => setToast({ type: "info", msg: "Próximamente QR para depósitos." }) || setTimeout(() => setToast(null), 1600)}
              style={{ flex: 1, ...ghostBtn }}
            >
              <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                <FaQrcode /> QR depósito
              </div>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={toastBox(toast.type)}>{toast.msg}</div>
        )}

        {/* Modal mover dinero entre cuentas */}
        {moveOpen && (
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
            <div style={{
              width: "100%", maxWidth: 400, background: "#fff",
              borderRadius: 15, padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                Transferir entre mis cuentas
              </h3>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div style={small}>Cuenta origen</div>
                  <select
                    value={moveForm.from}
                    onChange={(e) => setMoveForm((f) => ({ ...f, from: e.target.value }))}
                    style={{
                      width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${palette.border}`,
                    }}
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>{a.alias} — {a.accountNumber}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={small}>Cuenta destino</div>
                  <select
                    value={moveForm.to}
                    onChange={(e) => setMoveForm((f) => ({ ...f, to: e.target.value }))}
                    style={{
                      width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${palette.border}`,
                    }}
                  >
                    {accounts
                      .filter((a) => a.id !== moveForm.from)
                      .map((a) => (
                        <option key={a.id} value={a.id}>{a.alias} — {a.accountNumber}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <div style={small}>Monto</div>
                  <input
                    inputMode="decimal"
                    value={moveForm.amountStr}
                    onChange={(e) => setMoveForm((f) => ({ ...f, amountStr: e.target.value }))}
                    placeholder="0.00"
                    style={{
                      width: "100%", padding: 10, borderRadius: 10, border: `1px solid ${palette.border}`,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={() => setMoveOpen(false)} style={ghostBtn}>Cancelar</button>
                <button
                  onClick={async () => {
                    const amt = toNumber(moveForm.amountStr);
                    if (!amt || amt <= 0) {
                      setToast({ type: "error", msg: "Ingresa un monto válido." });
                      setTimeout(() => setToast(null), 1600);
                      return;
                    }
                    setSubmitting(true);
                    // Simulación de proceso
                    await new Promise((r) => setTimeout(r, 900));
                    setSubmitting(false);
                    setMoveOpen(false);
                    setSuccessOpen(true);
                  }}
                  disabled={submitting}
                  style={primaryBtn}
                >
                  {submitting ? "Procesando..." : "Transferir"}
                </button>
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
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
              display: "grid", placeItems: "center", padding: 16, zIndex: 70
            }}
          >
            <div style={{
              width: "100%", maxWidth: 400, background: "#fff", borderRadius: 15,
              padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.15)", textAlign: "center"
            }}>
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>¡Operación realizada!</h3>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 12 }}>
                Tu movimiento entre cuentas se completó correctamente.
              </p>
              <div style={{
                border: "1px solid #d1d5db", borderRadius: 12, padding: 12,
                textAlign: "left", marginBottom: 12, fontSize: 14, color: "#444"
              }}>
                <div><b>Origen:</b> {accounts.find(a => a.id === moveForm.from)?.alias}</div>
                <div><b>Destino:</b> {accounts.find(a => a.id === moveForm.to)?.alias}</div>
                <div><b>Monto:</b> {toMXN(toNumber(moveForm.amountStr))}</div>
                <div><b>Folio:</b> {`SIM-${Date.now().toString().slice(-6)}`}</div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button onClick={() => setSuccessOpen(false)} style={ghostBtn}>Aceptar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
