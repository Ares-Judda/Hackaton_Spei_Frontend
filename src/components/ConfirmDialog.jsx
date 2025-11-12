export default function ConfirmDialog({ open, title, children, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <div className="mb-4 text-sm text-gray-700">{children}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-xl border px-4 py-2">Cancelar</button>
          <button onClick={onConfirm} className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
