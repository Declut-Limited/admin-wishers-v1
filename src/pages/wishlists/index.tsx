import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiImageBold } from "react-icons/pi";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, Panel, SearchInput, StatusBadge, TableMessage, TableSkeleton } from "@/components/ui-admin";
import { useApi, withQuery } from "@/hooks/useApi";
import { useDebounced } from "@/hooks/useDebounced";
import type { Owner, Page, Wishlist } from "@/lib/types";
import { formatCurrency, formatDate, percent } from "@/utils/helper";

const LIMIT = 20;

export default function Wishlists() {
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const search = useDebounced(q);

    const { data, isPending, error } = useApi<Page<Wishlist>>(
        withQuery("/admin/wishlists", { q: search.trim(), status: status === "all" ? undefined : status, page, limit: LIMIT }),
    );

    return (
        <>
            <PageHeader title="Wishlists" description="Every wishlist on Wishers." />
            <Panel
                actions={
                    <div className="flex w-full items-center justify-between gap-4">
                        <Tabs value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Open</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search title" />
                    </div>
                }
            >
                {isPending ? <TableSkeleton /> : error ? <TableMessage>{error.message}</TableMessage> : !data?.results.length ? <TableMessage>No wishlists found.</TableMessage> : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-5">Wishlist</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead className="w-[24%]">Progress</TableHead>
                                    <TableHead className="text-right">Wishes</TableHead>
                                    <TableHead className="text-right">Givers</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-5 text-right">Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.results.map((w) => {
                                    const owner = w.owner as Owner | null;
                                    const p = percent(w.totalAmountReceived, w.totalGoalAmount);
                                    return (
                                        <TableRow key={w._id} onClick={() => navigate(`/wishlists/${w._id}`)} className="cursor-pointer">
                                            <TableCell className="pl-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                                                        {w.image ? <img src={w.image} alt="" loading="lazy" className="size-full object-cover" /> : <PiImageBold aria-hidden />}
                                                    </span>
                                                    <span className="max-w-56 truncate font-semibold">{w.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-44">
                                                <p className="truncate">{owner?.name ?? "—"}</p>
                                                <p className="truncate text-xs text-muted-foreground">{owner?.email}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={p} className="h-1.5 flex-1" aria-label={`${p}% raised`} />
                                                    <span className="w-9 text-right text-xs font-semibold">{p}%</span>
                                                </div>
                                                <p className="mt-1 text-xs text-muted-foreground"><span className="font-bold text-foreground">{formatCurrency(w.totalAmountReceived)}</span> of {formatCurrency(w.totalGoalAmount)}</p>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">{w.totalWishItems}</TableCell>
                                            <TableCell className="text-right tabular-nums">{w.totalContributors}</TableCell>
                                            <TableCell><StatusBadge status={w.isCompleted ? "completed" : "open"} /></TableCell>
                                            <TableCell className="pr-5 text-right text-muted-foreground">{formatDate(w.createdAt)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />
                    </>
                )}
            </Panel>
        </>
    );
}
