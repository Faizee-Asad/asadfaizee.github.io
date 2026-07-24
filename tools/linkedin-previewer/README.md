# Hookline — LinkedIn Post Previewer

Free, client-side LinkedIn post previewer with live mobile/desktop truncation simulation and Unicode text formatter. Zero data collection. No login. No backend.

## What it does

- **Live feed preview** — paste your draft, see exactly how it'll render in the LinkedIn feed
- **Mobile vs desktop toggle** — 140-character fold on mobile, 210 on desktop
- **Unicode bold/italic/monospace** — bypass LinkedIn's lack of rich text formatting
- **Character counter** — with sweet-spot guidance (1,200–1,800 chars performs best)
- **Viral templates** — pre-loaded with proven hook formats
- **100% client-side** — your drafts never touch a server. Disconnect from WiFi, it still works.

## Tech stack

- Pure HTML5, CSS3, vanilla JavaScript (ES2020)
- Zero frameworks, zero build step
- Single `<script>` and `<link>` to ship
- ~30KB total payload (excluding fonts)

## File structure

```
linkedin-previewer/
├── index.html       # Semantic HTML + JSON-LD schema
├── styles.css       # Design system + LinkedIn feed replica
├── app.js           # Preview engine, Unicode converter, templates
├── robots.txt
├── sitemap.xml
└── README.md
```

## Run locally

No build, no install. Just serve the directory:

```bash
# Python
python3 -m http.server 8000

# Or Node
npx serve .
```

Open `http://localhost:8000`.

## Deploy

Drop the directory into any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, or even a $0 S3 bucket. No environment variables, no server runtime.

## SEO checklist (all done)

- [x] Semantic HTML (header hierarchy, landmarks, ARIA)
- [x] JSON-LD WebApplication + FAQPage schema
- [x] Open Graph + Twitter Card meta
- [x] Canonical URL
- [x] Long-form below-the-fold content (anti thin-content)
- [x] Preloaded template on first paint (low bounce rate signal)
- [x] `defer` on script (no render-blocking)
- [x] Preconnect to font CDN
- [x] Mobile responsive
- [x] Skip-to-content link
- [x] ARIA-live regions for dynamic content

## Monetization (non-intrusive)

- Sponsor button in header (`github.com/sponsors/hookline`)
- "Buy me a coffee" CTA in footer section
- Affiliate link integration ready (e.g., Taplio for users who outgrow the tool)

## License

MIT
