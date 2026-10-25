import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setSessionExpiredHandler, tokenStore } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import type { Admin } from "@/lib/types";

type AuthContextType = {
    admin: Admin | null;
    restoring: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [restoring, setRestoring] = useState(!!tokenStore.getRefresh());

    const clearSession = useCallback(() => {
        tokenStore.clear();
        queryClient.clear();
        setAdmin(null);
    }, []);

    useEffect(() => {
        setSessionExpiredHandler(clearSession);
        if (!tokenStore.getRefresh()) return;
        api<Admin>("/admin/auth/me")
            .then(setAdmin)
            .catch(() => clearSession())
            .finally(() => setRestoring(false));
    }, [clearSession]);

    const login = async (email: string, password: string) => {
        const res = await api<{ accessToken: string; refreshToken: string }>("/admin/auth/login", { method: "POST", body: { email, password }, auth: false });
        tokenStore.set(res.accessToken, res.refreshToken);
        setAdmin(await api<Admin>("/admin/auth/me"));
    };

    const logout = async () => {
        const refreshToken = tokenStore.getRefresh();
        if (refreshToken) await api("/admin/auth/logout", { method: "POST", body: { refreshToken }, auth: false }).catch(() => {});
        clearSession();
    };

    return <AuthContext.Provider value={{ admin, restoring, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
