import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Splash } from "@/components/Splash";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/utils/helper";

// Centred card, same as the web app's auth screens.
export default function Login() {
    const { admin, restoring, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (restoring) return <Splash />;
    if (admin) return <Navigate to="/" replace />;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return toast.error("Enter your email and password");
        setLoading(true);
        try {
            await login(email.trim(), password);
            navigate("/", { replace: true });
        } catch (err) {
            toast.error(errorMessage(err, "Could not log in"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-secondary/60 px-4 py-10 dark:bg-background">
            <div className="absolute top-4 right-4"><ThemeToggle /></div>
            <div className="w-full max-w-md">
                <img src={logo} alt="Wishers" className="mx-auto mb-6 size-16 rounded-2xl shadow-lg shadow-brand/20" />
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border bg-card p-8 shadow-sm" noValidate>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Wishers Admin</h1>
                        <p className="mt-1.5 text-muted-foreground">Sign in to manage users, wishlists and payments.</p>
                    </div>
                    <FormField id="email" label="Email">
                        <Input id="email" type="email" autoComplete="email" placeholder="admin@wishers.app" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" autoFocus />
                    </FormField>
                    <FormField id="password" label="Password">
                        <PasswordInput id="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormField>
                    <Button type="submit" size="lg" className="h-11 font-bold" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
                </form>
            </div>
        </div>
    );
}
