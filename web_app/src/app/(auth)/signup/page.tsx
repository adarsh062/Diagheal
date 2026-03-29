"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/ui/GoogleButton";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

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
    <main className="relative min-h-screen w-full flex bg-[#f2f2eb] dark:bg-dark-bg transition-colors duration-300 overflow-hidden">

      {/* ── LEFT: Image Panel ── */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700/80 to-cyan-800/80 z-10" />
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
          alt="Medical professionals"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Content over image */}
        <div className="relative z-20 px-12 max-w-lg text-white">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-4xl font-poppins font-bold leading-tight mb-4">
            Start Your<br />Health Journey.
          </h2>
          <p className="text-cyan-100 font-barlow text-base leading-relaxed mb-8">
            Join thousands of users who already trust DiagHeal for AI-powered medical report analysis. Your first 3 reports are on us.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {["AI Analysis", "Instant Results", "Doctor Connect", "Secure & Private"].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold text-white font-barlow tracking-wide border border-white/20">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        {/* BG Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-teal-400 blur-[120px] opacity-20 dark:opacity-10 rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600 blur-[120px] opacity-15 dark:opacity-10 rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-3xl font-poppins font-semibold text-black dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 font-barlow text-sm tracking-wide">Join DiagHeal for AI-powered health insights.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm font-barlow flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full pl-11 pr-5 py-3.5 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-neutral-800 dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-poppins text-sm" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-11 pr-5 py-3.5 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-neutral-800 dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-poppins text-sm" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                <input type={showPw ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-neutral-800 dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-poppins text-sm" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-cyan-600 transition">
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-cyan-600 cursor-pointer shrink-0" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-barlow leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-cyan-700 dark:text-cyan-400 font-bold hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="text-cyan-700 dark:text-cyan-400 font-bold hover:underline">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-poppins font-semibold rounded-xl transition-all shadow-lg shadow-cyan-200/40 dark:shadow-none flex items-center justify-center gap-2 mt-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</> : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-neutral-300/40 dark:border-white/10" />
            <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-[10px] font-barlow tracking-widest uppercase">Or join with</span>
            <div className="flex-grow border-t border-neutral-300/40 dark:border-white/10" />
          </div>

          <GoogleButton text="Sign up with Google" />

          <p className="text-center mt-5 text-sm text-gray-500 dark:text-gray-400 font-barlow">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-700 dark:text-cyan-400 font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
