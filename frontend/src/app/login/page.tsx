"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(username, password);
      setAuth(res.data.access_token, res.data.role, res.data.username);
      router.push(res.data.role === "parent" ? "/parent/dashboard" : "/child");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, #2F5D3A 0%, #6EA76E 55%, #A8C67A 100%)",
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-900/30 p-8">
          <h2 className="text-center text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                placeholder="username"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#6EA76E] font-medium transition-colors" />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm font-semibold bg-red-50 text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="gradient-btn w-full py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Please wait…" : "Log In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
