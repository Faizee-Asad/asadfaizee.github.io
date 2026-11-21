# Repository Structure

Personal portfolio of **Asad Faizee** — live at https://asadfaizee.is-a.dev/

## What is LIVE on the site

| Path | What it is |
|---|---|
| `index.html` | Portfolio homepage |
| `services.html` | Freelance website & SEO service plans (linked as `/services`) |
| `daauc/` | Dr. Abdul Awwal Unani Clinic, Malegaon — kept live on purpose |
| `tools/` | Free online tools — one tool per file/folder, URLs are shared, do not rename |
| `css/` `js/` `img/` `fonts/` | Homepage styles, scripts, images and web fonts |
| `CNAME` `sitemap.xml` `robots.txt` `favicon.ico` | Custom domain (`asadfaizee.is-a.dev`) and SEO files |

## Archived inside `_archive/` (saved, NOT published)

All projects, single-page websites and demos were built to save, not to
publish. They now sit physically inside one folder — `_archive/` — and
GitHub Pages never serves underscore folders. **Nothing is deleted.**
Full index: [`_archive/README.md`](_archive/README.md)

| Path | What it is |
|---|---|
| `_archive/projects/` | Client-style project pages (Native Bombay, Bella Cucina, EggShella, Aura Architects, Kuts Kolor, Beam, Ironforge, Severin, Stillwater, TFC, Turf, asad) |
| `_archive/demos/` | Noor Infotech landing, NISS service page, Restaurant QR Cloud, Aurora design-studio demo |
| `_archive/experiments/` | Birthday page experiment |
| `_archive/niss/` | Full copy of the Noor Infotech company website |
| `_archive/1/` | Small old experiment (page + script + style) |
| `_archive/LITHOS/` | LITHOS single-page site |
| `_archive/Aurora.md` | Aurora demo notes |

## Still in the root, but NOT published

These folders contain photos/videos, so they could not be moved into
`_archive/` through the GitHub connector. They stay in the root, unpublished
via the `exclude` list in `_config.yml`, and are fully saved:

- `KRO-FLITE/` — sneaker store demo (300+ photos in `frames/`)
- `STUDIO/` — AR photo experience (150+ photos in `ar/`)
- `NINJUTSU-CREATIVE/` — agency page with video
- `neo/` — old experiment pages with photos/video

To publish anything again: move it out of `_archive/` (or remove its line
from `_config.yml` for the four folders above) and push.
