import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const email = formData.email.trim();

    if (!email || !formData.password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password: formData.password,
      });

      // Store authentication data for this browser tab
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fff4bf]/30 via-white to-[#ffbefb]/25 px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8c56d4] via-[#dc95ff] to-[#ffbefb] text-xl font-bold text-white shadow-lg shadow-[#dc95ff]/30">
            T
          </div>

          <h1 className="text-3xl font-bold text-[#59358a]">
            Welcome back!
          </h1>

          <p className="mt-2 text-sm text-[#9b7ac0]">
            Sign in to manage your tasks with TaskFlow.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-[#ead8f5] bg-white p-6 shadow-xl shadow-[#dc95ff]/10 sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#59358a]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                disabled={loading}
                onChange={handleChange}
                autoComplete="email"
                className="w-full rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm text-[#59358a] outline-none transition placeholder:text-[#bda8d0] focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#59358a]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                disabled={loading}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm text-[#59358a] outline-none transition placeholder:text-[#bda8d0] focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
                required
              />
            </div>

            {/* Error Message */}
            {message && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
                {message}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#8c56d4] via-[#dc95ff] to-[#ffbefb] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#dc95ff]/30 transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#9b7ac0]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#8c56d4] hover:text-[#59358a]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;