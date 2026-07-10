export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-8xl font-bold text-red-500">
          403
        </h1>

        <h2 className="text-3xl font-bold mt-4">
          Access Denied
        </h2>

        <p className="text-gray-500 mt-3">
          You don't have permission to access this page.
        </p>

        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded">
          Go Dashboard
        </button>

      </div>

    </div>
  );
}