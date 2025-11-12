export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const kind =
    toast.type === "success" ? "border-green-300 bg-green-50" :
    toast.type === "error"   ? "border-red-300 bg-red-50"     :
    toast.type === "warn"    ? "border-yellow-300 bg-yellow-50" :
                               "border-blue-200 bg-blue-50";
  return (
    <div className={`mb-4 rounded-lg border p-3 text-sm ${kind}`}>
      <div className="flex items-start justify-between gap-3">
        <p>{toast.msg}</p>
        <button onClick={onClose} className="text-xs underline">cerrar</button>
      </div>
    </div>
  );
}
