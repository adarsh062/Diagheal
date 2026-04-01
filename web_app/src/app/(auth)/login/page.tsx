"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/ui/GoogleButton";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Login failed.");
    }
  };
  return (
    <main className="relative min-h-[100svh] w-full flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── LEFT: Image Panel ── */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/90 to-teal-900/90 z-10" />
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop"
          alt="Doctor consultation"
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
        />
        {/* Content over image */}
        <div className="relative z-20 px-12 max-w-lg text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-10 shadow-2xl">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-5xl font-poppins font-black leading-[1.1] mb-6 tracking-tight">
            Your Health,<br />Our Priority.
          </h2>
          <p className="text-white/60 font-barlow text-lg leading-relaxed mb-8 font-medium">
            Get AI-powered analysis of your medical reports in seconds. Trusted by thousands for accurate, instant health insights.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 md:py-16 relative">
        {/* BG Blobs (Subtle on mobile) */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-400 blur-[120px] opacity-10 dark:opacity-5 rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-600 blur-[120px] opacity-10 dark:opacity-5 rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/">
                <img src="/assets/logo.png" alt="DiagHeal" className="h-8 dark:brightness-0 dark:invert transition-all" />
              </Link>
            </div>
            <h2 className="text-4xl font-poppins font-black text-slate-900 dark:text-white mb-3 tracking-tight uppercase">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-barlow text-sm font-bold uppercase tracking-widest leading-none">Access your medical trajectory</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold font-barlow flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Clinical Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                <input
                  type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-11 pr-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/50 transition-all font-poppins text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Secret Key</label>
                <Link href="#" className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                <input
                  type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-11 pr-12 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/50 transition-all font-poppins text-sm shadow-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition">
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-poppins font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center gap-3 mt-4 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] disabled:opacity-50">
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
            <span className="flex-shrink mx-4 text-slate-300 dark:text-slate-600 text-[9px] font-black tracking-[0.3em] uppercase">SSO Authorization</span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
          </div>

          <GoogleButton text="Sign in with Google" />

          <p className="text-center mt-10 text-[11px] font-black uppercase tracking-widest text-slate-400">
            First time here?{" "}
            <Link href="/signup" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700">Initialize Account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
