import { useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/data");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen flex bg-orange-100">
      {/* Left Side - Welcome with Image */}
      <div
        className="hidden md:flex w-1/2 items-center justify-center relative bg-cover bg-center"
        style={{ backgroundImage: "url('/Maharaj.jpg')" }}
      >
        <div className="absolute inset-0 bg-orange-900 bg-opacity-60"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            જય શ્રી સ્વામિનારાયણ
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Welcome to <span className="font-bold">Bhajan Bank</span>
            <br />
            Track your spiritual journey with divine grace
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        
        {/* Logo in Corner */}
        <img
          src="/1.png" // replace with your logo file
          alt="Logo"
          className="absolute lg:top-4 top-11 lg:left-6 right-9 lg:w-14 lg:h-14 w-10 h-10"
        />

        <div className="w-full max-w-md bg-gradient-to-b from-orange-200 to-orange-100 shadow-2xl rounded-2xl p-8 space-y-6">
          {/* Back Button */}
          <button
            className="text-orange-700 flex items-center space-x-2 hover:underline"
            onClick={() => navigate("/")}
          >
            <span className="text-lg">←</span> <span>Back</span>
          </button>

          {/* Logo Icon (center piece inside card, optional) */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4m10-11v11a1 1 0 01-1 1h-4m-6 0h6"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
  {/* <img
          src="/1.png" // replace with your logo file
          alt="Logo"
          className="absolute top-12 -12 w-14 h-14 lg:hidden"
        /> */}
          <h2 className="text-center text-2xl font-bold text-orange-800">
            श्री Bhajan Bank
          </h2>
          <p className="text-center text-orange-600 italic">
            Enter the divine portal
          </p>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-orange-700 font-medium mb-1">
                Email / Divine ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-orange-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-orange-50"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-orange-700 font-medium mb-1">
                Mantra (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-orange-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-orange-50 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-orange-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 rounded-lg hover:from-orange-700 hover:to-orange-600 transition shadow-md flex justify-center items-center space-x-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>🙏</span> <span>Pranam & Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-center text-orange-700">
            New to divine service?{" "}
            <a
              onClick={() => navigate("/register")}
              className="mt-4 font-medium text-[#E56210] hover:text-[#FF9933] underline underline-offset-5 decoration-[#E56210]"
            >
              Begin Your Spiritual Journey
            </a>
          </p>

          <p className="text-center text-orange-800 text-sm font-semibold mt-2">
            श्री स्वामिनारायणाय नमः
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
