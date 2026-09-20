import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.post("/auth/register", {
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      setMessage("Account created successfully! Redirecting to login...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fff4bf]/30 via-white to-[#ffbefb]/25 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8c56d4] via-[#dc95ff] to-[#ffbefb] text-xl font-bold text-white shadow-lg shadow-[#dc95ff]/30">
            T
          </div>

          <h1 className="text-3xl font-bold text-[#59358a]">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#9b7ac0]">
            Start organizing your tasks with TaskFlow.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-[#ead8f5] bg-white p-6 shadow-xl shadow-[#dc95ff]/10 sm:p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#59358a]">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm text-[#59358a] outline-none transition placeholder:text-[#bda8d0] focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#59358a]">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm text-[#59358a] outline-none transition placeholder:text-[#bda8d0] focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#59358a]">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#ead8f5] bg-[#fdf7ff] px-4 py-3 text-sm text-[#59358a] outline-none transition placeholder:text-[#bda8d0] focus:border-[#dc95ff] focus:bg-white focus:ring-4 focus:ring-[#ffbefb]/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  messageType === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {message}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#8c56d4] via-[#dc95ff] to-[#ffbefb] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#dc95ff]/30 transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#9b7ac0]">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-[#8c56d4] hover:text-[#59358a]"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;