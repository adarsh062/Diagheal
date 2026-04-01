"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

// ── Types ──────────────────────────────────────────────────────────────────
type User = { id: string; name: string; email: string; plan?: "free" | "pro" };
type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    freeReportsUsed: number;
    incrementFreeReports: () => void;
    canAnalyze: boolean; // true if logged in OR has free quota left
    status: "loading" | "authenticated" | "unauthenticated";
};

const FREE_LIMIT = 3;
const FREE_REPORTS_KEY = "diagheal_free_reports";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [freeReportsUsed, setFreeReportsUsed] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const freeUsed = parseInt(localStorage.getItem(FREE_REPORTS_KEY) ?? "0", 10);
            setFreeReportsUsed(freeUsed);
        } catch { /* ignore */ }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        if (!email || !password) return { success: false, error: "Please fill in all fields." };
        if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password
        });

        if (res?.error) {
            return { success: false, error: "Invalid email or password" };
        }
        return { success: true };
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string) => {
        if (!name || !email || !password) return { success: false, error: "Please fill in all fields." };
        if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                return { success: false, error: data.error || "Signup failed" };
            }
            
            // Automatically sign in after signup
            return login(email, password);
        } catch (error) {
            return { success: false, error: "Network error occurred." };
        }
    }, [login]);

    const logout = useCallback(() => {
        signOut({ callbackUrl: "/" });
    }, []);

    const incrementFreeReports = useCallback(() => {
        const next = freeReportsUsed + 1;
        setFreeReportsUsed(next);
        localStorage.setItem(FREE_REPORTS_KEY, String(next));
    }, [freeReportsUsed]);

    const mappedUser = session?.user ? { 
        id: session.user.id || "",
        name: session.user.name || "", 
        email: session.user.email || "", 
        plan: "free" as const 
    } : null;

    const canAnalyze = status === "authenticated" || freeReportsUsed < FREE_LIMIT;

    return (
        <AuthContext.Provider value={{ 
            user: mappedUser, 
            isLoggedIn: status === "authenticated", 
            login, 
            signup, 
            logout, 
            freeReportsUsed, 
            incrementFreeReports, 
            canAnalyze,
            status
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProviderContent>{children}</AuthProviderContent>
        </SessionProvider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
