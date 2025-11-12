import React, { useState } from "react";
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
        { id: "m1", date: "2025-11-09", desc: "Amazon MX", amount: -599.00 },
        { id: "m2", date: "2025-11-06", desc: "Pago recibido (bono)", amount: 1500.00 },
        { id: "m3", date: "2025-11-01", desc: "Spotify", amount: -129.00 },
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
        { id: "m5", date: "2025-11-05", desc: "Café", amount: -58.00 },
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
        { id: "m6", date: "2025-11-07", desc: "Tienda departamental", amount: -1299.90 },
        { id: "m7", date: "2025-11-02", desc: "Devolución", amount: 1299.90 },
      ],
    },
  ]);

  // ===== Estado UI =====
  const [hideNumbers, setHideNumbers] = useState(true);
  const [toast, setToast] = useState(null);     // {type, msg}
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
    brand: "VISA",     // VISA | Mastercard | AMEX
    number: "",
    exp: "",
    cvv: "",
    external: false,
  });

  // ===== Helpers =====
  const palette = {
    primary: "#0078D4",
    bg: "#f0f0f0",
    card: "#ffffff",
    text: "#000",
    subtle: "#666",
    border: "#d1d5db",
    danger: "#b91c1c",
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
  const label = { fontSize: 13, fontWeight: 600 };
  const small = { fontSize: 12, color: palette.subtle };
  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: `1px solid ${palette.border}`,
    outline: "none",
  };
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
  const chip = {
    padding: "8px 10px",
    borderRadius: 10,
    border: `1px solid ${palette.border}`,
    background: "#fff",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };
  const toastBox = (type) => ({
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    border:
      type === "success" ? "1px solid #86efac" :
      type === "error"   ? "1px solid #fca5a5" :
                           "1px solid ${palette.border}",
    background:
      type === "success" ? "#f0fdf4" :
      type === "error"   ? "#fef2f2" :
                           "#eff6ff",
  });

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
      setTimeout(() => setToast(null), 1800);
    } catch {
      setToast({ type: "error", msg: `No se pudo copiar ${label}` });
      setTimeout(() => setToast(null), 1800);
    }
  };

  // === Formateo + validación MM/AA ===
  const handleExpChange = (value) => {
    // solo dígitos, max 4 => MM + AA
    const digits = value.replace(/[^\d]/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    setForm((f) => ({ ...f, exp: formatted }));
  };

  const validateExp = (exp) => {
    // Debe ser MM/AA con mes 01-12
    if (!/^\d{2}\/\d{2}$/.test(exp)) return "Formato MM/AA.";
    const mm = parseInt(exp.slice(0, 2), 10);
    if (mm < 1 || mm > 12) return "Mes inválido (01-12).";
    return null;
  };

  // Validación simple (número 16, CVV 3-4, etc.)
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
      return;
    }
    setSubmitting(true);
    try {
      // Simulación
      await new Promise((r) => setTimeout(r, 900));
      const newCard = {
        ...form,
        id: "n" + Date.now(),
        number: form.number.replace(/[^\d]/g, ""),
        movements: [
          { id: "m" + Math.random().toString(36).slice(2, 7), date: new Date().toISOString().slice(0,10), desc: "Alta de tarjeta", amount: 0 }
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
    } finally {
      setSubmitting(false);
    }
  };

  const removeCard = (id, external) => {
    if (external) setOtherCards((prev) => prev.filter((c) => c.id !== id));
    else setMyCards((prev) => prev.filter((c) => c.id !== id));
    setToast({ type: "success", msg: "Tarjeta eliminada" });
    setTimeout(() => setToast(null), 1200);
  };

  const openDetails = (card) => {
    setDetailCard(card);
    setDetailOpen(true);
  };

  const toMXN = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

  // ===== UI =====
  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onBack && <button onClick={onBack} style={ghostBtn}>← Volver</button>}
          <h1 style={h1}>Mis tarjetas</h1>
        </div>

        {/* Controles encabezado */}
        <div style={fieldCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={chip}><FaCreditCard /> Tarjetas</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => setHideNumbers(!hideNumbers)}
                aria-label="Ocultar/mostrar números"
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                {hideNumbers ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button onClick={() => setAddOpen(true)} style={primaryBtn}>
                <FaPlus style={{ marginRight: 6 }} /> Añadir tarjeta
              </button>
            </div>
          </div>
        </div>

        {/* Tus tarjetas (propias) */}
        <div style={fieldCard}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Tus tarjetas</div>
          {myCards.length === 0 ? (
            <div style={small}>No tienes tarjetas propias registradas.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {myCards.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: `1px solid ${palette.border}`,
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                    background:
                      c.brand === "VISA" ? "#f8fbff" :
                      c.brand === "Mastercard" ? "#fff8f2" : "#fff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700 }}>{c.alias}</div>
                    <span style={{ ...small, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <FaUniversity /> {c.bank}
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{maskNumber(c.number)}</div>
                  <div style={{ display: "flex", gap: 12, color: palette.subtle, fontSize: 13 }}>
                    <div><b>Titular:</b> {c.holder}</div>
                    <div><b>Vence:</b> {c.exp}</div>
                    <div><b>Marca:</b> {c.brand}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => copyToClipboard(c.number, "Número de tarjeta")}
                      style={{ ...ghostBtn, flex: 1, display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}
                    >
                      <FaCopy /> Copiar número
                    </button>
                    <button
                      onClick={() => openDetails(c)}
                      style={{ ...ghostBtn, flex: 1, display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => removeCard(c.id, false)}
                      style={{ ...ghostBtn, flex: 1, borderColor: palette.danger, color: palette.danger, display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}
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
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
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
                    border: `1px solid ${palette.border}`,
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                    background: "#f9f9ff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700 }}>{c.alias}</div>
                    <span style={{ ...small, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <FaUniversity /> {c.bank}
                    </span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{maskNumber(c.number)}</div>
                  <div style={{ display: "flex", gap: 12, color: palette.subtle, fontSize: 13 }}>
                    <div><b>Titular:</b> {c.holder}</div>
                    <div><b>Vence:</b> {c.exp}</div>
                    <div><b>Marca:</b> {c.brand}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => copyToClipboard(c.number, "Número de tarjeta")}
                      style={{ ...ghostBtn, flex: 1, display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}
                    >
                      <FaCopy /> Copiar número
                    </button>
                    <button
                      onClick={() => openDetails(c)}
                      style={{ ...ghostBtn, flex: 1, display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => removeCard(c.id, true)}
                      style={{ ...ghostBtn, flex: 1, borderColor: palette.danger, color: palette.danger, display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}
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
          <div role="dialog" aria-modal="true" style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "grid", placeItems: "center", padding: 16, zIndex: 60,
          }}>
            <div style={{
              width: "100%", maxWidth: 420, background: "#fff", borderRadius: 15,
              padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Añadir nueva tarjeta</h3>

              <form onSubmit={addCard} style={{ display: "grid", gap: 10 }}>
                <div>
                  <label style={label}>Alias</label>
                  <input
                    style={input}
                    value={form.alias}
                    onChange={(e) => setForm((f) => ({ ...f, alias: e.target.value }))}
                    placeholder="Ej. Crédito Principal"
                  />
                  {errors.alias && <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.alias}</p>}
                </div>

                <div>
                  <label style={label}>Titular (como aparece en la tarjeta)</label>
                  <input
                    style={input}
                    value={form.holder}
                    onChange={(e) => setForm((f) => ({ ...f, holder: e.target.value }))}
                    placeholder="Nombre Apellido"
                  />
                  {errors.holder && <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.holder}</p>}
                </div>

                <div>
                  <label style={label}>Banco</label>
                  <input
                    style={input}
                    value={form.bank}
                    onChange={(e) => setForm((f) => ({ ...f, bank: e.target.value }))}
                    placeholder="Ej. Banco Inclusivo"
                  />
                  {errors.bank && <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.bank}</p>}
                </div>

                <div>
                  <label style={label}>Marca</label>
                  <select
                    style={input}
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
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
                        number: e.target.value.replace(/[^\d]/g, "").slice(0, 16),
                      }))
                    }
                    placeholder="16 dígitos"
                  />
                  {errors.number && <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.number}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={label}>Vencimiento (MM/AA)</label>
                    <input
                      style={input}
                      value={form.exp}
                      onChange={(e) => handleExpChange(e.target.value)}
                      placeholder="MM/AA"
                    />
                    {errors.exp && <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.exp}</p>}
                  </div>
                  <div>
                    <label style={label}>CVV</label>
                    <input
                      inputMode="numeric"
                      style={input}
                      value={form.cvv}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, cvv: e.target.value.replace(/[^\d]/g, "").slice(0, 4) }))
                      }
                      placeholder="3 o 4 dígitos"
                    />
                    {errors.cvv && <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.cvv}</p>}
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={form.external}
                    onChange={(e) => setForm((f) => ({ ...f, external: e.target.checked }))}
                  />
                  ¿Es de otro banco?
                </label>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button type="button" onClick={() => { setAddOpen(false); setErrors({}); }} style={ghostBtn}>Cancelar</button>
                  <button type="submit" disabled={submitting} style={primaryBtn}>
                    {submitting ? "Guardando..." : "Guardar tarjeta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de éxito */}
        {successOpen && (
          <div role="dialog" aria-modal="true" style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "grid", placeItems: "center", padding: 16, zIndex: 70
          }}>
            <div style={{
              width: "100%", maxWidth: 400, background: "#fff", borderRadius: 15,
              padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.15)", textAlign: "center"
            }}>
              <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>¡Tarjeta guardada!</h3>
              <button onClick={() => setSuccessOpen(false)} style={ghostBtn}>Aceptar</button>
            </div>
          </div>
        )}

        {/* Modal de detalles con historial */}
        {detailOpen && detailCard && (
          <div role="dialog" aria-modal="true" style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "grid", placeItems: "center", padding: 16, zIndex: 70
          }}>
            <div style={{
              width: "100%", maxWidth: 420, background: "#fff", borderRadius: 15,
              padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Detalles de tarjeta</h3>

              <div style={{ border: `1px solid ${palette.border}`, borderRadius: 12, padding: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700 }}>{detailCard.alias}</div>
                  <span style={{ ...small, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <FaUniversity /> {detailCard.bank}
                  </span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>
                  {hideNumbers ? "•••• •••• •••• " + detailCard.number.slice(-4) : detailCard.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
                </div>
                <div style={{ display: "flex", gap: 12, color: palette.subtle, fontSize: 13, marginTop: 6 }}>
                  <div><b>Titular:</b> {detailCard.holder}</div>
                  <div><b>Vence:</b> {detailCard.exp}</div>
                  <div><b>Marca:</b> {detailCard.brand}</div>
                </div>
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Movimientos</div>
              <div style={{ display: "grid", gap: 8, maxHeight: 260, overflow: "auto" }}>
                {(detailCard.movements || []).map((m) => (
                  <div key={m.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: `1px solid ${palette.border}`, paddingBottom: 6
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{m.desc}</div>
                      <div style={small}>{new Date(m.date).toLocaleDateString("es-MX")}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: m.amount >= 0 ? "#166534" : "#b91c1c" }}>
                      {m.amount >= 0 ? "+" : "-"}{toMXN(Math.abs(m.amount))}
                    </div>
                  </div>
                ))}
                {(!detailCard.movements || detailCard.movements.length === 0) && (
                  <div style={small}>Sin movimientos.</div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={() => setDetailOpen(false)} style={ghostBtn}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
