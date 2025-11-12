export default function RiskBadge({ risk }) {
  const cls =
    risk.level === "alto"  ? "text-red-600" :
    risk.level === "medio" ? "text-yellow-700" : "text-green-700";
  return (
    <p className="text-sm text-gray-600">
      Riesgo estimado: <span className={`${cls} font-medium`}>{risk.level.toUpperCase()}</span> · {risk.msg}
    </p>
  );
}
