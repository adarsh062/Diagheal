"use client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

export default function FreeTrialPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">Limited Time Offer</span>
                <h1 className="text-4xl md:text-6xl font-poppins font-bold text-black dark:text-white mb-6">Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600">Free Trial</span></h1>
                <p className="text-gray-600 dark:text-gray-400 font-barlow text-lg max-w-2xl mx-auto leading-relaxed">
                    Experience the full power of DiagHeal's AI analysis. Unlimited reports, instant results, and detailed health tracking for 7 days.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* Features List */}
                <div className="space-y-8">
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[2rem] p-8 shadow-sm transition-colors duration-300">
                        <h3 className="text-xl font-bold font-poppins mb-6 text-gray-900 dark:text-white">What's included?</h3>
                        <ul className="space-y-4">
                            {[
                                "Unlimited AI Liver Analysis",
                                "Detailed PDF Reports",
                                "Historical Trend Tracking",
                                "Priority Doctor Recommendations",
                                "24/7 AI Health Assistant"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-barlow">
                                    <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-cyan-900 text-white rounded-[2rem] p-8 shadow-lg relative overflow-hidden dark:border dark:border-white/10">
                        <div className="relative z-10">
                            <p className="text-cyan-200 text-sm font-bold uppercase tracking-wider mb-2">Pro Tip</p>
                            <p className="text-lg font-barlow">"Early detection is key. Our AI helps check for biomarkers that often go unnoticed."</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Signup Form */}
                <div className="bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-cyan-100/50 dark:shadow-none transition-colors duration-300">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 font-barlow uppercase tracking-wider">Full Name</label>
                                <input type="text" required className="w-full px-6 py-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 font-barlow uppercase tracking-wider">Email Address</label>
                                <input type="email" required className="w-full px-6 py-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="john@example.com" />
                            </div>
                            <div>
                                <Button variant="primary" className="w-full py-4 !text-lg shadow-cyan-200/50 dark:shadow-none mt-4">Start 7-Day Free Trial</Button>
                            </div>
                            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                                No credit card required. By signing up, you agree to our <Link href="#" className="underline hover:text-cyan-600 dark:hover:text-cyan-400">Terms</Link>.
                            </p>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Aboard!</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Your account has been created. Check your email for verification.</p>
                            <Link href="/dashboard">
                                <Button variant="primary" className="w-full dark:shadow-none">Go to Dashboard</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
