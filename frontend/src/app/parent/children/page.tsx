"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getChildren, addChild, removeChild } from "@/lib/api";
import { Child } from "@/types";
import Navbar from "@/components/Navbar";
import { format, parseISO } from "date-fns";

export default function ChildrenPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated() || getRole() !== "parent") { router.replace("/login"); return; }
    getChildren().then(res => { setChildren(res.data); setLoading(false); });
  }, [router]);

  const handleAdd = async () => {
    if (!username.trim() || !password.trim() || !email.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await addChild({ username: username.trim(), email: email.trim(), password: password.trim() });
      setChildren(prev => [...prev, res.data]);
      setShowModal(false);
      setUsername(""); setEmail(""); setPassword("");
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Something went wrong");
    } finally { setSaving(false); }
  };

  const handleRemove = async (id: number, name: string) => {
    if (!confirm(`Remove ${name}'s account? This will delete all their data.`)) return;
    await removeChild(id);
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  const closeModal = () => { setShowModal(false); setUsername(""); setEmail(""); setPassword(""); setError(""); };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">👦 Children</h1>
            <p className="text-gray-500 font-medium mt-1">Manage the child accounts linked to your parent account.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="gradient-btn text-sm px-4 py-2">
            + Add Child
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : children.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-10 text-center shadow-sm">
            <p className="text-5xl mb-3">👦</p>
            <p className="font-semibold text-gray-700 mb-1">No child accounts yet</p>
            <p className="text-sm text-gray-500 mb-4">Add a child account so they can log in and see their lessons.</p>
            <button onClick={() => setShowModal(true)} className="gradient-btn text-sm px-5 py-2">
              Add your first child
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map(child => (
              <div key={child.id} className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                  {child.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-gray-900">{child.username}</p>
                  <p className="text-sm text-gray-500">{child.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Added {format(parseISO(child.created_at), "d MMM yyyy")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(child.id, child.username)}
                  className="text-sm text-red-400 hover:text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-700 mb-1">💡 How it works</p>
          <p className="text-sm text-amber-800">
            Each child gets their own login. When you add lessons to the planner you can assign them to a specific child, or leave unassigned so all children see them.
          </p>
        </div>
      </div>

      {/* Add child modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add a Child Account</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name / Username</label>
                <input
                  autoFocus
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. oscar"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="oscar@example.com"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Choose a password they can remember"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA76E]"
                />
              </div>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAdd}
                disabled={saving || !username.trim() || !email.trim() || !password.trim()}
                className="flex-1 gradient-btn text-sm py-2 disabled:opacity-50"
              >
                {saving ? "Creating…" : "Create Account"}
              </button>
              <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
