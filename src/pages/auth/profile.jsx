export default function Profile() {
  return (
    <div className="bg-white p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-8">
        Profile Management
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <input
          placeholder="First Name"
          className="border p-3 rounded"
        />

        <input
          placeholder="Last Name"
          className="border p-3 rounded"
        />

        <input
          placeholder="Email"
          className="border p-3 rounded"
        />

        <input
          placeholder="Phone"
          className="border p-3 rounded"
        />

        <input
          placeholder="Department"
          className="border p-3 rounded"
        />

        <input
          placeholder="Designation"
          className="border p-3 rounded"
        />

      </div>

      <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded">
        Save Changes
      </button>
    </div>
  );
}