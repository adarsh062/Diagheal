"use client";

import { motion } from "framer-motion";
import { Apple, Leaf, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

const DIET_PLANS = [
    {
        title: "Liver Support Diet",
        desc: "Focus on cruciferous vegetables, beets, and fatty fish to support natural detoxification.",
        calories: "1800-2000 kcal",
        icon: <Leaf className="w-5 h-5 md:w-6 md:h-6" />,
        color: "bg-emerald-50 text-emerald-600",
        tags: ["Low Fat", "High Antioxidant"]
    },
    {
        title: "High Fiber Reset",
        desc: "Whole grains, legumes, and berries to improve digestion and reduce cholesterol levels.",
        calories: "2100-2300 kcal",
        icon: <Apple className="w-5 h-5 md:w-6 md:h-6" />,
        color: "bg-orange-50 text-orange-600",
        tags: ["Heart Healthy", "Weight Loss"]
    },
    {
        title: "Omega-Rich Protocol",
        desc: "Walnuts, chia seeds, and cold-pressed oils to combat inflammation and boost brain health.",
        calories: "2200 kcal",
        icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />,
        color: "bg-blue-50 text-blue-600",
        tags: ["Anti-Inflammatory", "Brain Boost"]
    }
];

export default function DietPlans() {
    return (
        <section className="space-y-6 md:space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-3xl font-poppins font-black text-slate-900 dark:text-white tracking-tight">Recommended Diet Plans</h2>
                    <p className="text-[10px] md:text-sm text-slate-400 dark:text-slate-500 font-barlow mt-0.5 uppercase tracking-widest">Tailored nutrition for your health markers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {DIET_PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative bg-white/60 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm hover:shadow-2xl transition-all"
                    >
                        <div className={`w-10 h-10 md:w-14 md:h-14 ${plan.color} rounded-2xl flex items-center justify-center mb-4 md:mb-8 group-hover:rotate-6 transition-transform`}>
                            {plan.icon}
                        </div>
                        
                        <h3 className="font-poppins font-black text-slate-900 dark:text-white text-base md:text-xl mb-1 md:mb-2">{plan.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-barlow leading-relaxed mb-4 md:mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                            {plan.desc}
                        </p>

                        <div className="hidden md:flex flex-wrap gap-2 mb-8">
                            {plan.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-50 dark:border-white/5">
                            <span className="text-[9px] md:text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">{plan.calories}</span>
                            <Link href="/dashboard/diet-plan" className="text-[10px] md:text-xs font-black text-cyan-600 hover:text-cyan-700 uppercase tracking-widest transition-colors flex items-center gap-1 group-hover:gap-2">
                                Details <ChevronRight size={14} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
