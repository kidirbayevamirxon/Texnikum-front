import { useState } from "react";
import { login as loginRequest } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { hasToken } from "../utils/auth";

export default function Login() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginRequest({ login: loginValue, password });
      localStorage.setItem("accessToken", res.data.access_token);
      if (res.data.refresh_token) localStorage.setItem("refreshToken", res.data.refresh_token);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if (hasToken()) navigate("/");
}, [navigate]);
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white relative">
      <div className="ts-bg">
        <div className="ts-glow-a" />
        <div className="ts-glow-b" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 min-h-screen grid place-items-center px-4">
        <form onSubmit={handleSubmit} className="ts-card w-full max-w-md p-6">
          <div className="ts-chip w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Admin Login
          </div>

          <h2 className="mt-3 text-2xl font-semibold">Kirish</h2>
          <p className="mt-1 text-sm text-white/60">Portalga kirish uchun ma’lumotlarni kiriting</p>

          <div className="mt-6 space-y-3">
            <input
              className="ts-input"
              placeholder="Login"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
            />
            <input
              className="ts-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-500/80 to-cyan-500/70 px-4 py-3 text-sm font-semibold
                       hover:opacity-95 transition"
            disabled={loading}
          >
            {loading ? "Yuklanmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}
