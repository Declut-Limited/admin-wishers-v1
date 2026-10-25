import { lazy } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./auth/login";

// ADMIN PAGES (loaded on first visit)
const Dashboard = lazy(() => import("./pages/dashboard"));
const Users = lazy(() => import("./pages/users"));
const UserItem = lazy(() => import("./pages/users/subPages/UserItem"));
const Wishlists = lazy(() => import("./pages/wishlists"));
const WishlistItem = lazy(() => import("./pages/wishlists/subPages/WishlistItem"));
const Transactions = lazy(() => import("./pages/transactions"));
const Settings = lazy(() => import("./pages/settings"));

function NotFound() {
    return (
        <div className="flex min-h-[50svh] flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Page not found</h1>
            <Link to="/" className="font-semibold text-primary hover:underline">Go to the dashboard</Link>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* PROTECTED ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:id" element={<UserItem />} />
                    <Route path="/wishlists" element={<Wishlists />} />
                    <Route path="/wishlists/:id" element={<WishlistItem />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
