"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login, register } from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "child">("child");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await login(username, password);
        setAuth(res.data.access_token, res.data.role, res.data.username);
        router.push(res.data.role === "parent" ? "/parent/dashboard" : "/child");
      } else {
        await register({ email, username, password, role });
        setMode("login");
        setError("Account created — please log in.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)",
    }}>
      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-xl p-2">
            <Image src="/logo.png" alt="Bright Roots" width={80} height={80} className="rounded-2xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            Bright Roots
          </h1>
          <p className="text-white/75 mt-2 font-medium">Home Learning</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/30 p-8">
          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6 p-1 bg-gray-50">
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "login" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setMode("login")}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "register" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 font-medium transition-colors" />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                placeholder="username"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 font-medium transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 font-medium transition-colors" />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">I am a…</label>
                <select value={role} onChange={e => setRole(e.target.value as "parent" | "child")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-400 font-medium transition-colors">
                  <option value="parent">Parent</option>
                  <option value="child">Student</option>
                </select>
              </div>
            )}

            {error && (
              <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${error.includes("created") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="gradient-btn w-full py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Please wait…" : mode === "login" ? "Log In →" : "Create Account"}
            </button>
          </form>

          {mode === "register" && (
            <p className="text-xs text-gray-400 text-center mt-5 font-medium">
              Ask Max to set up your account
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
