import { Link, useParams } from "react-router-dom";
import { PiArrowLeftBold, PiArrowSquareOutBold, PiImageBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Panel, StatCard, StatusBadge, TableMessage } from "@/components/ui-admin";
import { UserAvatar } from "@/components/UserAvatar";
import { useApi } from "@/hooks/useApi";
import type { Owner, WishItem, Wishlist } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber, percent } from "@/utils/helper";
import { PiEyeBold, PiGiftBold, PiHandHeartBold, PiTrendUpBold } from "react-icons/pi";

export default function WishlistItem() {
    const { id } = useParams();
    const { data: w, isPending, error } = useApi<Wishlist & { wishItems: WishItem[] }>(`/admin/wishlists/${id}`);

    if (isPending) return <div className="space-y-6"><Skeleton className="h-32 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>;
    if (error || !w) return <p className="py-16 text-center text-muted-foreground">{error?.message || "Wishlist not found"}</p>;

    const owner = w.owner as Owner | null;
    const p = percent(w.totalAmountReceived, w.totalGoalAmount);

    return (
        <div className="flex flex-col gap-6">
            <Link to="/wishlists" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><PiArrowLeftBold aria-hidden /> Wishlists</Link>

            <section className="flex items-center gap-5 rounded-2xl border bg-card p-6">
                <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {w.image ? <img src={w.image} alt="" className="size-full object-cover" /> : <span className="flex size-full items-center justify-center text-muted-foreground"><PiImageBold className="size-7" aria-hidden /></span>}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="truncate text-2xl font-extrabold tracking-tight">{w.title}</h1>
                        <StatusBadge status={w.isCompleted ? "completed" : "open"} />
                    </div>
                    {w.description && <p className="mt-1 line-clamp-2 text-muted-foreground">{w.description}</p>}
                    {owner && (
                        <Link to={`/users/${owner._id}`} className="mt-2 inline-flex items-center gap-2 text-sm hover:underline">
                            <UserAvatar name={owner.name} image={owner.image} className="size-6" />
                            <span className="font-semibold">{owner.name}</span>
                            <span className="text-muted-foreground">· created {formatDate(w.createdAt)}</span>
                        </Link>
                    )}
                </div>
                <Button variant="outline" asChild className="font-bold">
                    <a href={w.link} target="_blank" rel="noreferrer"><PiArrowSquareOutBold /> Public page</a>
                </Button>
            </section>

            <div className="grid grid-cols-4 gap-4">
                <StatCard highlight label="Raised" value={formatCurrency(w.totalAmountReceived)} hint={`${p}% of ${formatCurrency(w.totalGoalAmount)}`} icon={PiTrendUpBold} />
                <StatCard label="Wishes" value={formatNumber(w.totalWishItems)} icon={PiGiftBold} />
                <StatCard label="Givers" value={formatNumber(w.totalContributors)} icon={PiHandHeartBold} />
                <StatCard label="Visitors" value={formatNumber(w.visitCount)} icon={PiEyeBold} />
            </div>

            <Panel title={`Wishes (${w.wishItems.length})`}>
                {!w.wishItems.length ? <TableMessage>No wishes yet.</TableMessage> : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="pl-5">Wish</TableHead>
                                <TableHead className="w-[30%]">Progress</TableHead>
                                <TableHead className="text-right">Goal</TableHead>
                                <TableHead className="text-right">Givers</TableHead>
                                <TableHead className="pr-5">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {w.wishItems.map((item) => {
                                const ip = percent(item.amountReceived, item.goalAmount);
                                return (
                                    <TableRow key={item._id}>
                                        <TableCell className="pl-5">
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                                                    {item.images?.[0] ? <img src={item.images[0]} alt="" loading="lazy" className="size-full object-cover" /> : <PiImageBold aria-hidden />}
                                                </span>
                                                <span className="max-w-64 truncate font-semibold">{item.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={ip} className="h-1.5 flex-1" aria-label={`${ip}% raised`} />
                                                <span className="w-9 text-right text-xs font-semibold">{ip}%</span>
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground"><span className="font-bold text-foreground">{formatCurrency(item.amountReceived)}</span> raised</p>
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">{formatCurrency(item.goalAmount)}</TableCell>
                                        <TableCell className="text-right tabular-nums">{item.contributorCount}</TableCell>
                                        <TableCell className="pr-5"><StatusBadge status={item.isCompleted ? "completed" : "open"} /></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Panel>
        </div>
    );
}
