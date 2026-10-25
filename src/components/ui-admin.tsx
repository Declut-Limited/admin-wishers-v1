import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { PiCaretLeftBold, PiCaretRightBold, PiMagnifyingGlassBold } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Small building blocks shared by the admin pages.

export function StatCard({ label, value, hint, icon: Icon, loading, highlight }: { label: string; value: string; hint?: string; icon: IconType; loading?: boolean; highlight?: boolean }) {
    return (
        <div className={cn("relative overflow-hidden rounded-2xl border p-5", highlight ? "border-transparent bg-linear-to-br from-brand-light to-brand-dark text-white" : "bg-card")}>
            <div className="flex items-center justify-between gap-2">
                <p className={cn("text-sm font-semibold", highlight ? "text-white/80" : "text-muted-foreground")}>{label}</p>
                <span className={cn("flex size-9 items-center justify-center rounded-xl", highlight ? "bg-white/15" : "bg-accent text-accent-foreground")}>
                    <Icon className="size-[18px]" aria-hidden />
                </span>
            </div>
            {loading ? <Skeleton className={cn("mt-3 h-8 w-28", highlight && "bg-white/20")} /> : <p className="mt-2 truncate text-[1.75rem] leading-tight font-extrabold tabular-nums">{value}</p>}
            {hint && <p className={cn("mt-1 truncate text-xs", highlight ? "text-white/70" : "text-muted-foreground")}>{hint}</p>}
        </div>
    );
}

export function Panel({ title, actions, children, className }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <section className={cn("overflow-hidden rounded-2xl border bg-card", className)}>
            {(title || actions) && (
                <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
                    {title && <h2 className="font-bold">{title}</h2>}
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="relative w-72">
            <PiMagnifyingGlassBold className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-9 pl-9" />
        </div>
    );
}

export function Pagination({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (p: number) => void }) {
    const pages = Math.max(1, Math.ceil(total / limit));
    const from = total ? (page - 1) * limit + 1 : 0;
    const to = Math.min(page * limit, total);
    return (
        <div className="flex items-center justify-between gap-4 border-t px-5 py-3 text-sm text-muted-foreground">
            <span>{from}–{to} of {total.toLocaleString()}</span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onPage(page - 1)} disabled={page <= 1}><PiCaretLeftBold /> Previous</Button>
                <span className="px-1">Page {page} of {pages}</span>
                <Button variant="outline" size="sm" onClick={() => onPage(page + 1)} disabled={page >= pages}>Next <PiCaretRightBold /></Button>
            </div>
        </div>
    );
}

const TONES: Record<string, string> = {
    green: "bg-brand-mint text-brand-dark dark:bg-brand-dark dark:text-brand-mint",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    red: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    grey: "bg-secondary text-muted-foreground",
};

const STATUS_TONE: Record<string, keyof typeof TONES> = {
    active: "green", success: "green", settled: "green", completed: "green",
    pending: "amber", settling: "amber", open: "grey",
    suspended: "red", failed: "red", deactivated: "grey",
};

export function StatusBadge({ status }: { status: string }) {
    return <Badge className={cn("font-bold capitalize", TONES[STATUS_TONE[status] ?? "grey"])}>{status}</Badge>;
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
    return <div className="space-y-3 p-5">{Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-10" />)}</div>;
}

export function TableMessage({ children }: { children: ReactNode }) {
    return <p className="px-5 py-12 text-center text-sm text-muted-foreground">{children}</p>;
}
