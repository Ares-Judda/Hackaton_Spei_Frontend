import React, { useMemo, useState, useEffect } from "react";
import { FaCopy, FaQrcode, FaShareAlt, FaDownload } from "react-icons/fa";

export default function ReceiveView({ userSettings, onBack }) {
  const accounts = [
    { id: "acc1", alias: "Cuenta Nómina", clabe: "002010012345678901", accountNumber: "1234 5678 9012 3456", bank: "Banco Inclusivo", name: "Juan Pérez" },
    { id: "acc2", alias: "Ahorros",       clabe: "012180001234567891", accountNumber: "6543 2109 8765 4321", bank: "Banco Inclusivo", name: "Juan Pérez" },
  ];

  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const selected = useMemo(() => accounts.find((a) => a.id === selectedId), [selectedId]);

  const [toast, setToast] = useState(null);
  const dismissToast = () => setToast(null);

  const [qrAmount, setQrAmount]   = useState("");
  const [qrConcept, setQrConcept] = useState("");
  const [qrUrl, setQrUrl]         = useState("");   // <- aquí se guarda el src del QR

  const palette = { primary:"#0078D4", bg:"#f0f0f0", card:"#fff", text:"#000", subtle:"#666", border:"#d1d5db" };
  const container = { display:"flex", justifyContent:"center", minHeight:"100vh", padding:"20px", backgroundColor:palette.bg, fontFamily:userSettings?.font||"Arial", fontSize:userSettings?.fontSize||"16px" };
  const shell     = { width:"100%", maxWidth:"400px", display:"flex", flexDirection:"column", gap:"18px", color:palette.text };
  const h1        = { fontSize:"22px", fontWeight:600, marginBottom:"4px" };
  const label     = { fontSize:13, fontWeight:600 };
  const small     = { fontSize:12, color:palette.subtle };
  const ghostBtn  = { border:`1px solid ${palette.border}`, borderRadius:12, background:"#fff", padding:"8px 14px", cursor:"pointer" };
  const primaryBtn= { border:"none", borderRadius:15, backgroundColor:palette.primary, color:"#fff", fontWeight:"bold", padding:"12px 18px", minHeight:44, cursor:"pointer" };
  const fieldCard = { background:palette.card, border:`1px solid ${palette.border}`, borderRadius:15, padding:14 };
  const input     = { width:"100%", padding:10, borderRadius:10, border:`1px solid ${palette.border}`, outline:"none" };
  const toastBox  = (type)=>({ borderRadius:12, padding:10, fontSize:14, border:type==="success"?"1px solid #86efac":"1px solid #fca5a5", background:type==="success"?"#f0fdf4":"#fef2f2" });

  const copyToClipboard = async (text, label) => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else { const ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
      setToast({ type:"success", msg:`${label} copiado` }); setTimeout(dismissToast,1800);
    } catch { setToast({ type:"error", msg:`No se pudo copiar ${label}` }); setTimeout(dismissToast,2000); }
  };

  const shareData = async () => {
    const text = `Envía a ${selected.name} (${selected.alias})
CLABE: ${selected.clabe}
Cuenta: ${selected.accountNumber}
Banco: ${selected.bank}`;
    if (navigator.share) {
      try { await navigator.share({ title:"Datos para transferencia", text }); setToast({ type:"success", msg:"Compartido" }); setTimeout(dismissToast,1500); }
      catch {}
    } else copyToClipboard(text, "Datos de transferencia");
  };

  // --- QR helpers ---
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
    const cacheBust = Date.now(); // evita cache
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}&cb=${cacheBust}`);
  };

  // Genera por defecto al entrar:
  useEffect(() => { generateQr(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // Regenera cuando cambien cuenta / monto / concepto:
  useEffect(() => { generateQr(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [selectedId, qrAmount, qrConcept]);

  const downloadQr = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `CoDiQR_${selected.alias}.png`;
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
    } catch { setToast({ type:"error", msg:"No se pudo descargar el QR" }); setTimeout(dismissToast,1800); }
  };

  const shareQr = async () => {
    if (!qrUrl || !navigator.share || !navigator.canShare) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const file = new File([blob], `CoDiQR_${selected.alias}.png`, { type:"image/png" });
      if (navigator.canShare({ files:[file] })) {
        await navigator.share({ title:"QR de cobro", text:"Escanea para pagar (demo)", files:[file] });
      } else {
        await navigator.share({ title:"QR de cobro", text: qrUrl });
      }
    } catch {}
  };

  // --- Render ---
  return (
    <div style={container}>
      <div style={shell}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {onBack && <button onClick={onBack} style={ghostBtn}>← Volver</button>}
          <h1 style={h1}>Recibir dinero</h1>
        </div>

        {/* Cuenta a recibir */}
        <div style={fieldCard}>
          <label style={label}>Cuenta a recibir</label>
          <div style={{ marginTop:10, display:"flex", gap:8 }}>
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedId(acc.id)}
                style={{
                  padding:"8px 10px",
                  borderRadius:10,
                  border: selectedId===acc.id ? `2px solid ${palette.primary}` : `1px solid ${palette.border}`,
                  background: selectedId===acc.id ? "#f0f8ff" : "#fff",
                  cursor:"pointer",
                  flex:1,
                }}
              >
                <div style={{ fontWeight:600 }}>{acc.alias}</div>
                <div style={small}>{acc.accountNumber}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Datos principales */}
        <div style={fieldCard}>
          <div style={{ fontSize:14, fontWeight:700 }}>{selected.name}</div>
          <div style={{ fontSize:13, color:palette.subtle }}>{selected.bank}</div>

          <div style={{ marginTop:12, display:"grid", gap:8 }}>
            <div>
              <div style={small}>CLABE</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ fontWeight:700, letterSpacing:1 }}>{selected.clabe}</div>
                <button onClick={() => copyToClipboard(selected.clabe, "CLABE")} aria-label="Copiar CLABE"
                        style={{ border:"none", background:"transparent", cursor:"pointer", color:palette.primary }}>
                  <FaCopy />
                </button>
              </div>
            </div>

            <div>
              <div style={small}>Número de cuenta</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ fontWeight:700 }}>{selected.accountNumber}</div>
                <button onClick={() => copyToClipboard(selected.accountNumber, "Número de cuenta")} aria-label="Copiar número"
                        style={{ border:"none", background:"transparent", cursor:"pointer", color:palette.primary }}>
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:10, marginTop:12 }}>
            <button
              onClick={() =>
                copyToClipboard(
                  `CLABE: ${selected.clabe}\nCuenta: ${selected.accountNumber}\nTitular: ${selected.name}\nBanco: ${selected.bank}`,
                  "Datos de transferencia"
                )
              }
              style={{ flex:1, borderRadius:12, padding:12, border:`1px solid ${palette.border}`, background:"#fff", cursor:"pointer" }}
            >
              Copiar todo
            </button>
            <button onClick={shareData} style={{ flex:1, ...primaryBtn }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", justifyContent:"center" }}>
                <FaShareAlt /> Compartir
              </div>
            </button>
          </div>
        </div>

        {/* QR siempre visible */}
        <div style={fieldCard}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <FaQrcode />
            <div style={{ fontSize:16, fontWeight:700 }}>QR para cobrar </div>
          </div>

          <div style={{ display:"grid", placeItems:"center", gap:10, marginBottom:10 }}>
            {qrUrl ? (
              <img src={qrUrl} alt="QR para cobrar"
                   style={{ width:240, height:240, borderRadius:12, border:`1px solid ${palette.border}`, background:"#fff", padding:6 }} />
            ) : (
              <div style={{
                width:240, height:240, borderRadius:12, border:`1px dashed ${palette.border}`,
                display:"grid", placeItems:"center", background:"#fff", color:palette.subtle
              }}>
                Generando QR…
              </div>
            )}

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button onClick={downloadQr} type="button" style={ghostBtn} disabled={!qrUrl}>
                <FaDownload style={{ marginRight:6 }} /> Descargar
              </button>
              {navigator.share && (
                <button onClick={shareQr} type="button" style={ghostBtn} disabled={!qrUrl}>
                  <FaShareAlt style={{ marginRight:6 }} /> Compartir QR
                </button>
              )}
            </div>
          </div>

          {/* Opcionales SIN obligar */}
          <div style={{ display:"grid", gap:10 }}>
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

          <div style={{ marginTop:6, ...small }}>
            Este QR es de demostración. En producción, usa el formato oficial de CoDi.
          </div>
        </div>

        {toast && <div style={toastBox(toast.type)}>{toast.msg}</div>}
      </div>
    </div>
  );
}
