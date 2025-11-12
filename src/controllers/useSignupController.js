// src/controllers/useSignupController.js
import { useState } from "react";

export const useSignupController = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    accepted: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);  // {type, msg}
  const [successOpen, setSuccessOpen] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Correo inválido.";
    if (!form.password || form.password.length < 8) e.password = "Mínimo 8 caracteres.";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden.";
    if (!form.accepted) e.accepted = "Debes aceptar los términos.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev?.preventDefault?.();
    if (!validate()) {
      setToast({ type: "error", msg: "Revisa los campos marcados." });
      return;
    }
    setSubmitting(true);
    setToast(null);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      };

      // 👉 Aquí iría tu llamada real al backend:
      // const res = await api.post("/auth/signup", payload);
      // if (!res.ok) throw new Error(res.error || "Error al crear la cuenta");

      // ⏱️ Simulación de éxito
      await new Promise((r) => setTimeout(r, 1000));
      setSuccessOpen(true);

      // Limpieza parcial
      // setForm((f) => ({ ...f, password: "", confirm: "" }));
    } catch (err) {
      setToast({ type: "error", msg: err?.message || "No se pudo crear la cuenta." });
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccess = () => setSuccessOpen(false);

  return {
    form, errors, submitting, toast, successOpen,
    setField, submit, closeSuccess,
  };
};
