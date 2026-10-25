import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PiArrowLeftBold, PiProhibitBold, PiArrowCounterClockwiseBold } from "react-icons/pi";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Panel, StatusBadge, TableMessage } from "@/components/ui-admin";
import { UserAvatar } from "@/components/UserAvatar";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";
import type { BankAccount, User, Wallet, Wishlist } from "@/lib/types";
import { errorMessage, formatCurrency, formatDate, formatDateTime, percent } from "@/utils/helper";

type Detail = { user: User; wallet: Wallet | null; bankAccount: BankAccount | null; wishlists: Wishlist[] };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-4 px-5 py-3 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="truncate text-right font-semibold">{value}</dd>
        </div>
    );
}

export default function UserItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isPending, error } = useApi<Detail>(`/admin/users/${id}`);
    const [confirm, setConfirm] = useState(false);

    if (isPending) return <div className="space-y-6"><Skeleton className="h-32 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>;
    if (error || !data) return <p className="py-16 text-center text-muted-foreground">{error?.message || "User not found"}</p>;

    const { user, wallet, bankAccount, wishlists } = data;
    const suspended = user.accountStatus === "suspended";
    const deleted = user.accountStatus === "deactivated";

    const toggleStatus = async () => {
        try {
            await api(`/admin/users/${user._id}/status`, { method: "PATCH", body: { accountStatus: suspended ? "active" : "suspended" } });
            await queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("/admin/") });
            toast.success(suspended ? "User restored" : "User suspended and signed out");
        } catch (err) {
            toast.error(errorMessage(err, "Could not change the user's status"));
        }
    };

    const money = [
        { label: "All-time received", value: formatCurrency(wallet?.allTimeBalance ?? 0) },
        { label: "From contributions", value: formatCurrency(wallet?.contributedEarning ?? 0) },
        { label: "From referrals", value: formatCurrency(wallet?.referralEarnings ?? 0) },
        { label: "Pending", value: formatCurrency(wallet?.pendingBalance ?? 0) },
        { label: "Settled", value: formatCurrency(wallet?.settledBalance ?? 0) },
    ];

    return (
        <div className="flex flex-col gap-6">
            <Link to="/users" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><PiArrowLeftBold aria-hidden /> Users</Link>

            <section className="flex items-center gap-5 rounded-2xl border bg-card p-6">
                <UserAvatar name={user.name} image={user.image} className="size-20" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="truncate text-2xl font-extrabold tracking-tight">{user.name}</h1>
                        <StatusBadge status={deleted ? "deactivated" : user.accountStatus} />
                    </div>
                    <p className="truncate text-muted-foreground">{user.email}{user.phone ? ` · ${user.phone}` : ""}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Joined {formatDate(user.createdAt)} · Invite code <span className="font-mono font-semibold text-foreground">{user.inviteCode}</span></p>
                </div>
                {!deleted && (
                    <Button variant={suspended ? "default" : "outline"} onClick={() => setConfirm(true)} className={suspended ? "font-bold" : "font-bold text-destructive hover:text-destructive"}>
                        {suspended ? <><PiArrowCounterClockwiseBold /> Restore user</> : <><PiProhibitBold /> Suspend user</>}
                    </Button>
                )}
            </section>

            <div className="grid grid-cols-5 gap-4">
                {money.map((m, i) => (
                    <div key={m.label} className={i === 0 ? "rounded-2xl bg-linear-to-br from-brand-light to-brand-dark p-5 text-white" : "rounded-2xl border bg-card p-5"}>
                        <p className={i === 0 ? "text-sm font-semibold text-white/80" : "text-sm font-semibold text-muted-foreground"}>{m.label}</p>
                        <p className="mt-2 truncate text-2xl font-extrabold tabular-nums">{m.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
                <Panel title={`Wishlists (${wishlists.length})`}>
                    {!wishlists.length ? <TableMessage>No wishlists.</TableMessage> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-5">Wishlist</TableHead>
                                    <TableHead className="text-right">Raised</TableHead>
                                    <TableHead className="text-right">Goal</TableHead>
                                    <TableHead className="text-right">Givers</TableHead>
                                    <TableHead className="pr-5">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wishlists.map((w) => (
                                    <TableRow key={w._id} onClick={() => navigate(`/wishlists/${w._id}`)} className="cursor-pointer">
                                        <TableCell className="max-w-64 truncate pl-5 font-semibold">{w.title}</TableCell>
                                        <TableCell className="text-right tabular-nums">{formatCurrency(w.totalAmountReceived)} <span className="text-xs text-muted-foreground">({percent(w.totalAmountReceived, w.totalGoalAmount)}%)</span></TableCell>
                                        <TableCell className="text-right tabular-nums">{formatCurrency(w.totalGoalAmount)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{w.totalContributors}</TableCell>
                                        <TableCell className="pr-5"><StatusBadge status={w.isCompleted ? "completed" : "open"} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Panel>

                <div className="flex flex-col gap-6">
                    <Panel title="Payout account">
                        {bankAccount ? (
                            <dl className="divide-y">
                                <Row label="Bank" value={bankAccount.bankName} />
                                <Row label="Account" value={bankAccount.maskedAccountNumber || bankAccount.accountNumber} />
                                <Row label="Name" value={bankAccount.accountName} />
                                <Row label="Subaccount" value={<span className="font-mono text-xs">{bankAccount.subaccountCode || "—"}</span>} />
                                <Row label="Active" value={bankAccount.active ? "Yes" : "No"} />
                            </dl>
                        ) : <TableMessage>No bank details yet.</TableMessage>}
                    </Panel>
                    <Panel title="Account">
                        <dl className="divide-y">
                            <Row label="Email verified" value={user.emailVerified ? "Yes" : "No"} />
                            <Row label="Referrals" value={user.referralsCount ?? 0} />
                            <Row label="Referred by" value={user.referredBy ? <Link to={`/users/${user.referredBy._id}`} className="text-primary hover:underline">{user.referredBy.name}</Link> : "—"} />
                            {deleted && <Row label="Deleted" value={formatDateTime(user.deletedAt)} />}
                        </dl>
                    </Panel>
                </div>
            </div>

            <ConfirmDialog
                open={confirm}
                onOpenChange={setConfirm}
                title={suspended ? `Restore ${user.name}?` : `Suspend ${user.name}?`}
                description={suspended ? "They'll be able to log in again." : "They'll be signed out and won't be able to log in until you restore them. Their wishlists stay up."}
                confirmLabel={suspended ? "Restore user" : "Suspend user"}
                destructive={!suspended}
                onConfirm={toggleStatus}
            />
        </div>
    );
}
