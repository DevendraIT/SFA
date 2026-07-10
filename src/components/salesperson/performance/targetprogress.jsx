export default function TargetProgress() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-xl font-bold">
        Monthly Target
      </h2>

      <div className="mt-10 text-center">

        <h1 className="text-5xl font-bold text-blue-600">
          78%
        </h1>

        <p className="text-gray-500 mt-2">
          ₹6.25L / ₹8L
        </p>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-8">

        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: "78%" }}
        />

      </div>

      <div className="mt-8 flex justify-between">

        <div>

          <p className="text-gray-500">
            Achieved
          </p>

          <h3 className="font-bold text-green-600">
            ₹6.25L
          </h3>

        </div>

        <div>

          <p className="text-gray-500">
            Remaining
          </p>

          <h3 className="font-bold text-orange-500">
            ₹1.75L
          </h3>

        </div>

      </div>

    </div>
  );
}