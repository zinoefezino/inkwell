# Inkwell

A tool that tailors proposals and CVs to a specific job posting — for freelancers and job seekers.

## What this is

Applying to jobs and freelance gigs usually means writing the same proposal or CV over and over, lightly reworded each time. It's slow, and by the tenth application of the day it starts sounding like it. Inkwell takes a job posting and:

- **Drafts a tailored proposal** — written in your voice, leading with relevant experience, never dwelling on what you don't have
- **Tailors your CV** — re-orders and re-weights your existing experience around what the posting actually cares about, without inventing anything you haven't done

Everything you generate is saved to your account and downloadable as a formatted Word (`.docx`) or PDF document, not just plain text.

## Features

- Sign-in required (Clerk) — no guest/anonymous access
- Paste-a-posting → generate a proposal, tailored to your name, skills, tone, and a past project you supply
- CV tailoring via paste, or file upload (`.txt`, `.docx`, `.pdf` — text extracted automatically)
- Archive/dashboard of everything you've generated, filterable by type
- Word and PDF export with real document formatting (headings, title, spacing) — not a plain text dump
- Full dark mode
- AI generation via Google Gemini (free tier)

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** HugeIcons
- **Auth:** Clerk
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini API
- **File parsing:** `mammoth` (.docx), `unpdf` (.pdf)
- **Document export:** `docx`, `jsPDF`

## Environment variables

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# MongoDB
MONGODB_URI=

# Gemini
GEMINI_API_KEY=
```

**Important:** Clerk has separate development and production instances with separate keys (`pk_test_`/`sk_test_` vs `pk_live_`/`sk_live_`) and separate webhook signing secrets. Development mode caps you at 100 users and isn't meant for a live deployment — switch to a production instance before sharing this publicly.

## Getting started

```bash
pnpm install
pnpm dev
```

Set up the services below before it'll actually work end to end:

1. **Clerk** — create an application at [clerk.com](https://clerk.com), grab your keys
2. **MongoDB Atlas** — create a free M0 cluster, grab your connection string
3. **Gemini** — get a free API key at [aistudio.google.com](https://aistudio.google.com), no card required
4. **Clerk webhook** — point a webhook endpoint at `/api/webhooks/clerk`, subscribed to `user.created` and `user.deleted`, so signups sync into MongoDB

## Problems I ran into, and how they got fixed

Documenting these because they weren't obvious at the time, and future-me (or anyone else touching this) will hit the same walls.

### Icon library switch mid-build

Started with `lucide-react`, switched to HugeIcons partway through. HugeIcons' usage pattern is different — one `HugeiconsIcon` component with the icon passed as a prop, not a separate component per icon. Also hit a wrong icon name (`Feather01Icon` doesn't exist — it's just `FeatherIcon`) since HugeIcons' free tier only includes the "Stroke Rounded" style, not every icon variant.

### Clerk's Core 3 upgrade removed `SignedIn`/`SignedOut`

Installed `@clerk/nextjs@7.x` (Core 3) partway through, which removed the `SignedIn`/`SignedOut`/`Protect` components in favor of a single unified `<Show when="signed-in">` / `<Show when="signed-out">` component. `afterSignOutUrl` also moved from being a prop on `UserButton` to a prop on `ClerkProvider`. `createRouteMatcher` in middleware still works but is flagged as deprecated in favor of resource-based auth checks per-route.

### `pdf-parse` doesn't work in serverless environments

`pdf-parse` v2 depends on `pdfjs-dist` internally, which expects browser APIs (`DOMMatrix`, `ImageData`, `Path2D`) that don't exist in a Node serverless function. It tries to polyfill them via `@napi-rs/canvas`, which isn't installed by default, so every PDF upload failed on Vercel with `DOMMatrix is not defined` — even though it looked fine in some local setups. **Fix:** switched to `unpdf`, a library built specifically for serverless/edge PDF text extraction with no canvas or DOM dependency.

### Gemini model deprecation

Hardcoded `gemini-2.5-flash` as the model name, which Google quietly locked out for newer API keys/projects (`404: This model ... is no longer available to new users`) even though it's still nominally "supported." **Fix:** switched to the `gemini-flash-latest` alias instead of a pinned version, so this doesn't silently break again the next time Google reshuffles model availability.

### MongoDB `ESERVFAIL` on SRV lookup

`mongodb+srv://` connection strings depend on DNS `SRV` record resolution, which some networks/ISPs/routers don't reliably support (they handle normal `A` records fine, but not `SRV`). This caused proposals/CVs to generate successfully but silently fail to save to the archive. **Fix:** either switch DNS servers (`8.8.8.8` / `1.1.1.1`), or use Atlas's "Standard connection string" (`mongodb://` with explicit hostnames) instead of the DNS-seed-list version, which avoids SRV lookups entirely.

### DNS failures reaching Gemini's API

Got `getaddrinfo EAI_AGAIN generativelanguage.googleapis.com` locally — a DNS resolution failure, not a broken URL (confirmed the endpoint itself was correct). Same root cause class as the MongoDB issue above: local network/DNS resolver problems, not application code.

### Empty CV text extraction failing silently

If a `.docx` or `.pdf` had no extractable text (scanned/image-based PDF, corrupted file, etc.), extraction would "succeed" with an empty string and no error — leaving the CV field blank with zero feedback. The "Seal & tailor" button would then silently do nothing (correctly blocked by validation), which looked like a broken button rather than a content issue. **Fix:** explicit empty-text detection after extraction, with a clear error message, plus a loading spinner during extraction so it's obvious something is happening rather than looking frozen.

### Duplicate name in exported documents

Generated CVs naturally start with the person's name as their first line — and the export function was also adding the name as a document title above the content, so it appeared twice in every downloaded file. **Fix:** strip a leading line from the generated text if it matches the title being rendered above it.

### MongoDB validation error on empty AI output

When Gemini returned no usable content (e.g. during the model deprecation issue above), the app tried to save an empty string to a required `output` field, throwing a Mongoose validation error instead of failing gracefully. **Fix:** skip the save entirely when there's nothing to save — an empty result isn't worth persisting anyway.

## Design notes

- Visual identity: ink-blue (`#2B3A67`) and gold (`#C9A227`) accents, white background, Bricolage Grotesque for display type
- Full dark mode, toggle in the header, persisted via `localStorage`
- Dashboard/archive uses a list + detail pattern (not a table), with type-colored left bars (blue for proposals, gold for CVs) for quick scanning
- Both the list and detail panel cap their height and scroll internally, so the archive stays usable regardless of how much is saved

---
