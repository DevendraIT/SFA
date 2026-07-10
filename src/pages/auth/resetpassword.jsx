import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // Added for navigation

export default function ResetPassword() {
  const [isReset, setIsReset] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate(); // Hook initialized here

  useEffect(() => {
    if (!isReset) return;

    // Countdown interval
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect when countdown hits 0
    if (countdown === 0) {
      navigate('/'); // Performs the actual redirection
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isReset, countdown, navigate]);

  const handleReset = (e) => {
    e.preventDefault();
    // Insert your password submit API code here
    setIsReset(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        
        {isReset ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Password reset successfully!</p>
            </div>
            <p className="text-gray-600 mb-4">
              Redirecting to login page in <span className="font-bold text-blue-600">{countdown}</span> seconds...
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-medium text-sm"
            >
              Click here if you are not redirected
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            <input 
              type="password" 
              placeholder="New Password" 
              className="w-full border p-3 rounded mb-4" 
              required
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className="w-full border p-3 rounded mb-5" 
              required
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
