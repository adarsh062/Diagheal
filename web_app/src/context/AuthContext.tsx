"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type User = { name: string; email: string; plan: "free" | "pro" };
type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    freeReportsUsed: number;
    incrementFreeReports: () => void;
    canAnalyze: boolean; // true if logged in OR has free quota left
};

const FREE_LIMIT = 3;
const STORAGE_KEY = "diagheal_user";
const FREE_REPORTS_KEY = "diagheal_free_reports";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [freeReportsUsed, setFreeReportsUsed] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Restore user session
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setUser(JSON.parse(stored));
            const freeUsed = parseInt(localStorage.getItem(FREE_REPORTS_KEY) ?? "0", 10);
            setFreeReportsUsed(freeUsed);
        } catch { /* ignore */ }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        // Simulate API – accept any non-empty credentials
        if (!email || !password) return { success: false, error: "Please fill in all fields." };
        if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

        const userData: User = {
            name: email.split("@")[0].replace(/[._]/g, " "),
            email,
            plan: "free",
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return { success: true };
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string) => {
        if (!name || !email || !password) return { success: false, error: "Please fill in all fields." };
        if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

        const userData: User = { name, email, plan: "free" };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const incrementFreeReports = useCallback(() => {
        const next = freeReportsUsed + 1;
        setFreeReportsUsed(next);
        localStorage.setItem(FREE_REPORTS_KEY, String(next));
    }, [freeReportsUsed]);

    const canAnalyze = !!user || freeReportsUsed < FREE_LIMIT;

    if (!mounted) return null; // avoid hydration mismatch

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, freeReportsUsed, incrementFreeReports, canAnalyze }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
