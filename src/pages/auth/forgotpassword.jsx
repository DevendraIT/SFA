import { useNavigate } from "react-router";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const sendLink = () => {

    // API CALL

    navigate("/resetpassword");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h2 className="text-2xl font-bold mb-6">
          Forgot Password
        </h2>

        <input
          placeholder="Enter Email"
          className="w-full border p-3 rounded mb-6"
        />

        <button
          onClick={sendLink}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Send Reset Link
        </button>

      </div>

    </div>
  );
}