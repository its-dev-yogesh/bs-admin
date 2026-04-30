# BS-Admin

Admin panel for the **Broker-Social** platform. Built on Next.js 16 + React 19 + Tailwind CSS 4.

Talks to [`bs-backend`](../bs-backend/) over HTTP and gates access to admin/super_admin role holders.

## Features

- Phone + OTP login via `bs-backend/auth`
- Admin role gate on `/(admin)` routes
- Dashboard with live KPIs (users, listings, leads, KYC, reports)
- **Users** — list, filter by role/status, change role, ban/unban
- **Leads** — full pipeline view with status counts
- **KYC Verification** — pending queue, approve/reject with note
- **Moderation** — open reports, action with internal note

## Prerequisites

- Node.js 18+
- A running `bs-backend` (default `http://localhost:3004/api`)
- A user in Mongo with `role: "admin"` (or `super_admin`)

## Run

```bash
npm install
npm run dev
```

Configure the API base URL via env (defaults to `http://localhost:3004/api`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3004/api
```

## Promoting a user to admin

There is no UI for the first promotion — do it directly in Mongo:

```js
db.users.updateOne(
  { phone: "+91XXXXXXXXXX" },
  { $set: { role: "admin" } },
);
```

After promotion, sign in via the regular phone+OTP flow.

## Project layout

```
src/
  app/
    (admin)/              # Auth-gated admin routes
    (full-width-pages)/   # Sign-in / 404
  components/
    admin/                # Page-level admin components
    dashboard/            # Dashboard tiles + recent leads
    ui, form, common      # Generic primitives
  context/                # Auth + theme + sidebar providers
  layout/                 # AppHeader, AppSidebar, Backdrop
  lib/api.ts              # Token-aware fetch
  services/               # One module per backend domain
```

## Originally based on

The visual primitives (sidebar, header, badges, buttons, table, modal) come from the
[TailAdmin Next.js](https://tailadmin.com) free template. All demo pages and ecommerce
content have been removed.
