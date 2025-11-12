import React, { useMemo, useState, useEffect } from "react";
import { FaCopy, FaQrcode, FaShareAlt, FaDownload } from "react-icons/fa";

export default function ReceiveView({ userSettings, onBack }) {
  const accounts = [
    { id: "acc1", alias: "Cuenta Nómina", clabe: "002010012345678901", accountNumber: "1234 5678 9012 3456", bank: "Banco Inclusivo", name: "Juan Pérez" },
    { id: "acc2", alias: "Ahorros", clabe: "012180001234567891", accountNumber: "6543 2109 8765 4321", bank: "Banco Inclusivo", name: "Juan Pérez" },
  ];

  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const selected = useMemo(() => accounts.find((a) => a.id === selectedId), [selectedId]);

  const [toast, setToast] = useState(null);
  const dismissToast = () => setToast(null);

  const [qrAmount, setQrAmount] = useState("");
  const [qrConcept, setQrConcept] = useState("");
  const [qrUrl, setQrUrl] = useState("");

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
  const borderColor = isHighContrast ? "#19e6ff" : isDark ? "#293548" : "#d1d5db";
  const subtleText = isHighContrast ? "#cccccc" : isDark ? "#94a3b8" : "#6b7280";

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
  const shell = { width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "18px" };
  const h1 = { fontSize: "1.4rem", fontWeight: 700, margin: 0 };
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
    boxShadow: isDark ? "0 4px 10px rgba(0,0,0,0.25)" : "0 4px 10px rgba(0,0,0,0.08)",
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
    background: type === "success" ? (isDark ? "#052e1b" : "#f0fdf4") : (isDark ? "#3a0d0d" : "#fef2f2"),
    color: textColor,
  });

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
  const onHoverIn = (e) => (e.currentTarget.style.backgroundColor = buttonHover);
  const onHoverOut = (e) => (e.currentTarget.style.backgroundColor = accentColor);
  const onPressIn = (e) => (e.currentTarget.style.transform = "scale(0.98)");
  const onPressOut = (e) => (e.currentTarget.style.transform = "scale(1)");

  // ===== Clipboard / share =====
  const copyToClipboard = async (text, label) => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setToast({ type: "success", msg: `${label} copiado` }); setTimeout(dismissToast, 1800);
    } catch {
      setToast({ type: "error", msg: `No se pudo copiar ${label}` }); setTimeout(dismissToast, 2000);
    }
  };

  const shareData = async () => {
    const text = `Envía a ${selected.name} (${selected.alias})
CLABE: ${selected.clabe}
Cuenta: ${selected.accountNumber}
Banco: ${selected.bank}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Datos para transferencia", text });
        setToast({ type: "success", msg: "Compartido" }); setTimeout(dismissToast, 1500);
      } catch { }
    } else {
      copyToClipboard(text, "Datos de transferencia");
    }
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
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}&cb=${cacheBust}`);
  };

  useEffect(() => { generateQr(); /* mount */ }, []);
  useEffect(() => { generateQr(); /* deps */ }, [selectedId, qrAmount, qrConcept]);

  const downloadQr = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `CoDiQR_${selected.alias}.png`;
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
    } catch {
      setToast({ type: "error", msg: "No se pudo descargar el QR" }); setTimeout(dismissToast, 1800);
    }
  };

  const shareQr = async () => {
    if (!qrUrl || !navigator.share || !navigator.canShare) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const file = new File([blob], `CoDiQR_${selected.alias}.png`, { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "QR de cobro", text: "Escanea para pagar (demo)", files: [file] });
      } else {
        await navigator.share({ title: "QR de cobro", text: qrUrl });
      }
    } catch { }
  };

  // ===== Render =====
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
          <h1 style={h1}>Recibir dinero</h1>
        </div>

        {/* Cuenta a recibir */}
        <div style={fieldCard}>
          <label style={label}>Cuenta a recibir</label>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedId(acc.id)}
                style={chip(selectedId === acc.id)}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                aria-label={`Seleccionar ${acc.alias}`}
              >
                <div style={{ fontWeight: 700 }}>{acc.alias}</div>
                <div style={small}>{acc.accountNumber}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Datos principales */}
        <div style={fieldCard}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{selected.name}</div>
          <div style={small}>{selected.bank}</div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <div>
              <div style={small}>CLABE</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 700, letterSpacing: 1 }}>{selected.clabe}</div>
                <button
                  onClick={() => copyToClipboard(selected.clabe, "CLABE")}
                  aria-label="Copiar CLABE"
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: accentColor }}
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            <div>
              <div style={small}>Número de cuenta</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>{selected.accountNumber}</div>
                <button
                  onClick={() => copyToClipboard(selected.accountNumber, "Número de cuenta")}
                  aria-label="Copiar número de cuenta"
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: accentColor }}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={() =>
                copyToClipboard(
                  `CLABE: ${selected.clabe}\nCuenta: ${selected.accountNumber}\nTitular: ${selected.name}\nBanco: ${selected.bank}`,
                  "Datos de transferencia"
                )
              }
              style={ghostBtn}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
              <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                <FaShareAlt /> Compartir
              </div>
            </button>
          </div>
        </div>

        {/* QR siempre visible */}
        <div style={fieldCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <FaQrcode />
            <div style={{ fontSize: 16, fontWeight: 700 }}>QR para cobrar</div>
          </div>

          <div style={{ display: "grid", placeItems: "center", gap: 10, marginBottom: 10 }}>
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
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <FaDownload style={{ marginRight: 6 }} /> Descargar
              </button>
              {navigator.share && (
                <button
                  onClick={shareQr}
                  type="button"
                  style={ghostBtn}
                  disabled={!qrUrl}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <FaShareAlt style={{ marginRight: 6 }} /> Compartir QR
                </button>
              )}
            </div>
          </div>

          {/* Opcionales SIN obligar */}
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <label style={label}>Monto (opcional)</label>
              <input
                style={input}
                inputMode="decimal"
                placeholder="0.00"
                value={qrAmount}
                onChange={(e) => setQrAmount(e.target.value.replace(",", ".").replace(/[^\d.]/g, "").slice(0, 12))}
              />
              <div style={small}>Puedes dejarlo vacío y la otra persona capturará el monto.</div>
            </div>

            <div>
              <label style={label}>Concepto (opcional)</label>
              <input
                style={input}
                placeholder="Ej. Cena, renta, préstamo"
                value={qrConcept}
                onChange={(e) => setQrConcept(e.target.value.slice(0, 60))}
              />
              <div style={small}>Este campo también puede ir vacío.</div>
            </div>
          </div>

          <div style={{ marginTop: 6, ...small }}>
            Este QR es de demostración. En producción, usa el formato oficial de CoDi.
          </div>
        </div>

        {toast && <div style={toastBox(toast.type)}>{toast.msg}</div>}
      </div>
    </div>
  );
}
