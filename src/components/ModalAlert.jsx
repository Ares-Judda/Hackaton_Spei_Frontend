// src/components/ModalAlert.jsx
import React from "react";

const ModalAlert = ({ visible, onAccept, onDecline }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
      <div className="bg-(--color-bg-card) text-(--color-text-main) p-6 rounded-2xl shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold mb-3">💡 Personaliza tu experiencia</h2>
        <p className="text-sm text-(--color-text-secondary) mb-6">
          ¿Deseas responder un breve cuestionario de accesibilidad para adaptar tu experiencia?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-(--color-accent) text-white rounded-lg hover:opacity-90"
          >
            Sí, claro
          </button>
          <button
            onClick={onDecline}
            className="px-4 py-2 border border-(--color-border) rounded-lg hover:bg-(--color-border)"
          >
            No, gracias
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
