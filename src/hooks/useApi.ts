import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// GET an admin path. A tab, filter or page that hasn't been loaded yet shows its loading state;
// one already in the cache shows straight away (and refreshes quietly).
export function useApi<T>(path: string | null) {
    return useQuery({
        queryKey: [path],
        queryFn: () => api<T>(path!),
        enabled: !!path,
    });
}

// Builds "/admin/users?q=..&page=2", leaving out empty values.
export function withQuery(path: string, params: Record<string, string | number | undefined>) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && v !== "" && qs.set(k, String(v)));
    const s = qs.toString();
    return s ? `${path}?${s}` : path;
}
