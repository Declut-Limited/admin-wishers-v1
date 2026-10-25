import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PageLoader } from "@/components/PageLoader";
import { Splash } from "@/components/Splash";
import { useAuth } from "@/contexts/AuthContext";

// Signed-in admins only. Desktop layout: fixed sidebar, top bar, page.
export default function ProtectedRoute() {
    const { admin, restoring } = useAuth();

    if (restoring) return <Splash />;
    if (!admin) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-dvh bg-background">
            <Sidebar />
            <div className="pl-64">
                <TopBar />
                <main className="mx-auto w-full max-w-7xl px-8 py-8">
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
