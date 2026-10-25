import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormField } from "@/components/form/FormField";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel } from "@/components/ui-admin";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import type { Settings } from "@/lib/types";
import { errorMessage, formatDateTime } from "@/utils/helper";
import { ChangePassword } from "./components/ChangePassword";

type NumberKey = Exclude<keyof Settings, "shouldDisplayConfetti" | "updatedAt">;

const GROUPS: { title: string; fields: { key: NumberKey; label: string; hint?: string; step?: string }[] }[] = [
    {
        title: "Limits",
        fields: [
            { key: "wishlistCreationLimit", label: "Wishlists per user" },
            { key: "wishItemCreationLimit", label: "Wishes per wishlist" },
            { key: "maxWishItemImages", label: "Images per wish", hint: "1 to 10" },
        ],
    },
    {
        title: "Amounts (₦)",
        fields: [
            { key: "minGoalAmount", label: "Minimum goal" },
            { key: "maxGoalAmount", label: "Maximum goal" },
            { key: "maxGoalAmountDigits", label: "Goal amount digits", hint: "Longest number the app accepts" },
            { key: "minContributionAmount", label: "Minimum contribution" },
        ],
    },
    {
        title: "Contribution split (%)",
        fields: [
            { key: "wisherSharePercentage", label: "Wisher's share", step: "0.1" },
            { key: "referrerSharePercentage", label: "Referrer's share", hint: "Only paid when the referrer has bank details", step: "0.1" },
        ],
    },
];

function SettingsForm({ settings }: { settings: Settings }) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState(() => Object.fromEntries(GROUPS.flatMap((g) => g.fields).map((f) => [f.key, String(settings[f.key])])) as Record<NumberKey, string>);
    const [confetti, setConfetti] = useState(settings.shouldDisplayConfetti);
    const [saving, setSaving] = useState(false);

    const wisher = Number(form.wisherSharePercentage);
    const referrer = Number(form.referrerSharePercentage);
    const wishersKeep = Math.max(0, 100 - wisher - referrer);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const body: Record<string, number | boolean> = { shouldDisplayConfetti: confetti };
        for (const [key, value] of Object.entries(form)) {
            const n = Number(value);
            if (value === "" || Number.isNaN(n)) return toast.error("Fill in every field with a number");
            if (n !== settings[key as NumberKey]) body[key] = n;
        }
        setSaving(true);
        try {
            await api("/admin/settings", { method: "PATCH", body });
            await queryClient.invalidateQueries({ queryKey: ["/admin/settings"] });
            toast.success("Settings saved");
        } catch (err) {
            toast.error(errorMessage(err, "Could not save settings"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {GROUPS.map((g) => (
                <Panel key={g.title} title={g.title}>
                    <div className="grid grid-cols-3 gap-5 p-5">
                        {g.fields.map((f) => (
                            <FormField key={f.key} id={f.key} label={f.label} hint={f.hint}>
                                <Input id={f.key} type="number" inputMode="decimal" step={f.step ?? "1"} min={0} placeholder="0" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="h-10" />
                            </FormField>
                        ))}
                        {g.title.startsWith("Contribution split") && (
                            <div className="flex flex-col justify-center rounded-xl bg-secondary px-4 py-3 text-sm">
                                <span className="text-muted-foreground">Wishers keeps</span>
                                <span className={wisher + referrer > 100 ? "text-lg font-extrabold text-destructive" : "text-lg font-extrabold"}>{wishersKeep.toFixed(1)}%</span>
                            </div>
                        )}
                    </div>
                </Panel>
            ))}

            <Panel title="App">
                <label className="flex cursor-pointer items-center gap-3 p-5 text-sm">
                    <input type="checkbox" checked={confetti} onChange={(e) => setConfetti(e.target.checked)} className="size-4 accent-[var(--primary)]" />
                    <span>
                        <span className="block font-semibold">Show confetti</span>
                        <span className="text-muted-foreground">Celebrate on the app when a contribution arrives.</span>
                    </span>
                </label>
            </Panel>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={saving} className="font-bold">{saving ? "Saving…" : "Save settings"}</Button>
                {settings.updatedAt && <span className="text-sm text-muted-foreground">Last changed {formatDateTime(settings.updatedAt)}</span>}
            </div>
        </form>
    );
}

export default function SettingsPage() {
    const { data, isPending, error } = useApi<Settings>("/admin/settings");

    return (
        <div className="max-w-5xl">
            <PageHeader title="Settings" description="App limits, the contribution split, and your password." />
            {isPending ? <Skeleton className="h-96 rounded-2xl" /> : error || !data ? <p className="text-muted-foreground">{error?.message}</p> : <SettingsForm key={data.updatedAt} settings={data} />}
            <div className="mt-8">
                <ChangePassword />
            </div>
        </div>
    );
}
