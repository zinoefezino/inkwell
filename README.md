# Inkwell

Tailors proposals and CVs to a specific job posting — for freelancers and job seekers.

## What it does

Applying to jobs usually means rewriting the same proposal or CV over and over. Inkwell takes a job posting and:

- **Drafts a tailored proposal** in your voice, leading with relevant experience
- **Tailors your CV** — re-orders and re-weights your real experience around what the posting cares about, without inventing anything

Everything generated is saved to your account and downloadable as Word or PDF.

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 · HugeIcons · Clerk (auth) · MongoDB/Mongoose · Google Gemini (AI) · `mammoth`/`unpdf` (file parsing) · `docx`/`jsPDF` (export)

## How Clerk, MongoDB, and the archive fit together

Clerk and MongoDB own different things and talk to each other through one webhook:

1. **Clerk owns identity.** It handles sign-in, sessions, and the user's account — no user data lives in MongoDB by default.
2. **A webhook syncs users into MongoDB.** When someone signs up, Clerk fires a `user.created` event to `/api/webhooks/clerk`, which creates a matching `User` document in MongoDB (keyed by Clerk's `userId`). `user.deleted` removes it. This is the only link between the two systems.
3. **Proposals and CVs are saved separately, tagged by `userId`.** When you generate a proposal or CV, the API route calls Gemini, then saves the result to a `Generation` document — `{ userId, type: "proposal" | "cv", posting, output, createdAt }` — stamped with your Clerk `userId` directly. It doesn't join through the `User` document; it's a flat, independent collection.
4. **The dashboard/archive just queries `Generation.find({ userId })`**, sorted newest first, filtered client-side by type. That's the entire mechanism behind "your saved work."

So: Clerk is the source of truth for _who you are_, MongoDB is the source of truth for _what you've generated_, and the webhook is the one seam connecting the two — if it's ever misconfigured (wrong endpoint, wrong signing secret, wrong Clerk instance), users can still sign in and generate content fine, they just won't get a `User` record synced.

## Environment variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
MONGODB_URI=
GEMINI_API_KEY=
```

Clerk has separate dev/production instances with separate keys and separate webhook secrets — switch to production before sharing this publicly (dev mode caps at 100 users).

## Getting started

```bash
pnpm install
pnpm dev
```

Needs: a Clerk app, a MongoDB Atlas cluster, a free Gemini key ([aistudio.google.com](https://aistudio.google.com)), and a Clerk webhook pointed at `/api/webhooks/clerk` (subscribed to `user.created`, `user.deleted`).

## Problems hit along the way

- **HugeIcons naming** — `Feather01Icon` doesn't exist, it's `FeatherIcon`; free tier is Stroke Rounded style only.
- **Clerk Core 3 upgrade** — removed `SignedIn`/`SignedOut` in favor of `<Show when="signed-in">`; `afterSignOutUrl` moved from `UserButton` to `ClerkProvider`.
- **`pdf-parse` breaks on serverless** — depends on `pdfjs-dist`, which needs browser APIs (`DOMMatrix`, etc.) that don't exist on Vercel functions. Switched to `unpdf`, which has no canvas/DOM dependency.
- **Gemini model deprecation** — `gemini-2.5-flash` got locked out for newer API keys. Switched to the `gemini-flash-latest` alias so this doesn't silently break again.
- **MongoDB `ESERVFAIL`** — `mongodb+srv://` needs DNS `SRV` record support, which some networks don't handle. Fix: switch DNS servers, or use Atlas's non-SRV "Standard connection string."
- **Silent empty CV extraction** — a scanned/image PDF or corrupted file extracted to an empty string with no error shown, making the "Seal & tailor" button look broken. Added explicit empty-text detection + a loading spinner during extraction.
- **Duplicate name in exports** — generated CVs already start with the person's name, and the export was also adding it as a title above the content. Now strips a duplicate leading line.
- **Mongoose validation crash on empty AI output** — an empty Gemini response tried to save to a required field and threw. Now skips the save instead of crashing.

## Design notes

Ink-blue (`#3B4E90`) + gold (`#C9A227`) accents, white background, Bricolage Grotesque display type, full dark mode (toggle in header, persisted via `localStorage`).

---
