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
    if (!isAuthenticated() || getRole() !== "parent") {
      router.replace("/login");
      return;
    }

    getChildren()
      .then(res => setChildren(res.data))
      .finally(() => setLoading(false));
  }, [router]);

  const handleAdd = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) return;

    setSaving(true);
    setError("");

    try {
      const res = await addChild({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      setChildren(prev => [...prev, res.data]);

      setUsername("");
      setEmail("");
      setPassword("");
      setShowModal(false);
    } catch (err: unknown) {
      const detail = (
        err as { response?: { data?: { detail?: string } } }
      )?.response?.data?.detail;

      setError(detail || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: number, name: string) => {
    if (!confirm(`Remove ${name}'s account? This will delete all their data.`)) {
      return;
    }

    await removeChild(id);
    setChildren(prev => prev.filter(child => child.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                Family Accounts
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">
                Children
              </h1>

              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Manage the child accounts connected to your Bright Roots family.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Add Child
            </button>
          </div>
        </section>

        <section className="brand-card overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-[#E7DFD1] flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                Linked Accounts
              </p>
              <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                Your Children
              </h2>
            </div>

            {!loading && (
              <div className="rounded-full bg-[#F7F2E8] px-3 py-1.5 text-xs font-bold text-[#6E5A46]">
                {children.length} {children.length === 1 ? "child" : "children"}
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-[#8FA382]">
              Loading...
            </div>
          ) : children.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F7F2E8] flex items-center justify-center text-[#3F5D46] text-xl font-bold">
                BR
              </div>

              <h3 className="text-lg font-bold text-[#2E342F] mt-4">
                No child accounts yet
              </h3>

              <p className="text-sm text-[#6E5A46] mt-2 max-w-md mx-auto">
                Add a child account so they can sign in and see the lessons assigned to them.
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] transition-colors"
              >
                Add your first child
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#EEE6D9]">
              {children.map(child => (
                <div
                  key={child.id}
                  className="px-5 sm:px-6 py-5 flex items-center gap-4 hover:bg-[#FFFDF8] transition-colors"
                >
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#E8EDE4] border border-[#D9E1D4] flex items-center justify-center text-[#3F5D46] text-lg font-bold">
                    {child.username.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-bold text-[#2E342F]">
                        {child.username}
                      </p>

                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#8FA382] bg-[#F7F2E8] rounded-full px-2 py-1">
                        Child account
                      </span>
                    </div>

                    <p className="text-sm text-[#6E5A46] mt-1 truncate">
                      {child.email}
                    </p>

                    <p className="text-xs text-[#8FA382] mt-1">
                      Added {format(parseISO(child.created_at), "d MMMM yyyy")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemove(child.id, child.username)}
                    className="shrink-0 px-3 py-2 rounded-xl text-sm font-semibold text-[#B45F50] hover:bg-[#FBEFEB] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-[#E7DFD1] bg-[#F7F2E8] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
            How it works
          </p>

          <p className="text-sm text-[#6E5A46] mt-2 leading-relaxed">
            Each child gets their own login. Lessons can be assigned to a specific child in the Planner, or left unassigned so they are available to everyone.
          </p>
        </section>
      </main>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 px-4 flex items-center justify-center"
          onClick={event => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-[#FFFDF8] border border-[#E7DFD1] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E7DFD1]">
              <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                New Account
              </p>

              <h2 className="text-xl font-bold text-[#2E342F] mt-1">
                Add a Child
              </h2>

              <p className="text-sm text-[#6E5A46] mt-1">
                Create their Bright Roots login details.
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Name / Username
                  </label>

                  <input
                    autoFocus
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    placeholder="e.g. oscar"
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-[#8FA382] focus:ring-2 focus:ring-[#8FA382]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="oscar@example.com"
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-[#8FA382] focus:ring-2 focus:ring-[#8FA382]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2E342F] mb-1.5">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Choose a password they can remember"
                    className="w-full rounded-xl border border-[#D9D1C4] bg-white px-3.5 py-2.5 text-sm text-[#2E342F] outline-none focus:border-[#8FA382] focus:ring-2 focus:ring-[#8FA382]/20"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-[#E9B8AE] bg-[#FBEFEB] px-4 py-3">
                    <p className="text-sm font-semibold text-[#A64F42]">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="sm:flex-1 px-4 py-2.5 rounded-xl border border-[#D9D1C4] bg-white text-[#6E5A46] text-sm font-semibold hover:bg-[#F7F2E8] transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAdd}
                  disabled={
                    saving ||
                    !username.trim() ||
                    !email.trim() ||
                    !password.trim()
                  }
                  className="sm:flex-1 px-4 py-2.5 rounded-xl bg-[#3F5D46] text-white text-sm font-bold hover:bg-[#354F3B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}