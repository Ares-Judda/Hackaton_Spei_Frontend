import { useMemo, useState } from "react";
// import { createTransfer } from "/transferController"; // tu caller al backend

const toNumber = (v) => {
  const x = String(v).replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number.parseFloat(x);
  return Number.isFinite(n) ? n : 0;
};

export const useTransferController = () => {
  // Cuentas mock (origen)
  const [accounts] = useState([
    {
      id: "acc1",
      alias: "Cuenta Nómina",
      accountNumber: "1234 5678 9012 3456",
      clabe: "002010012345678901",
      balance: 12543.75,
      currency: "MXN",
    },
    {
      id: "acc2",
      alias: "Ahorros",
      accountNumber: "6543 2109 8765 4321",
      clabe: "012180001234567891",
      balance: 32450.0,
      currency: "MXN",
    },
  ]);

  const [savedContacts] = useState([
    { id: "1", alias: "Mamá", clabe: "002010012345678901" },
    { id: "2", alias: "Ahorros", clabe: "012180001234567891" },
  ]);

  const [form, setForm] = useState({
    // origen
    sourceAccountId: "acc1",
    // destinatario
    contactMode: "saved", // saved | new
    contactId: "1",
    alias: "",
    clabe: "",
    // detalle
    concepto: "",
    amountStr: "",
    schedule: "now", // now | later
    scheduleDate: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null); // {type:'info'|'warn'|'success'|'error', msg}

  const amount = useMemo(() => toNumber(form.amountStr), [form.amountStr]);

  const selectedSourceAccount = useMemo(
    () => accounts.find((a) => a.id === form.sourceAccountId) || null,
    [accounts, form.sourceAccountId]
  );

  const selectedContact = useMemo(() => {
    if (form.contactMode === "saved") {
      return savedContacts.find((c) => c.id === form.contactId) || null;
    }
    return form.clabe
      ? { alias: form.alias || "Contacto nuevo", clabe: form.clabe }
      : null;
  }, [form, savedContacts]);

  const risk = useMemo(() => {
    const high = amount >= 5000;
    const isNew = form.contactMode === "new";
    if (high && isNew) return { level: "alto", msg: "Monto alto a contacto nuevo." };
    if (high) return { level: "medio", msg: "Monto alto." };
    if (isNew) return { level: "bajo", msg: "Contacto nuevo." };
    return { level: "bajo", msg: "Operación habitual." };
  }, [amount, form.contactMode]);

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!selectedSourceAccount) e.sourceAccountId = "Selecciona una cuenta origen.";

    const clabe =
      form.contactMode === "saved"
        ? selectedContact?.clabe || ""
        : (form.clabe || "").replace(/\s/g, "");

    if (!amount || amount <= 0) e.amountStr = "Ingresa un monto mayor a 0.";
    if (amount > 150000) e.amountStr = "Máximo 150,000 MXN.";
    if (selectedSourceAccount && amount > selectedSourceAccount.balance)
      e.amountStr = "Saldo insuficiente en la cuenta origen.";

    if (!clabe || !/^\d{18}$/.test(clabe)) e.clabe = "CLABE de 18 dígitos.";
    if (!form.concepto.trim()) e.concepto = "Escribe un concepto.";
    if (form.schedule === "later" && !form.scheduleDate)
      e.scheduleDate = "Selecciona fecha/hora.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev?.preventDefault?.();
    if (!validate()) {
      setToast({ type: "error", msg: "Revisa los campos marcados." });
      return;
    }
    setConfirmOpen(true);
  };

  const confirm = async () => {
    if (!selectedContact || !selectedSourceAccount) return;
    setSubmitting(true);
    setConfirmOpen(false);
    try {
      const payload = {
        sourceAccountId: selectedSourceAccount.id,
        sourceAccountAlias: selectedSourceAccount.alias,
        clabe: selectedContact.clabe.replace(/\s/g, ""),
        alias: selectedContact.alias,
        amount,
        currency: selectedSourceAccount.currency || "MXN",
        concepto: form.concepto.trim(),
        schedule: form.schedule === "now" ? null : new Date(form.scheduleDate).toISOString(),
        metadata: { risk: risk.level, channel: "web" },
      };
      // const res = await createTransfer(payload);
      await new Promise((r) => setTimeout(r, 1200)); // simulación
      const fakeFolio = `SIM-${Date.now().toString().slice(-6)}`;

      setToast({ type: "success", msg: `Transferencia creada: folio ${fakeFolio}.` });
      setForm((f) => ({ ...f, amountStr: "", concepto: "" }));
    } catch (err) {
      setToast({ type: "error", msg: err?.message || "No se completó la operación." });
    } finally {
      setSubmitting(false);
    }
  };

  const submitNoConfirm = (ev) => {
    ev?.preventDefault?.();
    if (!validate()) {
      setToast({ type: "error", msg: "Revisa los campos marcados." });
      return;
    }
    return confirm();
  };

  return {
    // estado
    accounts,
    form,
    errors,
    savedContacts,
    selectedContact,
    selectedSourceAccount,
    amount,
    risk,
    submitting,
    toast,
    confirmOpen,
    // acciones
    setField,
    setToast,
    submit,
    confirm,
    setConfirmOpen,
    submitNoConfirm,
  };
};
