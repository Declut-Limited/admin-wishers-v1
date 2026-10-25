export function formatCurrency(amount: number, dec = 0) {
    return "₦" + Number(amount || 0).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatNumber = (n: number) => Number(n || 0).toLocaleString("en-NG");

export function formatDate(dateString?: string) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(dateString?: string) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

export function percent(current: number, target: number) {
    if (!target) return 0;
    return Math.min(100, Math.round((current / target) * 100));
}

export const errorMessage = (err: unknown, fallback: string) => (err instanceof Error && err.message) || fallback;
