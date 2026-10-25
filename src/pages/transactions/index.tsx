import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, Panel, StatusBadge, TableMessage, TableSkeleton } from "@/components/ui-admin";
import { useApi, withQuery } from "@/hooks/useApi";
import type { Page, Transaction } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/utils/helper";

const LIMIT = 25;

export default function Transactions() {
    const [type, setType] = useState("all");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

    const { data, isPending, error } = useApi<Page<Transaction>>(
        withQuery("/admin/transactions", { type: type === "all" ? undefined : type, status: status === "all" ? undefined : status, page, limit: LIMIT }),
    );

    return (
        <>
            <PageHeader title="Transactions" description="Contributions and referral earnings across every user." />
            <Panel
                actions={
                    <div className="flex w-full items-center justify-between gap-4">
                        <Tabs value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="contribution">Contributions</TabsTrigger>
                                <TabsTrigger value="referral_earning">Referrals</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                            <SelectTrigger className="h-9 w-44" aria-label="Payment status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
            >
                {isPending ? <TableSkeleton /> : error ? <TableMessage>{error.message}</TableMessage> : !data?.results.length ? <TableMessage>No transactions found.</TableMessage> : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-5">User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Contribution</TableHead>
                                    <TableHead className="text-right">User's share</TableHead>
                                    <TableHead className="text-right">Charges</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Settlement</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead className="pr-5 text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.results.map((t) => (
                                    <TableRow key={t._id}>
                                        <TableCell className="max-w-44 pl-5">
                                            {t.owner ? <Link to={`/users/${t.owner._id}`} className="block truncate font-semibold hover:underline">{t.owner.name}</Link> : "—"}
                                            <p className="truncate text-xs text-muted-foreground">{t.owner?.email}</p>
                                        </TableCell>
                                        <TableCell>{t.type === "referral_earning" ? "Referral" : "Contribution"}</TableCell>
                                        <TableCell className="text-right tabular-nums">{t.giftAmount !== undefined ? formatCurrency(t.giftAmount, 2) : "—"}</TableCell>
                                        <TableCell className="text-right font-bold tabular-nums">{formatCurrency(t.amount, 2)}</TableCell>
                                        <TableCell className="text-right tabular-nums text-muted-foreground">{formatCurrency(t.charges ?? 0, 2)}</TableCell>
                                        <TableCell><StatusBadge status={t.status} /></TableCell>
                                        <TableCell>{t.status === "success" ? <StatusBadge status={t.settlementStatus} /> : <span className="text-muted-foreground">—</span>}</TableCell>
                                        <TableCell className="max-w-36 truncate font-mono text-xs text-muted-foreground">{t.reference ?? "—"}</TableCell>
                                        <TableCell className="pr-5 text-right whitespace-nowrap text-muted-foreground">{formatDateTime(t.paidAt ?? t.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />
                    </>
                )}
            </Panel>
        </>
    );
}
