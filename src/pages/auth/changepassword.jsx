export default function ChangePassword() {
  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Change Password
      </h2>

      <input
        type="password"
        placeholder="Current Password"
        className="w-full border p-3 rounded mb-4"
      />

      <input
        type="password"
        placeholder="New Password"
        className="w-full border p-3 rounded mb-4"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border p-3 rounded mb-6"
      />

      <button className="bg-blue-600 text-white px-6 py-3 rounded">
        Update Password
      </button>
    </div>
  );
}