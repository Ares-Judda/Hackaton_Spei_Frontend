import React, { useState } from "react";
import logo from "../assets/logo.png";
import {
  FaCreditCard,
  FaUniversity,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaTrash,
} from "react-icons/fa";

export default function CardsView({ userSettings, onBack }) {
  // ===== Datos simulados =====
  const [myCards, setMyCards] = useState([
    {
      id: "c1",
      alias: "Crédito Principal",
      holder: "Juan Pérez",
      bank: "Banco Inclusivo",
      brand: "VISA",
      number: "4111111111111111",
      exp: "12/27",
      cvv: "123",
      external: false,
      movements: [
        { id: "m1", date: "2025-11-09", desc: "Amazon MX", amount: -599.0 },
        { id: "m2", date: "2025-11-06", desc: "Pago recibido (bono)", amount: 1500.0 },
        { id: "m3", date: "2025-11-01", desc: "Spotify", amount: -129.0 },
      ],
    },
    {
      id: "c2",
      alias: "Débito Nómina",
      holder: "Juan Pérez",
      bank: "Banco Inclusivo",
      brand: "Mastercard",
      number: "5555555555554444",
      exp: "08/26",
      cvv: "777",
      external: false,
      movements: [
        { id: "m4", date: "2025-11-08", desc: "Supermercado", amount: -842.35 },
        { id: "m5", date: "2025-11-05", desc: "Café", amount: -58.0 },
      ],
    },
  ]);

  const [otherCards, setOtherCards] = useState([
    {
      id: "e1",
      alias: "Crédito Tienda",
      holder: "Juan Pérez",
      bank: "Banco Comercial",
      brand: "VISA",
      number: "4000000000000002",
      exp: "04/28",
      cvv: "321",
      external: true,
      movements: [
        { id: "m6", date: "2025-11-07", desc: "Tienda departamental", amount: -1299.9 },
        { id: "m7", date: "2025-11-02", desc: "Devolución", amount: 1299.9 },
      ],
    },
  ]);

  // ===== Estado UI =====
  const [hideNumbers, setHideNumbers] = useState(true);
  const [toast, setToast] = useState(null); // {type, msg}
  const [addOpen, setAddOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailCard, setDetailCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form para nueva tarjeta
  const [form, setForm] = useState({
    alias: "",
    holder: "",
    bank: "",
    brand: "VISA",
    number: "",
    exp: "",
    cvv: "",
    external: false,
  });

  // ===== THEME =====
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
  const danger = isHighContrast ? "#ff5c5c" : "#b91c1c";

  const fontSizeBase = userSettings?.fontSize || "0.95rem";
  const fontFamily = userSettings?.font || "system-ui, -apple-system, Segoe UI, Roboto, Arial";

  // ===== Estilos =====
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
  const fieldCard = {
    background: cardColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 18,
    padding: 16,
    boxShadow: isDark
      ? "0 4px 10px rgba(0,0,0,0.25)"
      : "0 4px 10px rgba(0,0,0,0.08)",
  };
  const h1 = { fontSize: "1.4rem", fontWeight: 700, margin: 0, textAlign: "center" };
  const label = { fontSize: fontSizeBase, fontWeight: 700, color: textColor };
  const small = { fontSize: "0.85rem", color: subtleText };
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
  const chip = {
    padding: "8px 10px",
    borderRadius: 12,
    border: `1px solid ${borderColor}`,
    background: cardColor,
    color: textColor,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };
  const toastBox = (type) => ({
    borderRadius: 12,
    padding: 10,
    fontSize: "0.95rem",
    border:
      type === "success"
        ? (isHighContrast ? "1px solid #22FFB2" : "1px solid #86efac")
        : type === "error"
          ? (isHighContrast ? "1px solid #FF5C5C" : "1px solid #fca5a5")
          : `1px solid ${borderColor}`,
    background:
      isHighContrast
        ? cardColor
        : type === "success"
          ? (isDark ? "#052e1b" : "#f0fdf4")
          : type === "error"
            ? (isDark ? "#3a0d0d" : "#fef2f2")
            : (isDark ? "#0b1220" : "#eff6ff"),
    color: textColor,
  });

  // Hovers/press
  const onHoverIn = (e) => (e.currentTarget.style.backgroundColor = buttonHover);
  const onHoverOut = (e) => (e.currentTarget.style.backgroundColor = accentColor);
  const onPressIn = (e) => (e.currentTarget.style.transform = "scale(0.98)");
  const onPressOut = (e) => (e.currentTarget.style.transform = "scale(1)");

  // ===== Helpers =====
  const maskNumber = (num) => {
    if (hideNumbers) return "•••• •••• •••• " + (num || "").slice(-4);
    return (num || "").replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

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
      setToast({ type: "success", msg: `${label} copiado` });
      speakText(`${label} copiado`);
      setTimeout(() => setToast(null), 1800);
    } catch {
      setToast({ type: "error", msg: `No se pudo copiar ${label}` });
      speakText(`No se pudo copiar ${label}`);
      setTimeout(() => setToast(null), 1800);
    }
  };

  const handleExpChange = (value) => {
    const digits = value.replace(/[^\d]/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    setForm((f) => ({ ...f, exp: formatted }));
  };

  const validateExp = (exp) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return "Formato MM/AA.";
    const mm = parseInt(exp.slice(0, 2), 10);
    if (mm < 1 || mm > 12) return "Mes inválido (01-12).";
    return null;
  };

  const validate = () => {
    const errs = {};
    const num = form.number.replace(/\s/g, "");
    if (!form.holder.trim()) errs.holder = "Titular requerido.";
    if (!/^\d{16}$/.test(num)) errs.number = "Número de 16 dígitos.";
    const expErr = validateExp(form.exp);
    if (expErr) errs.exp = expErr;
    if (!/^\d{3,4}$/.test(form.cvv)) errs.cvv = "CVV de 3 o 4 dígitos.";
    if (!form.bank.trim()) errs.bank = "Banco requerido.";
    if (!form.alias.trim()) errs.alias = "Alias requerido.";
    setErrors(errs);
    return errs;
  };

  const addCard = async (e) => {
    e?.preventDefault?.();
    const errs = validate();
    if (Object.keys(errs).length) {
      setToast({ type: "error", msg: "Revisa los campos marcados." });
      speakText("Revisa los campos marcados");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const newCard = {
        ...form,
        id: "n" + Date.now(),
        number: form.number.replace(/[^\d]/g, ""),
        movements: [
          {
            id: "m" + Math.random().toString(36).slice(2, 7),
            date: new Date().toISOString().slice(0, 10),
            desc: "Alta de tarjeta",
            amount: 0,
          },
        ],
      };
      if (newCard.external) setOtherCards((prev) => [newCard, ...prev]);
      else setMyCards((prev) => [newCard, ...prev]);

      setAddOpen(false);
      setSuccessOpen(true);
      setErrors({});
      setForm({
        alias: "",
        holder: "",
        bank: "",
        brand: "VISA",
        number: "",
        exp: "",
        cvv: "",
        external: false,
      });
      speakText("Tarjeta agregada correctamente");
    } finally {
      setSubmitting(false);
    }
  };

  const removeCard = (id, external) => {
    if (external) setOtherCards((prev) => prev.filter((c) => c.id !== id));
    else setMyCards((prev) => prev.filter((c) => c.id !== id));
    setToast({ type: "success", msg: "Tarjeta eliminada" });
    speakText("Tarjeta eliminada");
    setTimeout(() => setToast(null), 1200);
  };

  const openDetails = (card) => {
    setDetailCard(card);
    setDetailOpen(true);
    speakText(`Detalles de ${card.alias}`);
  };

  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  // ===== Lectura en voz =====
  function speakText(text) {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ position: "relative", marginBottom: "25px" }}>
          {onBack && (
            <button
              onClick={() => { onBack(); speakText("Volver"); }}
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


        <h1 style={h1}>Mis Tarjetas</h1>

        {/* Controles encabezado */}
        <div style={fieldCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={chip}>
              <FaCreditCard /> Tarjetas
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => setHideNumbers(!hideNumbers)}
                aria-label="Ocultar/mostrar números"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: textColor,
                }}
              >
                {hideNumbers ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                onClick={() => setAddOpen(true)}
                style={primaryBtn}
                onMouseEnter={onHoverIn}
                onMouseLeave={onHoverOut}
                onMouseDown={onPressIn}
                onMouseUp={onPressOut}
              >
                <FaPlus style={{ marginRight: 6 }} /> Añadir tarjeta
              </button>
            </div>
          </div>
        </div>

        {/* Tus tarjetas (propias) */}
        <div style={fieldCard}>
          <div
            style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 8 }}
          >
            Tus tarjetas
          </div>
          {myCards.length === 0 ? (
            <div style={small}>No tienes tarjetas propias registradas.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {myCards.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 14,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                    background:
                      isHighContrast
                        ? cardColor
                        : c.brand === "VISA"
                          ? (isDark ? "#0b1220" : "#f8fbff")
                          : c.brand === "Mastercard"
                            ? (isDark ? "#1b1410" : "#fff8f2")
                            : cardColor,
                    color: textColor,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{c.alias}</div>
                    <span
                      style={{
                        ...small,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <FaUniversity /> {c.bank}
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {maskNumber(c.number)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      color: subtleText,
                      fontSize: "0.9rem",
                    }}
                  >
                    <div>
                      <b>Titular:</b> {c.holder}
                    </div>
                    <div>
                      <b>Vence:</b> {c.exp}
                    </div>
                    <div>
                      <b>Marca:</b> {c.brand}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        copyToClipboard(c.number, "Número de tarjeta")
                      }
                      style={{
                        ...ghostBtn,
                        flex: 1,
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FaCopy /> Copiar número
                    </button>
                    <button
                      onClick={() => openDetails(c)}
                      style={{
                        ...ghostBtn,
                        flex: 1,
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => removeCard(c.id, false)}
                      style={{
                        ...ghostBtn,
                        flex: 1,
                        borderColor: danger,
                        color: danger,
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tarjetas de otros bancos */}
        <div style={fieldCard}>
          <div
            style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 8 }}
          >
            Tarjetas de otros bancos
          </div>
          {otherCards.length === 0 ? (
            <div style={small}>Aún no has vinculado tarjetas externas.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {otherCards.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 14,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                    /* en el map de otherCards, en el style del contenedor */
                    background: isHighContrast ? cardColor : isDark ? "#121528" : "#f9f9ff",

                    color: textColor,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{c.alias}</div>
                    <span
                      style={{
                        ...small,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <FaUniversity /> {c.bank}
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {maskNumber(c.number)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      color: subtleText,
                      fontSize: "0.9rem",
                    }}
                  >
                    <div>
                      <b>Titular:</b> {c.holder}
                    </div>
                    <div>
                      <b>Vence:</b> {c.exp}
                    </div>
                    <div>
                      <b>Marca:</b> {c.brand}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        copyToClipboard(c.number, "Número de tarjeta")
                      }
                      style={{
                        ...ghostBtn,
                        flex: 1,
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FaCopy /> Copiar número
                    </button>
                    <button
                      onClick={() => openDetails(c)}
                      style={{
                        ...ghostBtn,
                        flex: 1,
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => removeCard(c.id, true)}
                      style={{
                        ...ghostBtn,
                        flex: 1,
                        borderColor: danger,
                        color: danger,
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && <div style={toastBox(toast.type)}>{toast.msg}</div>}

        {/* Modal: Añadir tarjeta */}
        {addOpen && (
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
                color: textColor,
                borderRadius: 18,
                padding: 16,
                border: `1px solid ${borderColor}`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              }}
            >
              <h3
                style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}
              >
                Añadir nueva tarjeta
              </h3>

              <form onSubmit={addCard} style={{ display: "grid", gap: 10 }}>
                <div>
                  <label style={label}>Alias</label>
                  <input
                    style={input}
                    value={form.alias}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, alias: e.target.value }))
                    }
                    placeholder="Ej. Crédito Principal"
                  />
                  {errors.alias && (
                    <p style={{ color: danger, fontSize: "0.85rem" }}>
                      {errors.alias}
                    </p>
                  )}
                </div>

                <div>
                  <label style={label}>
                    Titular (como aparece en la tarjeta)
                  </label>
                  <input
                    style={input}
                    value={form.holder}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, holder: e.target.value }))
                    }
                    placeholder="Nombre Apellido"
                  />
                  {errors.holder && (
                    <p style={{ color: danger, fontSize: "0.85rem" }}>
                      {errors.holder}
                    </p>
                  )}
                </div>

                <div>
                  <label style={label}>Banco</label>
                  <input
                    style={input}
                    value={form.bank}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bank: e.target.value }))
                    }
                    placeholder="Ej. Banco Inclusivo"
                  />
                  {errors.bank && (
                    <p style={{ color: danger, fontSize: "0.85rem" }}>
                      {errors.bank}
                    </p>
                  )}
                </div>

                <div>
                  <label style={label}>Marca</label>
                  <select
                    style={input}
                    value={form.brand}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, brand: e.target.value }))
                    }
                  >
                    <option>VISA</option>
                    <option>Mastercard</option>
                    <option>AMEX</option>
                  </select>
                </div>

                <div>
                  <label style={label}>Número de tarjeta</label>
                  <input
                    inputMode="numeric"
                    style={input}
                    value={form.number}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        number: e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, 16),
                      }))
                    }
                    placeholder="16 dígitos"
                  />
                  {errors.number && (
                    <p style={{ color: danger, fontSize: "0.85rem" }}>
                      {errors.number}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  <div>
                    <label style={label}>Vencimiento (MM/AA)</label>
                    <input
                      style={input}
                      value={form.exp}
                      onChange={(e) => handleExpChange(e.target.value)}
                      placeholder="MM/AA"
                    />
                    {errors.exp && (
                      <p style={{ color: danger, fontSize: "0.85rem" }}>
                        {errors.exp}
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={label}>CVV</label>
                    <input
                      inputMode="numeric"
                      style={input}
                      value={form.cvv}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          cvv: e.target.value.replace(/[^\d]/g, "").slice(0, 4),
                        }))
                      }
                      placeholder="3 o 4 dígitos"
                    />
                    {errors.cvv && (
                      <p style={{ color: danger, fontSize: "0.85rem" }}>
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={form.external}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, external: e.target.checked }))
                    }
                  />
                  ¿Es de otro banco?
                </label>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAddOpen(false);
                      setErrors({});
                    }}
                    style={ghostBtn}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={primaryBtn}
                    onMouseEnter={onHoverIn}
                    onMouseLeave={onHoverOut}
                    onMouseDown={onPressIn}
                    onMouseUp={onPressOut}
                  >
                    {submitting ? "Guardando..." : "Guardar tarjeta"}
                  </button>
                </div>
              </form>
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
              padding: 16,
              zIndex: 70,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                background: cardColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 18,
                padding: 16,
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
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
                ¡Tarjeta guardada!
              </h3>
              <button
                onClick={() => setSuccessOpen(false)}
                style={ghostBtn}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* Modal de detalles con historial */}
        {detailOpen && detailCard && (
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
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                color: textColor,
              }}
            >
              <h3
                style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}
              >
                Detalles de tarjeta
              </h3>

              <div
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  background: inputBg,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{detailCard.alias}</div>
                  <span
                    style={{
                      ...small,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FaUniversity /> {detailCard.bank}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>
                  {hideNumbers
                    ? "•••• •••• •••• " + detailCard.number.slice(-4)
                    : detailCard.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    color: subtleText,
                    fontSize: "0.9rem",
                    marginTop: 6,
                  }}
                >
                  <div>
                    <b>Titular:</b> {detailCard.holder}
                  </div>
                  <div>
                    <b>Vence:</b> {detailCard.exp}
                  </div>
                  <div>
                    <b>Marca:</b> {detailCard.brand}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Movimientos
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  maxHeight: 260,
                  overflow: "auto",
                }}
              >
                {(detailCard.movements || []).map((m) => (
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
                      <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{m.desc}</div>
                      <div style={small}>{new Date(m.date).toLocaleDateString("es-MX")}</div>
                    </div>
                    <div style={{
                      fontWeight: 700,
                      color: m.amount >= 0
                        ? (isHighContrast ? "#22FFB2" : "#166534")
                        : (isHighContrast ? "#FF5C5C" : "#b91c1c")
                    }}>
                      {m.amount >= 0 ? "+" : "-"}{toMXN(Math.abs(m.amount))}
                    </div>
                  </div>
                ))}
                {(!detailCard.movements ||
                  detailCard.movements.length === 0) && (
                  <div style={small}>Sin movimientos.</div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button
                  onClick={() => setDetailOpen(false)}
                  style={ghostBtn}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.98)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast global al final para que no tape modales */}
      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 20,
            maxWidth: 520,
            width: "calc(100% - 40px)",
            ...toastBox(toast.type),
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
