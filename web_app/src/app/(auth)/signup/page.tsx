"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/ui/GoogleButton";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agree) { setError("Please accept the Terms & Privacy Policy."); return; }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Signup failed.");
    }
  };

  return (
    <main className="relative min-h-[100svh] w-full flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">

      {/* ── LEFT: Image Panel ── */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 to-cyan-900/90 z-10" />
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
          alt="Medical professionals"
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
        />
        {/* Content over image */}
        <div className="relative z-20 px-12 max-w-lg text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-10 shadow-2xl">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-5xl font-poppins font-black leading-[1.1] mb-6 tracking-tight">
            Start Your<br />Health Journey.
          </h2>
          <p className="text-white/60 font-barlow text-lg leading-relaxed mb-8 font-medium">
            Join DiagHeal today for accurate medical report analysis. Your first 3 reports are on us.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["AI Analysis", "Instant Results", "Doctor Connect", "Secure & Private"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[10px] font-black text-white font-barlow tracking-widest border border-white/10 uppercase">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 md:py-16 relative">
        {/* BG Blobs */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-teal-400 blur-[120px] opacity-10 dark:opacity-5 rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600 blur-[120px] opacity-10 dark:opacity-5 rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/">
                <img src="/assets/logo.png" alt="DiagHeal" className="h-8 dark:brightness-0 dark:invert transition-all" />
              </Link>
            </div>
            <h2 className="text-4xl font-poppins font-black text-slate-900 dark:text-white mb-3 tracking-tight uppercase">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 font-barlow text-sm font-bold uppercase tracking-widest leading-none">Join the medical revolution</p>
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
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Legal Name</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full pl-11 pr-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/50 transition-all font-poppins text-sm shadow-sm" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Primary Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                <input type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-11 pr-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/50 transition-all font-poppins text-sm shadow-sm" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Access Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-600 transition-colors" />
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-11 pr-12 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/5 focus:border-cyan-500/50 transition-all font-poppins text-sm shadow-sm" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition">
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-4 cursor-pointer group pl-1">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 w-4 h-4 accent-slate-900 cursor-pointer shrink-0" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                I accept the{" "}
                <Link href="#" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 underline decoration-cyan-500/30 underline-offset-4">Terms</Link>
                {" "}and{" "}
                <Link href="#" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 underline decoration-cyan-500/30 underline-offset-4">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-poppins font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center gap-3 mt-4 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] disabled:opacity-50">
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Initialize Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
            <span className="flex-shrink mx-4 text-slate-300 dark:text-slate-600 text-[9px] font-black tracking-[0.3em] uppercase">SSO Registration</span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
          </div>

          <GoogleButton text="Sign up with Google" />

          <p className="text-center mt-10 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Already registered?{" "}
            <Link href="/login" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700">Authorize Session</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
