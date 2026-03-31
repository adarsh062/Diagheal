"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f2f2eb] dark:bg-dark-bg transition-colors duration-500">

      {/* ── Animated Dot Grid Background ── */}
      <div className="dot-grid absolute inset-0 pointer-events-none z-0" />

      {/* ── Medical ECG Line ── */}
      <div className="absolute top-1/3 left-0 right-0 pointer-events-none z-0 opacity-30 dark:opacity-15 overflow-hidden">
        <svg viewBox="0 0 1200 100" className="w-full h-20 ecg-glow" preserveAspectRatio="none">
          <polyline
            className="ecg-line"
            points="0,50 100,50 120,50 140,20 160,80 180,10 200,90 220,50 300,50 350,50 370,30 390,70 410,50 500,50 550,50 570,15 585,85 600,50 700,50 750,50 770,35 790,65 810,50 900,50 1000,50 1020,25 1040,75 1060,50 1200,50"
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="30%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="70%" stopColor="#14b8a6" stopOpacity="1" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Floating Medical Particles ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Molecule cross */}
        <motion.div 
          animate={{ rotate: 360, y: [-10, 10, -10] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="medical-particle-1 absolute top-[15%] right-[8%] w-8 h-8 opacity-20 dark:opacity-10"
        >
          <svg viewBox="0 0 32 32" fill="none" stroke="#06b6d4" strokeWidth="2">
            <circle cx="16" cy="16" r="4" fill="#06b6d4" fillOpacity="0.3" />
            <circle cx="4" cy="16" r="2.5" fill="#06b6d4" fillOpacity="0.2" />
            <circle cx="28" cy="16" r="2.5" fill="#06b6d4" fillOpacity="0.2" />
            <circle cx="16" cy="4" r="2.5" fill="#06b6d4" fillOpacity="0.2" />
            <circle cx="16" cy="28" r="2.5" fill="#06b6d4" fillOpacity="0.2" />
            <line x1="6.5" y1="16" x2="12" y2="16" />
            <line x1="20" y1="16" x2="25.5" y2="16" />
            <line x1="16" y1="6.5" x2="16" y2="12" />
            <line x1="16" y1="20" x2="16" y2="25.5" />
          </svg>
        </motion.div>
        {/* DNA */}
        <motion.div 
          animate={{ y: [-20, 20, -20], rotate: [-10, 10, -10] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="medical-particle-2 absolute top-[60%] left-[5%] w-10 h-10 opacity-15 dark:opacity-8"
        >
          <svg viewBox="0 0 40 40" fill="none" stroke="#14b8a6" strokeWidth="1.5">
            <path d="M10 5 Q20 15 10 25 Q20 35 10 45" strokeLinecap="round" />
            <path d="M30 5 Q20 15 30 25 Q20 35 30 45" strokeLinecap="round" />
            <line x1="13" y1="10" x2="27" y2="10" strokeOpacity="0.6" />
            <line x1="11" y1="18" x2="29" y2="18" strokeOpacity="0.6" />
            <line x1="13" y1="26" x2="27" y2="26" strokeOpacity="0.6" />
          </svg>
        </motion.div>
        {/* Plus sign */}
        <motion.div 
          animate={{ rotateY: [0, 360], scale: [0.8, 1.2, 0.8] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="medical-particle-3 absolute top-[25%] left-[12%] w-6 h-6 opacity-20 dark:opacity-10"
        >
          <svg viewBox="0 0 24 24" fill="#06b6d4">
            <rect x="10" y="3" width="4" height="18" rx="2" />
            <rect x="3" y="10" width="18" height="4" rx="2" />
          </svg>
        </motion.div>
        {/* Atom ring */}
        <motion.div 
          animate={{ rotateZ: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="medical-particle-4 absolute bottom-[20%] right-[12%] w-12 h-12 opacity-10 dark:opacity-5"
        >
          <svg viewBox="0 0 48 48" fill="none" stroke="#0891b2" strokeWidth="1.5">
            <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(0 24 24)" />
            <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
            <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)" />
            <circle cx="24" cy="24" r="3" fill="#0891b2" />
          </svg>
        </motion.div>
        {/* Heartbeat dot */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="medical-particle-5 absolute top-[70%] right-[20%] w-5 h-5 opacity-25 dark:opacity-12"
        >
          <svg viewBox="0 0 20 20" fill="#06b6d4">
            <path d="M10 17.5 L2.5 10 A5 5 0 0 1 10 2.5 A5 5 0 0 1 17.5 10Z" />
          </svg>
        </motion.div>
      </div>

      {/* ── Floating Glow Orbs ── */}
      <div className="orb-a absolute top-[-80px] left-[-80px] w-[500px] h-[500px] bg-teal-400 blur-[110px] opacity-25 dark:opacity-10 rounded-full pointer-events-none z-0" />
      <div className="orb-b absolute bottom-[-60px] right-[-60px] w-[600px] h-[600px] bg-cyan-500 blur-[130px] opacity-20 dark:opacity-10 rounded-full pointer-events-none z-0" />
      <div className="orb-c absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-300 blur-[120px] opacity-10 dark:opacity-5 rounded-full pointer-events-none z-0" />

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-28 md:pt-40 flex flex-col lg:flex-row items-center justify-between gap-10 pb-4 overflow-hidden">
        <motion.div 
           initial={{ opacity: 0, x: -60 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="lg:w-[58%] space-y-5 relative z-20 text-center lg:text-left"
        >
          <p className="hero-tag text-gray-600 dark:text-cyan-400 font-poppins tracking-[2px] uppercase text-xs font-semibold">
            AI-powered health insights for better living.
          </p>
          <h1 className="hero-h1 text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-poppins text-black dark:text-white leading-[1.1] font-normal">
            Understand <br className="hidden sm:block" />Your Health <br className="hidden sm:block" />Better
          </h1>
          <p className="hero-sub max-w-xl mx-auto lg:mx-0 text-gray-500 dark:text-gray-300 font-poppins text-base leading-relaxed tracking-wide">
            DiagHeal uses AI to analyze liver and kidney reports, predict health risks, and help you track your progress over time.
          </p>
          <div className="hero-cta flex flex-wrap gap-4 pt-2 justify-center lg:justify-start relative z-30">
            <Link href="/dashboard">
              <Button variant="primary">Check Your Report</Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
           initial={{ opacity: 0, x: 60, rotateY: -15, scale: 0.9 }}
           animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="hero-image lg:w-1/2 relative mt-6 lg:mt-0 hidden lg:flex justify-center lg:justify-end w-full"
           style={{ perspective: 1200 }}
        >
          <div className="relative w-[280px] h-[320px] sm:w-[360px] sm:h-[400px] md:w-[420px] md:h-[470px] flex justify-center items-center" style={{ transformStyle: "preserve-3d" }}>
            
             {/* ── 3D Medical Animations Behind Image ── */}
             
             {/* Orbital Ring 1 */}
             <motion.div 
               className="absolute w-[110%] h-[110%] rounded-full border-2 border-cyan-400/30 dark:border-cyan-500/40 border-dashed z-0 pointer-events-none"
               animate={{ rotateX: [0, 360], rotateY: [0, 180], rotateZ: [0, 360] }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               style={{ transformStyle: "preserve-3d" }}
             />
             
             {/* Orbital Ring 2 */}
             <motion.div 
               className="absolute w-[90%] h-[90%] rounded-full border-2 border-teal-300/40 dark:border-teal-400/30 z-0 pointer-events-none"
               animate={{ rotateX: [360, 0], rotateY: [180, 0], rotateZ: [360, 0] }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               style={{ transformStyle: "preserve-3d" }}
             />

             {/* Floating 3D Medical Crosses */}
             <motion.div 
               className="absolute top-[0%] left-[0%] text-cyan-500/50 z-0 pointer-events-none"
               animate={{ rotateY: [0, 360], rotateX: [0, 360], y: [-20, 20, -20] }}
               transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
             >
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v9H2v2h9v9h2v-9h9v-2h-9V2z"/></svg>
             </motion.div>

             <motion.div 
               className="absolute bottom-[5%] right-[-5%] text-teal-500/50 z-0 pointer-events-none"
               animate={{ rotateX: [0, 360], rotateY: [0, 360], y: [20, -20, 20] }}
               transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
             >
               <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v9H2v2h9v9h2v-9h9v-2h-9V2z"/></svg>
             </motion.div>

             {/* Pulsing Core Organ/Blob */}
             <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/40 backdrop-blur-3xl z-0 scale-75 rotate-[12deg] animate-[spin_15s_linear_infinite]"
               style={{ borderRadius: "40% 40% 70% 30% / 60% 40% 60% 30%" }} />

             <Image src="/assets/hero-image.png" alt="Medical Analysis" fill className="object-contain z-10 relative drop-shadow-[0_20px_50px_rgba(6,182,212,0.3)] dark:drop-shadow-[0_20px_50px_rgba(6,182,212,0.15)]" priority />
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-4 py-1.5 rounded-full mb-4 border border-cyan-100 dark:border-cyan-800/40">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-semibold text-black dark:text-white mb-4">How DiagHeal Works</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-barlow text-base">Get detailed health insights in just 3 simple steps.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              color: "cyan",
              num: "01",
              title: "Upload Report",
              desc: "Simply drag & drop your PDF or image report. We support Liver (LFT) tests with high accuracy.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
            },
            {
              color: "teal",
              num: "02",
              title: "AI Analysis",
              desc: "Our AI model scans your biomarker values, compares them with medical standards, and detects anomalies.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
            },
            {
              color: "blue",
              num: "03",
              title: "Get Results",
              desc: "Receive a comprehensive health score, ML-based risk prediction, and doctor recommendations.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
            },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, rotateX: 30, y: 70, scale: 0.9 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="group relative bg-white/40 dark:bg-slate-900/50 backdrop-blur-xl border border-white/50 dark:border-white/10 p-7 sm:p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100/40 dark:hover:shadow-none overflow-hidden"
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              {/* Step Number watermark */}
              <span className="absolute top-4 right-6 text-7xl font-poppins font-bold text-gray-100 dark:text-white/5 select-none leading-none">{step.num}</span>
              <div className={`w-14 h-14 bg-${step.color}-100 dark:bg-${step.color}-900/30 rounded-2xl flex items-center justify-center text-${step.color}-700 dark:text-${step.color}-400 mb-5`}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">{step.icon}</svg>
              </div>
              <h3 className="text-xl font-bold font-poppins text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-barlow">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pb-20 md:pb-28">
        {/* Subtle medical bg decoration */}
        <div className="dna-helix absolute right-0 top-0 w-64 h-full pointer-events-none overflow-hidden">
          <svg viewBox="0 0 260 600" className="h-full w-full opacity-5 dark:opacity-[0.03]" fill="none" stroke="#06b6d4" strokeWidth="2">
            <path d="M130 0 Q80 50 130 100 Q180 150 130 200 Q80 250 130 300 Q180 350 130 400 Q80 450 130 500 Q180 550 130 600" />
            <path d="M130 0 Q180 50 130 100 Q80 150 130 200 Q180 250 130 300 Q80 350 130 400 Q180 450 130 500 Q80 550 130 600" />
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line key={i} x1="80" y1={100 * i + 50} x2="180" y2={100 * i + 50} strokeOpacity="0.5" />
            ))}
          </svg>
        </div>

        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-4 py-1.5 rounded-full mb-4 border border-teal-100 dark:border-teal-800/40">Why DiagHeal</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-semibold text-black dark:text-white mb-4">Built for Your Health</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-barlow text-base">Every feature is designed with patient safety and clarity in mind.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: "🧬", title: "AI Vision", desc: "Auto-extracts biomarkers from scanned reports with high accuracy." },
            { icon: "🔒", title: "Privacy First", desc: "Your health data stays yours. We never sell or share your reports." },
            { icon: "📱", title: "Works Everywhere", desc: "Fully responsive across mobile, tablet, and desktop devices." },
            { icon: "🩺", title: "Doctor Referral", desc: "Get matched with verified specialists near you after your diagnosis." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, rotateY: 45, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-50 dark:hover:shadow-none transition-all duration-300"
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h4 className="font-poppins font-bold text-gray-900 dark:text-white mb-2 text-base">{f.title}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-barlow">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pb-20 md:pb-28">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-4 py-1.5 rounded-full mb-4 border border-cyan-100 dark:border-cyan-800/40">Trusted by Users</span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-semibold text-black dark:text-white mb-4">What People Are Saying</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              quote: "The report analysis helped me identify potential liver concerns early. A very reliable companion for health tracking.",
              name: "Adarsh M.",
              role: "Verified User, Mumbai",
              rating: 5,
            },
            {
              quote: "Extremely accurate biomarker extraction. It saves me time and gives peace of mind with clear explanations.",
              name: "Sneha K.",
              role: "Verified User, Delhi",
              rating: 5,
            },
            {
              quote: "Simple, fast, and very professional. The doctor consultation feature is a lifesaver for quick follow-ups.",
              name: "Vikram S.",
              role: "Verified User, Bangalore",
              rating: 5,
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotateX: -20, y: 50 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="bg-white/70 border border-gray-100 rounded-[2rem] p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array(t.rating).fill(0).map((_, si) => (
                  <svg key={si} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 font-barlow text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs font-poppins shrink-0">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm font-poppins">{t.name}</p>
                  <p className="text-xs text-gray-500 font-barlow">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pb-20 md:pb-28">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95, y: 40 }}
           whileInView={{ opacity: 1, scale: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.7, ease: "easeOut" }}
           className="relative rounded-[2.5rem] bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 p-10 md:p-14 overflow-hidden text-white text-center shadow-[0_20px_50px_rgba(6,182,212,0.3)] dark:shadow-none"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          {/* ECG decoration */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 600 80" className="w-full h-full" preserveAspectRatio="none">
              <polyline points="0,40 80,40 100,40 110,15 125,65 135,5 145,75 155,40 240,40 280,40 295,25 310,55 325,40 400,40 450,40 465,20 480,60 495,40 600,40"
                fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold mb-4">Ready to understand your health?</h2>
            <p className="text-cyan-100 font-barlow max-w-xl mx-auto mb-8 text-base">Upload your liver report today and get AI-powered insights in under 30 seconds.</p>
            <Link href="/dashboard">
              <button className="inline-flex items-center gap-2 bg-white text-cyan-700 font-bold font-poppins px-8 py-3.5 rounded-full hover:bg-cyan-50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-xl shadow-black/20 text-sm sm:text-base">
                Start Free Analysis
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 bg-white/80 dark:bg-dark-card/80 py-10 border-t border-white dark:border-slate-700 transition-colors">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo.png" alt="DiagHeal" width={96} height={28} className="object-contain opacity-80 dark:brightness-0 dark:invert" />
            <span className="text-gray-400 dark:text-gray-500 text-sm">© 2026 DiagHeal Inc.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
            <Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}