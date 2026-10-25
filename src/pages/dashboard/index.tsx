import { Link, useNavigate } from "react-router-dom";
import { PiArrowRightBold, PiBankBold, PiCalendarBold, PiChartLineUpBold, PiHandHeartBold, PiListHeartBold, PiReceiptBold, PiUsersBold, PiUsersThreeBold } from "react-icons/pi";
import { PageHeader } from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Panel, StatCard, StatusBadge, TableMessage, TableSkeleton } from "@/components/ui-admin";
import { UserAvatar } from "@/components/UserAvatar";
import { useApi } from "@/hooks/useApi";
import type { Stats } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber } from "@/utils/helper";

const ViewAll = ({ to }: { to: string }) => (
    <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View all <PiArrowRightBold aria-hidden /></Link>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const { data, isPending, error } = useApi<Stats>("/admin/stats");
    const c = data?.contributions;
    const m = data?.thisMonth;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Dashboard" description="How Wishers is doing." />

            {/* Money: revenue first, then where contributions went. */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard highlight label="Revenue" value={formatCurrency(c?.revenue ?? 0)} hint="Wishers' share of all contributions" icon={PiChartLineUpBold} loading={isPending} />
                <StatCard label="Revenue this month" value={formatCurrency(m?.revenue ?? 0)} hint={`From ${formatNumber(m?.count ?? 0)} contributions`} icon={PiCalendarBold} loading={isPending} />
                <StatCard label="Contribution volume" value={formatCurrency(c?.volume ?? 0)} hint={`${formatNumber(c?.count ?? 0)} contributions · ${formatCurrency(m?.volume ?? 0)} this month`} icon={PiHandHeartBold} loading={isPending} />
                <StatCard label="Paid to wishers" value={formatCurrency(c?.paidToWishers ?? 0)} hint="Their share of contributions" icon={PiBankBold} loading={isPending} />
            </div>
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Paid to referrers" value={formatCurrency(c?.paidToReferrers ?? 0)} hint="Referral earnings" icon={PiUsersThreeBold} loading={isPending} />
                <StatCard label="Processing fees" value={formatCurrency(c?.processingFees ?? 0)} hint="Paystack fees, paid by contributors" icon={PiReceiptBold} loading={isPending} />
                <StatCard label="Users" value={formatNumber(data?.users.total ?? 0)} hint={`${data?.users.newThisWeek ?? 0} new this week · ${data?.users.suspended ?? 0} suspended`} icon={PiUsersBold} loading={isPending} />
                <StatCard label="Wishlists" value={formatNumber(data?.wishlists.total ?? 0)} hint={`${data?.wishlists.completed ?? 0} completed · ${formatNumber(data?.wishlists.wishItems ?? 0)} wishes`} icon={PiListHeartBold} loading={isPending} />
            </div>

            {error && <p className="text-sm text-destructive">{error.message}</p>}

            <div className="grid grid-cols-2 gap-6">
                <Panel title="Newest users" actions={<ViewAll to="/users" />}>
                    {isPending ? <TableSkeleton rows={5} /> : !data?.recentUsers.length ? <TableMessage>No users yet.</TableMessage> : (
                        <Table>
                            <TableBody>
                                {data.recentUsers.map((u) => (
                                    <TableRow key={u._id} onClick={() => navigate(`/users/${u._id}`)} className="cursor-pointer">
                                        <TableCell className="pl-5">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar name={u.name} image={u.image} className="size-8" />
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold">{u.name}</p>
                                                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><StatusBadge status={u.accountStatus} /></TableCell>
                                        <TableCell className="pr-5 text-right text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Panel>

                <Panel title="Latest transactions" actions={<ViewAll to="/transactions" />}>
                    {isPending ? <TableSkeleton rows={5} /> : !data?.recentTransactions.length ? <TableMessage>No transactions yet.</TableMessage> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-5">User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-5 text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.recentTransactions.map((t) => (
                                    <TableRow key={t._id}>
                                        <TableCell className="max-w-40 truncate pl-5 font-semibold">{t.owner?.name ?? "—"}</TableCell>
                                        <TableCell>{t.type === "referral_earning" ? "Referral" : "Contribution"}</TableCell>
                                        <TableCell><StatusBadge status={t.status} /></TableCell>
                                        <TableCell className="pr-5 text-right font-bold tabular-nums">{formatCurrency(t.giftAmount ?? t.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Panel>
            </div>
        </div>
    );
}
