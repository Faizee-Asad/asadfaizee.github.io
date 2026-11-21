# Repository Structure

Personal portfolio of **Asad Faizee** — live at https://asadfaizee.is-a.dev/

This file maps every section of the repo, so nothing here is a mystery folder.

## Core portfolio (do not move — public URLs)

| Path | What it is |
|---|---|
| `index.html` | Portfolio homepage |
| `services.html` | Freelance website & SEO service plans (linked from the homepage as `/services`) |
| `css/` `js/` `img/` `fonts/` | Homepage styles, scripts, images and web fonts |
| `CNAME` `sitemap.xml` `robots.txt` | Custom domain (`asadfaizee.is-a.dev`) and SEO files |

## `tools/` — free online tools

One tool per file or folder, e.g. `google-dorks.html`, `llmtokencounter.html`,
`code-to-image/`, `image-compressor/`. **URLs here are shared and indexed — do not rename.**
New tools: use a lowercase hyphenated name.

## `projects/` — project demo pages

Demo sites built for clients and concepts, e.g. `Bella-Cucina/`, `NativeBombay.html`.
**URLs may be shared with clients — do not rename.**

## `demos/` — standalone demo / landing pages

Moved here in the Phase 2 cleanup (Nov 2026). The old root URLs redirect here,
so old links keep working.

| Page | What it is |
|---|---|
| `demos/Aurora.html` | Aurora — design studio demo (old: `/Aurora.html`) |
| `demos/noor.html` | Noor Infotech landing page (old: `/noor.html`) |
| `demos/niss-service.html` | Noor Infotech services page (old: `/niss-service.html`) |
| `demos/qr-cloud.html` | Restaurant QR Cloud product demo (old: `/qr-cloud.html`) |

Also moved: `tools/ai-carousel-maker.html` (old: `/ai-carousel-maker.html`) and
`experiments/bd.html` — a birthday page (old: `/bd.html`).

## Demo site folders (kept in place — full mini-sites)

These are complete multi-file demo sites whose folder URLs may be shared.
They were **not** moved in Phase 2:

- `KRO-FLITE/` `LITHOS/` `NINJUTSU-CREATIVE/` `STUDIO/` `daauc/` — single-page design demos (some include their `prompt.md` and media)
- `neo/` — design experiment with several variants (`index*.html`, `neo*.html`, frames, video)
- `1/` — a small standalone experiment

## `niss/` — Noor Infotech website (separate site)

A full copy of the Noor Infotech & Software Solutions website
(index, about, services, portfolio, careers, blog, faq, contact).
This is a **separate company site living inside this repo** — the long-term
home for it should be its own repository / the main Noor Infotech domain.
Not moved in Phase 2 to avoid breaking any shared links.

## `experiments/` — personal experiments

Small one-off pages that are not part of the portfolio, e.g. `bd.html` (birthday page).
