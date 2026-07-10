export default function WelcomeBanner() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
      <h1 className="text-4xl font-bold">
        Good Morning 👋
      </h1>

      <p className="mt-3 text-lg">
        Welcome back,
        <span className="font-semibold">
          {" "}ABC SALES TEAM
        </span>
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div>
          <p className="text-sm opacity-80">
            Today's Target
          </p>

          <h2 className="text-3xl font-bold">
            ₹50,000
          </h2>
        </div>

        <div>
          <p className="text-sm opacity-80">
            Customer Visits
          </p>

          <h2 className="text-3xl font-bold">
            15
          </h2>
        </div>

        <div>
          <p className="text-sm opacity-80">
            Pending Follow-ups
          </p>

          <h2 className="text-3xl font-bold">
            7
          </h2>
        </div>

      </div>
    </div>
  );
}