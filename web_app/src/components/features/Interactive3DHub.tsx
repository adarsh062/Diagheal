"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Interactive3DHub() {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values to track mouse position (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to make the movement fluid and premium
  const smoothX = useSpring(x, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 20 });

  // Map mouse movement to realistic rotation angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate relative mouse position (0 to 1)
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;
    
    // Convert to -0.5 to 0.5 scale
    x.set(mouseX - 0.5);
    y.set(mouseY - 0.5);
  };

  const handleMouseLeave = () => {
    // Return to default center position smoothly
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative z-20 w-full max-w-4xl mx-auto px-4 mt-10 pb-16 flex justify-center pointer-events-none" 
      style={{ perspective: 1500 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" 
        }}
        className="relative w-full aspect-[2/1] min-h-[250px] sm:min-h-[300px] max-h-[400px] rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent dark:from-slate-800/20 dark:to-transparent backdrop-blur-sm border border-white/20 dark:border-slate-700/30 flex items-center justify-center pointer-events-auto cursor-crosshair group shadow-2xl"
      >
        {/* Glow behind the scene */}
        <div className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 bg-gradient-to-tr from-cyan-400/10 via-transparent to-emerald-400/10 blur-3xl pointer-events-none"></div>

        {/* ── 3D Layer 1: Base Rings ── */}
        <motion.div 
          style={{ translateZ: 30, transformStyle: "preserve-3d" }}
          className="absolute flex items-center justify-center pointer-events-none"
        >
          <div className="w-[180px] sm:w-[240px] h-[180px] sm:h-[240px] rounded-full border border-cyan-400/20 dark:border-cyan-800/40 shadow-[0_0_40px_rgba(34,211,238,0.1)]"></div>
          <motion.div 
             className="absolute w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] rounded-full border border-dashed border-teal-400/40 dark:border-teal-700/50"
             animate={{ rotate: 360 }}
             transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          ></motion.div>
        </motion.div>

        {/* ── 3D Layer 2: Floating Information Cards ── */}
        <motion.div 
          style={{ translateZ: 80 }}
          className="absolute left-[-5%] sm:left-[5%] top-[15%] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white dark:border-slate-700 shadow-xl pointer-events-none"
        >
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Engine Core
          </p>
          <div className="h-1.5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500 rounded-full" style={{ width: "85%" }}></div>
          </div>
        </motion.div>

        <motion.div 
          style={{ translateZ: 60 }}
          className="absolute right-[-2%] sm:right-[10%] bottom-[15%] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white dark:border-slate-700 shadow-xl flex items-center gap-3 pointer-events-none"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-inner">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite]"></div>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Connection</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white font-poppins">Secure Node</p>
          </div>
        </motion.div>

        {/* ── 3D Layer 3: The Centerpiece Jewel ── */}
        <motion.div 
           style={{ translateZ: 140 }}
           className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-teal-500 shadow-[0_20px_50px_rgba(6,182,212,0.4)] dark:shadow-[0_20px_50px_rgba(6,182,212,0.2)] flex items-center justify-center pointer-events-none"
        >
           <div className="absolute inset-0 bg-white/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
           <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </motion.div>

        <motion.div 
           style={{ translateZ: 40 }}
           className="absolute bottom-6 w-full text-center pointer-events-none"
        >
           <p className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-cyan-800/50 dark:text-cyan-200/40">
              Interactive Hardware Acceleration
           </p>
        </motion.div>

      </motion.div>
    </div>
  );
}
