export default function TargetProgress() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-bold">
        Monthly Target
      </h2>

      <div className="mt-8 text-center">

        <h1 className="text-5xl font-bold text-blue-600">
          75%
        </h1>

        <p className="text-gray-500 mt-2">
          ₹3,75,000 of ₹5,00,000
        </p>

      </div>

      <div className="mt-8">

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: "75%" }}
          />

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="bg-green-50 rounded-xl p-4">

          <p className="text-gray-500">
            Achieved
          </p>

          <h3 className="text-2xl font-bold text-green-600">
            ₹3.75L
          </h3>

        </div>

        <div className="bg-orange-50 rounded-xl p-4">

          <p className="text-gray-500">
            Remaining
          </p>

          <h3 className="text-2xl font-bold text-orange-500">
            ₹1.25L
          </h3>

        </div>

      </div>

    </div>
  );
}