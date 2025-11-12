import React, { useMemo, useState, useEffect } from "react";
import logo from "../assets/logo.png";
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

// 🔊 Función de lectura accesible
function speakText(text, userSettings) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  if (!userSettings?.needsVoiceAssistant && !userSettings?.usesScreenReader)
    return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch {}
}

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
        {
          id: "m1",
          concept: "Pago nómina",
          amount: 8200.0,
          date: "2025-11-08",
          type: "in",
        },
        {
          id: "m2",
          concept: "Transferencia a Ahorros",
          amount: -500.0,
          date: "2025-11-07",
          type: "out",
        },
        {
          id: "m3",
          concept: "Supermercado",
          amount: -785.4,
          date: "2025-11-06",
          type: "out",
        },
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
        {
          id: "m4",
          concept: "Abono desde Nómina",
          amount: 500.0,
          date: "2025-11-07",
          type: "in",
        },
        {
          id: "m5",
          concept: "Intereses",
          amount: 35.2,
          date: "2025-11-01",
          type: "in",
        },
      ],
    },
  ];

  // ===== Estado =====
  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [toast, setToast] = useState(null); // {type, msg}
  const [successOpen, setSuccessOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveForm, setMoveForm] = useState({
    from: accounts[0].id,
    to: accounts[1].id,
    amountStr: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ===== Helpers =====
  const sel = useMemo(
    () => accounts.find((a) => a.id === selectedId),
    [selectedId]
  );
  const totalBalance = useMemo(
    () => accounts.reduce((s, a) => s + a.balance, 0),
    []
  );
  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(n || 0);
  const toNumber = (v) => {
    const x = String(v)
      .replace(",", ".")
      .replace(/[^\d.]/g, "");
    const n = Number.parseFloat(x);
    return Number.isFinite(n) ? n : 0;
  };

  // ===== Copiar y compartir =====
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
      setToast({ type: "success", msg: `${label} copiado al portapapeles` });
      speakText(`${label} copiado al portapapeles`, userSettings);
      setTimeout(() => setToast(null), 2000);
    } catch {
      setToast({ type: "error", msg: `No se pudo copiar ${label}` });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const shareAccount = async () => {
    const txt = `${sel.alias} - ${sel.bank}\nCLABE: ${sel.clabe}\nCuenta: ${sel.accountNumber}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Datos de cuenta", text: txt });
        setToast({ type: "success", msg: "Compartido" });
        speakText("Datos compartidos", userSettings);
        setTimeout(() => setToast(null), 1600);
      } catch {}
    } else copyToClipboard(txt, "Datos de cuenta");
  };

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

  // ===== Layout =====
  const container = {
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "30px 20px",
    backgroundColor: bgColor,
    color: textColor,
    fontFamily,
  };
  const shell = {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };
  const fieldCard = {
    background: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 18,
    padding: 16,
  };
  const h1 = {
    fontSize: "1.4rem",
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
  };
  const small = { fontSize: "0.85rem", color: subtleText };
  const ghostBtn = {
    border: `1px solid ${borderColor}`,
    borderRadius: "12px",
    background: cardColor,
    color: textColor,
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: fontSizeBase,
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
  });

  // ===== Lectura inicial =====
  useEffect(() => {
    speakText(
      `Saldo total de todas tus cuentas: ${toMXN(
        totalBalance
      )}. Cuenta seleccionada: ${sel.alias}`,
      userSettings
    );
  }, [totalBalance, sel, userSettings]);

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        {/* Header */}
        <div style={{ position: "relative", marginBottom: "25px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{ ...ghostBtn, position: "absolute", top: 0, left: 0 }}
              onFocus={() => speakText("Volver", userSettings)}
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
                width: 50,
                height: 50,
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "white",
              }}
            />
            <p>B-Accesible</p>
          </div>
        </div>
              <h1 style={h1}>Consultar saldos </h1>
        {/* Tarjeta total + ocultar montos */}
        <div style={fieldCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FaWallet /> <div style={{ fontWeight: 700 }}>Saldo total</div>
            </div>
            <button
              onClick={() => {
                setHideAmounts(!hideAmounts);
                speakText(
                  hideAmounts ? "Montos visibles" : "Montos ocultos",
                  userSettings
                );
              }}
              aria-label="Ocultar/mostrar montos"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: textColor,
              }}
            >
              {hideAmounts ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>
            {hideAmounts ? "••••••" : toMXN(totalBalance)}
          </div>
          <div style={small}>Suma de todas tus cuentas</div>
        </div>

        {/* Selector de cuentas */}
        <div style={fieldCard}>
          <div
            style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 8 }}
          >
            Tus cuentas
          </div>
          <div
            style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}
          >
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setSelectedId(acc.id);
                  speakText(`Cuenta seleccionada: ${acc.alias}`, userSettings);
                }}
                style={chip(selectedId === acc.id)}
                aria-label={`Seleccionar ${acc.alias}`}
              >
                <div style={{ fontWeight: 700 }}>{acc.alias}</div>
                <div style={small}>{acc.accountNumber}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle cuenta */}
        <div style={fieldCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                {sel.alias}
              </div>
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
                <div style={{ fontWeight: 700, letterSpacing: 1 }}>
                  {sel.clabe}
                </div>
                <button
                  onClick={() => copyToClipboard(sel.clabe, "CLABE")}
                  aria-label="Copiar CLABE"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                  onFocus={() => speakText("Copiar CLABE", userSettings)}
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
                  onClick={() =>
                    copyToClipboard(sel.accountNumber, "Número de cuenta")
                  }
                  aria-label="Copiar número de cuenta"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: accentColor,
                  }}
                  onFocus={() =>
                    speakText("Copiar número de cuenta", userSettings)
                  }
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={shareAccount}
              style={ghostBtn}
              onFocus={() => speakText("Compartir cuenta", userSettings)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  justifyContent: "center",
                }}
              >
                <FaShareAlt /> Compartir
              </div>
            </button>
            <button
              onClick={() =>
                copyToClipboard(
                  `CLABE: ${sel.clabe}\nCuenta: ${sel.accountNumber}`,
                  "Datos"
                )
              }
              style={ghostBtn}
              onFocus={() => speakText("Copiar datos de cuenta", userSettings)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  justifyContent: "center",
                }}
              >
                <FaCopy /> Copiar datos
              </div>
            </button>
            <button
              onClick={() => {
                setMoveOpen(true);
                speakText("Mover dinero entre cuentas", userSettings);
              }}
              style={primaryBtn}
              onFocus={() =>
                speakText("Mover dinero entre cuentas", userSettings)
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  justifyContent: "center",
                }}
              >
                <FaExchangeAlt /> Mover $
              </div>
            </button>
          </div>
        </div>

        {/* Movimientos recientes */}
        <div style={fieldCard}>
          <div
            style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 8 }}
          >
            Movimientos recientes
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {sel.movements.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${borderColor}`,
                  paddingBottom: 6,
                }}
              >
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    {m.concept}
                  </div>
                  <div style={small}>
                    {new Date(m.date).toLocaleDateString("es-MX")}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: m.amount >= 0 ? "#22c55e" : "#f87171",
                  }}
                >
                  {hideAmounts
                    ? m.amount >= 0
                      ? "+•••"
                      : "−•••"
                    : `${m.amount >= 0 ? "+" : "−"}${toMXN(
                        Math.abs(m.amount)
                      )}`}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => {
                setToast({
                  type: "success",
                  msg: "Descargando estado de cuenta...",
                });
                speakText("Descargando estado de cuenta", userSettings);
                setTimeout(() => setToast(null), 1600);
              }}
              style={ghostBtn}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaDownload /> Estado de cuenta
              </div>
            </button>
            <button
              onClick={() => {
                setToast({
                  type: "info",
                  msg: "Próximamente QR para depósitos.",
                });
                speakText("Próximamente QR para depósitos", userSettings);
                setTimeout(() => setToast(null), 1600);
              }}
              style={ghostBtn}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaQrcode /> QR depósito
              </div>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            style={{
              borderRadius: 12,
              padding: 10,
              fontSize: "0.95rem",
              border:
                toast.type === "success"
                  ? "1px solid #86efac"
                  : toast.type === "error"
                  ? "1px solid #fca5a5"
                  : `1px solid ${borderColor}`,
              background:
                toast.type === "success"
                  ? isDark
                    ? "#052e1b"
                    : "#f0fdf4"
                  : toast.type === "error"
                  ? isDark
                    ? "#3a0d0d"
                    : "#fef2f2"
                  : isDark
                  ? "#0b1220"
                  : "#eff6ff",
              color: textColor,
            }}
          >
            {toast.msg}
          </div>
        )}

        {/* Modal mover dinero */}
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
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                background: cardColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 18,
                padding: 16,
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                color: textColor,
              }}
            >
              <h3
                style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}
              >
                Transferir entre mis cuentas
              </h3>
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div style={small}>Cuenta origen</div>
                  <select
                    value={moveForm.from}
                    onChange={(e) =>
                      setMoveForm((f) => ({ ...f, from: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${borderColor}`,
                      background: inputBg,
                      color: textColor,
                      fontSize: fontSizeBase,
                    }}
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.alias} — {a.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div style={small}>Cuenta destino</div>
                  <select
                    value={moveForm.to}
                    onChange={(e) =>
                      setMoveForm((f) => ({ ...f, to: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${borderColor}`,
                      background: inputBg,
                      color: textColor,
                      fontSize: fontSizeBase,
                    }}
                  >
                    {accounts
                      .filter((a) => a.id !== moveForm.from)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.alias} — {a.accountNumber}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <div style={small}>Monto</div>
                  <input
                    inputMode="decimal"
                    value={moveForm.amountStr}
                    onChange={(e) =>
                      setMoveForm((f) => ({ ...f, amountStr: e.target.value }))
                    }
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${borderColor}`,
                      background: inputBg,
                      color: textColor,
                      fontSize: fontSizeBase,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button onClick={() => setMoveOpen(false)} style={ghostBtn}>
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    const amt = toNumber(moveForm.amountStr);
                    if (!amt || amt <= 0) {
                      setToast({
                        type: "error",
                        msg: "Ingresa un monto válido.",
                      });
                      speakText("Monto inválido", userSettings);
                      setTimeout(() => setToast(null), 1600);
                      return;
                    }
                    setSubmitting(true);
                    await new Promise((r) => setTimeout(r, 900));
                    setSubmitting(false);
                    setMoveOpen(false);
                    setSuccessOpen(true);
                  }}
                  disabled={submitting}
                  style={{
                    ...primaryBtn,
                    backgroundColor: accentColor,
                    opacity: submitting ? 0.8 : 1,
                  }}
                >
                  {submitting ? "Procesando..." : "Transferir"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal éxito */}
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
              zIndex: 70,
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
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>
                ✅
              </div>
              <h3
                style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}
              >
                ¡Operación realizada!
              </h3>
              <p
                style={{
                  color: subtleText,
                  fontSize: "0.95rem",
                  marginBottom: 12,
                }}
              >
                Tu movimiento entre cuentas se completó correctamente.
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
                  <b>Origen:</b>{" "}
                  {accounts.find((a) => a.id === moveForm.from)?.alias}
                </div>
                <div>
                  <b>Destino:</b>{" "}
                  {accounts.find((a) => a.id === moveForm.to)?.alias}
                </div>
                <div>
                  <b>Monto:</b> {toMXN(toNumber(moveForm.amountStr))}
                </div>
                <div>
                  <b>Folio:</b> {`SIM-${Date.now().toString().slice(-6)}`}
                </div>
              </div>
              <div
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
              >
                <button onClick={() => setSuccessOpen(false)} style={ghostBtn}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
