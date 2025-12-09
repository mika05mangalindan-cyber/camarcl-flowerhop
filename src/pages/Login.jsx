import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config'

// const API_URL = process.env.REACT_APP_API_URL; // e.g., http://localhost:5500
axios.defaults.withCredentials = true;

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Sending login request to:", `${API_URL}/login`);
      console.log("Payload:", { email, password });

      const res = await axios.post(`${API_URL}/login`, { email, password });
      console.log("Server response:", res.data);

      const user = res.data.user;

      if (!user) {
        setError("Invalid server response.");
        setLoading(false);
        return;
      }

      // Update global state if provided
      if (onLogin && typeof onLogin === "function") {
        onLogin(user);
      }

      // Role-based navigation
      const role = user.role?.toLowerCase();
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "customer") {
        navigate("/shop");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      console.error("Login error:", err.response || err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side image */}
      <div className="hidden md:flex md:w-1/2 bg-green-700 items-center justify-center">
        <img
          src="/display.jpg"
          alt="Login Illustration"
          className="w-full h-full object-cover rounded-r-3xl"
        />
      </div>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 md:p-12 bg-gray-50">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-green-700 mb-6 text-center">
            Login
          </h2>

          {error && (
            <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

           <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              autoComplete="current-password" 
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500 text-sm font-medium"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-800"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            &copy; 2025 Camarcl Flowershop
          </p>
        </div>
      </div>
    </div>
  );
}
