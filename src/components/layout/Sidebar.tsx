import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";
import { PiGearBold, PiGearFill, PiListHeartBold, PiListHeartFill, PiReceiptBold, PiReceiptFill, PiSquaresFourBold, PiSquaresFourFill, PiUsersBold, PiUsersFill } from "react-icons/pi";
import { Brand } from "@/components/Brand";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: string; icon: IconType; activeIcon: IconType }[] = [
    { to: "/", label: "Dashboard", icon: PiSquaresFourBold, activeIcon: PiSquaresFourFill },
    { to: "/users", label: "Users", icon: PiUsersBold, activeIcon: PiUsersFill },
    { to: "/wishlists", label: "Wishlists", icon: PiListHeartBold, activeIcon: PiListHeartFill },
    { to: "/transactions", label: "Transactions", icon: PiReceiptBold, activeIcon: PiReceiptFill },
    { to: "/settings", label: "Settings", icon: PiGearBold, activeIcon: PiGearFill },
];

// Fixed sidebar, same style as the web app's.
export function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col gap-6 border-r bg-sidebar p-4">
            <div className="flex items-center gap-2 px-2 pt-1">
                <Brand />
                <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-accent-foreground uppercase">Admin</span>
            </div>
            <nav aria-label="Primary" className="flex flex-col gap-1">
                {NAV.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                            )
                        }
                    >
                        {({ isActive }) => {
                            const Icon = isActive ? item.activeIcon : item.icon;
                            return (
                                <>
                                    <Icon className={cn("size-[18px]", isActive && "text-primary")} aria-hidden />
                                    {item.label}
                                </>
                            );
                        }}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
