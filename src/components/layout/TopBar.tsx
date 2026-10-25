import { useNavigate } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";

export function TopBar() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-6 backdrop-blur">
            <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                {admin && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button type="button" aria-label="Account menu" className="flex items-center gap-2 rounded-full p-0.5 pr-3 outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50">
                                <UserAvatar name={admin.name} className="size-8" />
                                <span className="max-w-40 truncate text-sm font-semibold">{admin.name}</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="flex flex-col">
                                <span className="truncate font-semibold">{admin.name}</span>
                                <span className="truncate text-xs font-normal text-muted-foreground">{admin.email}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                                <PiSignOutBold /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
