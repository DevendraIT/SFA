import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "../../api/authApi.js";

export default function Login() {
  const navigate = useNavigate();

  // Form input field states
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Individual field-level error messages
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Static Mock Users Data Configuration
  const mockUsers = [
    {
      name: "Admin",
      role: "ADMIN",
      email: "admin@sfa.com",
      password: "admin123",
      dashboard: "/admin/dashboard",
      icon: "🛠️",
    },
    {
      name: "Head of Sales",
      role: "HEAD_SALES",
      email: "headsales@sfa.com",
      password: "headsales123",
      dashboard: "/headsales/dashboard",
      icon: "📈",
    },
    {
      name: "Sales Manager",
      role: "SALES_MANAGER",
      email: "manager@sfa.com",
      password: "manager123",
      dashboard: "/salesmanager/dashboard",
      icon: "👨‍💼",
    },
    {
      name: "Sales Executive",
      role: "SALES_PERSON",
      email: "sales@sfa.com",
      password: "sales123",
      dashboard: "/salesperson/dashboard",
      icon: "🚗",
    },
  ];

  // Lifecycle Hook: Load Remembered Email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setForm((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Structural Validation Helper
  const validateField = (name, value) => {
    let errorMsg = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        errorMsg = "Email address is required.";
      } else if (!emailRegex.test(value.trim())) {
        errorMsg = "Please enter a valid format (e.g., name@company.com).";
      }
    }
    if (name === "password") {
      if (!value) {
        errorMsg = "Password is required.";
      } else if (value.length < 6) {
        errorMsg = "Password must be at least 6 characters long.";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === "";
  };

  // Handle Text Field Typing Modifications
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear out errors progressively while typing
    if (errors[name]) {
      validateField(name, value);
    }
  };


  // Handled Validation for Forgot Password Click
  const handleForgotPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Check if the current form email is valid before letting them proceed
    if (!form.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Type your email here first so we can send a reset link." }));
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address before resetting." }));
      return;
    }

    // Clear email errors if valid and redirect
    setErrors((prev) => ({ ...prev, email: "" }));
    alert(`A password reset link has been requested for: ${form.email.trim().toLowerCase()}`);
    navigate("/forgotpassword");
  };
  // Main Unified Login Submission Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setGlobalError("");

    // Trigger explicit field evaluations
    const isEmailValid = validateField("email", form.email);
    const isPasswordValid = validateField("password", form.password);

    if (!isEmailValid || !isPasswordValid) return;

    const sanitizedEmail = form.email.trim().toLowerCase();
    const rawPassword = form.password;

    try {
      setLoading(true);

      // STEP 1: Intercept Mock User Matches to bypass API calls completely
      const matchedMockUser = mockUsers.find(
        (user) => user.email === sanitizedEmail && user.password === rawPassword
      );

      if (matchedMockUser) {
        const mockUserPayload = {
          id: `mock-id-${matchedMockUser.role.toLowerCase()}`,
          name: matchedMockUser.name,
          email: matchedMockUser.email,
          role: matchedMockUser.role,
        };

        localStorage.setItem("token", "mock-jwt-token-string");
        localStorage.setItem("user", JSON.stringify(mockUserPayload));

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", sanitizedEmail);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        navigate(matchedMockUser.dashboard);
        return; 
      }

      // STEP 2: Live Network API Fallback Flow
      const response = await login({
        email: sanitizedEmail,
        password: rawPassword,
      });

      const { user, tokens } = response.data.data;
      localStorage.setItem("token", tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", sanitizedEmail);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      switch (user.role) {
        case "ADMIN": navigate("/admin/dashboard"); break;
        case "HEAD_SALES": navigate("/headsales/dashboard"); break;
        case "SALES_MANAGER": navigate("/salesmanager/dashboard"); break;
        case "SALES_PERSON": navigate("/salesperson/dashboard"); break;
        default: navigate("/");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setGlobalError(err.response.data.message);
      } else {
        setGlobalError("Unable to log in. Please check connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* LEFT SIDE BANNER PANEL - Visible on Desktop screens */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-blue-400 opacity-20 blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-400 opacity-20 blur-3xl bottom-0 right-0"></div>

        <div className="relative flex flex-col justify-between p-16 z-10 w-full">
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                <span className="text-3xl font-black text-indigo-600">S</span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">SFA Portal</h1>
                <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">Sales Force Automation</p>
              </div>
            </div>

            <h2 className="text-5xl font-bold leading-tight">Intelligent Enterprise Hub</h2>
            <p className="mt-4 text-base text-indigo-100 leading-relaxed max-w-md">
              Manage your field force, customers, AI leads, targets, sales reports, and business analytics from one intelligent enterprise platform.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "AI Powered Sales Insights",
                "Real Time Order Tracking",
                "GPS Enabled Field Visits",
                "Smart Reports & Analytics",
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-medium text-indigo-50">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400"></div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-xs font-semibold text-indigo-200 uppercase tracking-widest">Platform Core Architecture</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Secure Login", desc: "JWT Authentication", icon: "🔐" },
                { title: "Real Time", desc: "Live Dashboard Access", icon: "📊" },
                { title: "AI Enabled", desc: "Smart Sales Insights", icon: "🤖" },
                { title: "GPS Tracking", desc: "Field Visit Monitoring", icon: "📍" },
              ].map((item, index) => (
                <div key={index} className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/10">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-[11px] text-indigo-200 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE INPUT LOGIN PANEL */}
      <div className="flex-1 flex justify-center max-h-screen items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl max-h-screen p-8 md:p-10 border border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Account Login</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">Enter credentials or select a mock profile below.</p>

            {/* Global API Exception Messages */}
            {globalError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3.5 mb-6 text-sm font-medium">
                {globalError}
              </div>
            )}

            {/* Standard Input Form Handler */}
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={(e) => validateField("email", e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl focus:outline-hidden focus:ring-2 focus:bg-white text-slate-800 transition-all text-sm`}
                    placeholder="name@company.com"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-rose-600 mt-1.5 ml-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={(e) => validateField("password", e.target.value)}
                    className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${errors.password ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl focus:outline-hidden focus:ring-2 focus:bg-white text-slate-800 transition-all text-sm`}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-rose-600 mt-1.5 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Auxiliary Setting Rules Wrapper */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="ml-2.5 text-sm font-medium text-slate-600">Remember my email</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying Credentials...
                  </>
                ) : (
                  "Sign In to Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}