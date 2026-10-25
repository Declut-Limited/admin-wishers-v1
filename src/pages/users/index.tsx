import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiCheckCircleFill } from "react-icons/pi";
import { PageHeader } from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, Panel, SearchInput, StatusBadge, TableMessage, TableSkeleton } from "@/components/ui-admin";
import { UserAvatar } from "@/components/UserAvatar";
import { useApi, withQuery } from "@/hooks/useApi";
import { useDebounced } from "@/hooks/useDebounced";
import type { Page, User } from "@/lib/types";
import { formatDate } from "@/utils/helper";

const LIMIT = 20;

export default function Users() {
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const search = useDebounced(q);

    const { data, isPending, error } = useApi<Page<User>>(
        withQuery("/admin/users", { q: search.trim(), status: status === "all" ? undefined : status, page, limit: LIMIT }),
    );

    return (
        <>
            <PageHeader title="Users" description="Everyone who has signed up." />
            <Panel
                actions={
                    <div className="flex w-full items-center justify-between gap-4">
                        <Tabs value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="suspended">Suspended</TabsTrigger>
                                <TabsTrigger value="deactivated">Deleted</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search name or email" />
                    </div>
                }
            >
                {isPending ? <TableSkeleton /> : error ? <TableMessage>{error.message}</TableMessage> : !data?.results.length ? <TableMessage>No users found.</TableMessage> : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-5">User</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email verified</TableHead>
                                    <TableHead className="text-right">Referrals</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-5 text-right">Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.results.map((u) => (
                                    <TableRow key={u._id} onClick={() => navigate(`/users/${u._id}`)} className="cursor-pointer">
                                        <TableCell className="pl-5">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar name={u.name} image={u.image} className="size-9" />
                                                <div className="min-w-0">
                                                    <p className="max-w-64 truncate font-semibold">{u.name}</p>
                                                    <p className="max-w-64 truncate text-xs text-muted-foreground">{u.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{u.phone || "—"}</TableCell>
                                        <TableCell>{u.emailVerified ? <PiCheckCircleFill className="size-5 text-primary" aria-label="Verified" /> : <span className="text-muted-foreground">No</span>}</TableCell>
                                        <TableCell className="text-right tabular-nums">{u.referralsCount ?? 0}</TableCell>
                                        <TableCell><StatusBadge status={u.accountStatus} /></TableCell>
                                        <TableCell className="pr-5 text-right text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
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
