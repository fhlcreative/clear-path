---
title: "clear-path — Site Status"
status: active
updated: 2026-08-03
---

# clear-path — Site Status

Running record of what's changed on this site, why, and what's still
open. Newest entry first. Every shipped entry should cite its commit so
the log and the repo can't drift apart.

> Excluded from deploy via `.vercelignore`.
> This file must never be served publicly.

## Facts

| | |
|---|---|
| **Local** | `/Users/philgoodwin/Townsite-websites/clear-path/` |
| **Repo** | `https://github.com/fhlcreative/clear-path.git` (private) |
| **Deploy** | push to `main` → Vercel auto-deploys production |
| **Live (Vercel production alias)** | https://www.shouldigetai.com |
| **⚠️ Domain note** | Domain does not match the folder name. |
| **Build step** | `node build.js` |
| **Markdown is a build input** | ⚠️ yes — insights/articles |
| **Pages** | 6 HTML files |
| **History** | 45 commits, 2026-03-24 → 2026-06-15 |
| **Latest** | `42b0d92 — Security hardening: add rel=noopener noreferrer to external links; force https on self-links` |
| **Local review** | `npm run build` first, then `python3 -m http.server 8080` → http://localhost:8080 |

> ⚠️ **Do not add `*.md` to this repo's `.vercelignore`.** Markdown here
> is consumed as a build input; a wildcard would starve the build and
> silently empty the generated sections. Use root-anchored paths.

## 2026-08-03 — SITE_STATUS.md seeded

**This file was created today** as part of a fleet-wide rollout, together
with a `.vercelignore` rule excluding it from the deploy. The Facts table
above is derived from git, the filesystem, and `vercel project ls`.

The history below was mined from Phil's working-memory files. It is a
**summary of summaries** — the per-site `MEMORY.md` indexes were read,
but not the ~90 individual topic files they link to. Treat it as a
pointer to the sources named, not as primary evidence. Credentials,
keys and passwords present in those sources were deliberately omitted.

---

## Prior history — from working memory, not from git

**Sources:** `clear-path-progress.md`, `-Townsite-websites-clear-path/memory/MEMORY.md`
**Last substantive update in sources:** not dated in the index; global file is 2026-03-24

### Recent work
- Jeff Rorabaugh's AI consulting site, one-page scrolling, *"anti-hype consulting brand under Happy Camper Consulting LLC."*
- First real end-to-end test of the Impeccable skill stack (2026-03-24): `/critique`, `/typeset`, `/arrange`, `/delight`, `/polish`, `/colorize`, plus `visual-qa`. Fraunces + Outfit typography, asymmetric 5/7 problem grid, count-up stats.
- P0–P3 QA fixes applied: DOCTYPE, `<main>` landmark, OG tags, 3MB→175KB image compression, skip-to-content.
- Insights blog added with **Sveltia CMS + GitHub OAuth + daily deploy**, mirroring HCC.
- Quiz CTA redesign shipped (inline hero link, amber button, gradient bg, trust line).

### Open / unresolved
- **Calendly link still generic** — *"Hero + CTA buttons still point to generic `https://calendly.com` — waiting on Jeff's real booking URL."* Not marked resolved in any later source.
- Custom domain, subpages (About/Services/Contact), proper 1200×630 OG image, Tailwind still on dev CDN.
- **CMS OAuth hardening is an open security item** — see Gotchas.

### Gotchas
- **Real domain is `shouldigetai.com`**, not `clear-path.vercel.app` (which the audit calls *"a different/unassigned alias"*).
- **⚠️ OPEN SECURITY ITEM — `api/callback.js` leaks the GitHub token to any origin.** Still **NOT patched** as of 2026-08-03. Read the code before touching it; analysis below.

  Two defects, both in the popup HTML this handler returns:
  1. `window.opener.postMessage("authorizing:github", "*")` — broadcasts to **any** origin that opened the popup.
  2. `receiveMessage` replies with the token to `e.origin` — **whatever origin sent the message**, with no check.

  Together: a page that opens this callback as a popup receives the broadcast, posts any message back, and is handed a **`repo`-scoped** token (`api/auth.js` requests `scope=repo`). That token grants read/write to every repo the authenticated user can reach — not just this one. `api/auth.js` also sends no `state` parameter, so the OAuth flow has no CSRF protection.

  **Fix** (confined to the popup page — no CMS data touched): allowlist `https://www.shouldigetai.com` explicitly, use it as the `targetOrigin` in both `postMessage` calls, and `return` early when `e.origin` doesn't match. Add `state` to `auth.js` and verify it in `callback.js`.

  **Why it's safe to deploy, despite the earlier "could lock clients out" note:** the change only affects the login popup. Worst case is "the login popup hangs" — no content is at risk and nothing is destructive. Phil can verify it himself at `/admin/` (he's a repo collaborator); Jeff never needs to be part of the test. Vercel instant-rollback restores the current behaviour in well under a minute. Test on production, not a preview — the GitHub OAuth App's callback URL is registered to the production domain, so preview deployments can't complete the flow anyway.
- **PUBLIC repo with no branch protection.** Deliberate — Phil confirmed 2026-08-03 he made it public so Jeff could post through the CMS. **But public is probably not required:** `jeffrorabaugh` is already a **collaborator** (`gh api repos/fhlcreative/clear-path/collaborators`, checked 2026-08-03), and Sveltia CMS authenticates as the logged-in GitHub user, so a private repo works as long as that user has write access. Raised with Phil 2026-08-03; not changed, no decision yet. Note this compounds the item above — a public repo widens who can study the callback flow.
- The quiz is click-based multi-step with no form submit — honeypot logic never applied here.
- *"Follow client content specs strictly, don't rearrange or embellish section content."*
- *"Use printf not echo when piping env vars to Vercel CLI."*
- *"EmailJS escapes '/' etc. in subject lines; use 'of 25' and plain hyphens."*

---


## Recent commits

```
2026-06-15  42b0d92  Security hardening: add rel=noopener noreferrer to external links; force https on self-links
2026-06-15  b457cc5  Sanitize rendered markdown with DOMPurify (pinned+SRI) to prevent stored XSS
2026-06-15  99de383  Add security response headers (anti-clickjacking, nosniff, HSTS, referrer/permissions policy)
2026-05-02  6a30036  Update Insights Articles “5-signs-your-business-isn’t-ready-for-ai-and-that’s-okay”
2026-04-29  f8539f7  Merge staging: Add Chamber member widget to footer (portal request eb9e0074)
2026-04-29  d0e9926  Rearrange footer: logo left, copyright/credit center, Chamber badge right (Jeff request)
2026-04-29  edfece9  Constrain text column width to force name onto 2 lines
2026-04-29  efabe4e  Increase Chamber widget font sizes and logo size
```

---

## History before 2026-08-03

Everything above is derived from git, the filesystem, and the live site.
Narrative history is only included where a written source exists and is
cited. Nothing about *why* earlier decisions were made has been inferred.
