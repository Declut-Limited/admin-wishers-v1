# admin-wishers

The Wishers admin dashboard (desktop only). Same stack and look as webapp-wishers: React 19 + Vite, TypeScript, Tailwind 4, shadcn/ui, TanStack Query, React Router, React Icons.

```
cp .env.example .env   # VITE_API_URL
npm install
npm run dev            # http://localhost:3027
```

Pages: Dashboard, Users (search, filter, suspend/restore), Wishlists, Transactions, Settings (app limits and gift split).

API: the `/admin/*` routes in api-wishers. Admin accounts are separate from users (their own collection). The API needs `JWT_ADMIN_ACCESS_SECRET` and `JWT_ADMIN_REFRESH_SECRET` set (32+ characters each) before admin login works.
