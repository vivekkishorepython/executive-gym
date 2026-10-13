# Executive Gym

A mobile-first Next.js App Router application for IF → THEN workplace practice. TypeScript, Tailwind CSS, Supabase Postgres/Auth, and Resend; ready for deployment to Vercel. Visitors need no account. No AI APIs or payments.

## Run locally

Node.js 20.9 or newer (Node 22 LTS recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The development script uses polling to avoid file-watcher limits on restricted hosts. Without Supabase credentials, practice uses all 110 seed cards. Email signup returns an honest unavailable message; admin login requires real Supabase configuration. Once Supabase is configured, public content comes exclusively from the database: an empty database displays zero cards, and errors display a retry screen.

## Supabase setup

1. Create a Supabase project. Execute `supabase/001_initial.sql` in its SQL editor.
2. In Supabase Auth, disable public signups, create the single administrator, and set a strong password. Copy their UUID. Password sign-in is the only admin login flow provided; reset the password through Supabase when needed.
3. Add that UUID to the allowlist using SQL:

```sql
insert into public.administrators(user_id) values ('YOUR_AUTH_USER_UUID');
```

4. Set `ADMIN_USER_ID` to exactly the same UUID. Server checks use verified `auth.getUser()` plus this ID; database RLS independently checks the protected administrators table. Both must match. Do not add other administrators.
5. Set the URL, public anon key, and server service-role key in `.env.local`. Only the two `NEXT_PUBLIC_` values may reach the browser. Never prefix any other secret with `NEXT_PUBLIC_`.
6. Seed using `supabase/002_seed.sql` in the SQL editor, or `node --env-file=.env.local --import tsx scripts/seed.ts`. The seed upserts deterministic IDs: rerunning overwrites those seed cards, so do not rerun after editing them unless intentional.

RLS permits public reads of published cards only. Drafts and writes require the allowlisted administrator. Subscribers have no public access, and administrators can read only the dashboard fields. Subscription functions are restricted to `service_role`; that key is used only in server modules. All API mutations validate input, and browser mutations require the configured origin. Auth cookies are HTTP-only and managed by Supabase SSR.

## Double opt-in email

Create a Resend account, verify a sending domain, and configure `RESEND_API_KEY` and `EMAIL_FROM`. Set `APP_URL` to the canonical origin, without a path, and `RATE_LIMIT_SALT` to a random secret (e.g. `openssl rand -hex 32`). Set the same values on Vercel.

A signup requires a valid email, an unchecked-by-default consent box, and an empty honeypot. Email is normalized to lowercase. Postgres stores status, consent time, confirmation time, and unsubscribe time. A pending request produces a 24-hour confirmation link and an unsubscribe link. Raw tokens appear only in the email; SHA-256 hashes are stored. Visiting a link shows a button; only pressing it changes status, avoiding accidental confirmation by email link scanners. Confirmation consumes the token. Unsubscribe is idempotent.

Duplicate requests return a generic message. Already-confirmed addresses receive no extra confirmation email. Resubscribing after unsubscribe requires new consent and confirmation. Database-backed limits allow five requests per IP and three per email per hour, plus a one-minute resend cooldown. Keys are salted hashes. Vercel’s trusted `x-vercel-forwarded-for` header supplies the address; local development shares one `local` key. For another host, configure a trusted proxy IP source; never trust arbitrary client-supplied forwarded headers. Rate limit failures fail closed. Expired buckets are cleaned during later requests.

If sending fails, the subscriber remains pending, never confirmed; retry after a minute. There is no background retry worker. This MVP sends confirmation emails, not newsletters. For future campaigns, send only to `status='confirmed'` and use a fresh secure unsubscribe token per recipient or a dedicated campaign integration; never include pending or unsubscribed addresses. The original confirmation email includes its working unsubscribe URL. Keep tokens out of analytics and logs; the app uses `Referrer-Policy: no-referrer`. Provide any organization-specific privacy notice before public launch.

## Administration

Visit `/admin`, sign in, then create, edit, delete, publish, or save drafts. Search by situation/response, filter category or publication state, and set difficulty/order. Subscriber addresses, optional names, status, and timestamps appear below the editor.

CSV headers: `id,category,front,back,explanation,difficulty,display_order,published`. Omit/leave `id` blank for new cards, use exported UUIDs for updates. `published` must be literal `true` or `false`; categories must match the 11 names; difficulty is `beginner`, `intermediate`, or `advanced`. Imports are all-or-nothing (single database upsert), up to 500 rows and 1 MB. Exports protect against spreadsheet formula injection by prefixing dangerous leading characters with an apostrophe. Review those protective prefixes before re-importing as exact content. Subscriber exports omit tokens. Database reads paginate in batches of 500 so counts and exports include all records.

## Practice

A card starts a 30-second timer; expiry never reveals it. Previous/Next wrap around, Shuffle randomizes, and Practice Again resets the session. Space/Enter reveal, arrows navigate; form and control inputs keep their normal keyboard behavior. Reduced motion disables animation. Mastered/Need Practice flags persist under `executive-gym-progress-v1` in this browser only. Weak mode takes a snapshot of weak cards at session start so marking a card mastered doesn't unexpectedly remove the active card. Reopen weak mode to refresh the list. Clearing browser data clears progress. Finish Session shows the subscription form.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Tests cover navigation, keyboard reveal, timer expiry/reset, local progress, weak mode, 110-card distribution, server admin authorization, origin protection, consent, validation, rate limits, duplicates, email errors, and token handling. External Supabase/Resend integration requires your credentials: verify RLS as anon/non-admin/admin, confirm an email, repeat confirmation, unsubscribe, resubscribe, and trigger rate limits in your staging project before launch.

## Deploy on Vercel

Import this directory as a Next.js project; build `npm run build`. Set environment variables from `.env.example` in Vercel. Set `APP_URL` to your final HTTPS domain and Supabase's Site URL to that origin. Preview deployments need their own APP_URL and preferably a separate Supabase staging project. Run the migrations and seed first. No deployment was performed or live credentials provisioned by this source package.

Required external services: Supabase project (Postgres and Auth), Resend account + verified domain, and a Vercel project. No visitor accounts are required. Supabase service-role and email credentials must be protected server-side. Avoid collecting subscriber request bodies or token query strings in monitoring. Standard Vercel and provider limits apply.
