import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui-admin";
import { api, tokenStore } from "@/lib/api";
import { errorMessage } from "@/utils/helper";

const HINT = "At least 8 characters, with a letter and a number.";

// The admin's own password. The API returns fresh tokens, so this session stays signed in.
export function ChangePassword() {
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.current || !form.next || !form.confirm) return toast.error("Fill in all three fields");
        if (form.next.length < 8 || !/[A-Za-z]/.test(form.next) || !/\d/.test(form.next)) return toast.error(HINT);
        if (form.next !== form.confirm) return toast.error("New passwords do not match");

        setSaving(true);
        try {
            const tokens = await api<{ accessToken: string; refreshToken: string }>("/admin/auth/change-password", {
                method: "PATCH",
                body: { currentPassword: form.current, newPassword: form.next },
            });
            tokenStore.set(tokens.accessToken, tokens.refreshToken);
            setForm({ current: "", next: "", confirm: "" });
            toast.success("Password changed");
        } catch (err) {
            toast.error(errorMessage(err, "Could not change your password"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Panel title="Change password">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5" noValidate>
                <div className="grid grid-cols-3 gap-5">
                    <FormField id="currentPassword" label="Current password">
                        <PasswordInput id="currentPassword" autoComplete="current-password" placeholder="Enter your current password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
                    </FormField>
                    <FormField id="newPassword" label="New password">
                        <PasswordInput id="newPassword" autoComplete="new-password" placeholder="Create a new password" maxLength={64} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
                    </FormField>
                    <FormField id="confirmPassword" label="Confirm new password">
                        <PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="Re-enter the new password" maxLength={64} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
                    </FormField>
                </div>
                <p className="-mt-2 text-xs text-muted-foreground">{HINT} Other sessions are signed out.</p>
                <div>
                    <Button type="submit" disabled={saving || !form.current || !form.next || !form.confirm} className="font-bold">{saving ? "Saving…" : "Change password"}</Button>
                </div>
            </form>
        </Panel>
    );
}
