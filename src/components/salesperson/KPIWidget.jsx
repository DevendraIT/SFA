export default function KPIWidget({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`${color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}