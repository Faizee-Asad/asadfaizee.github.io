# Code to Image Generator

Free, client-side Markdown and code to image generator. 100% in your browser. No upload, no signup, no watermark.

Live at: https://asadfaizee.is-a.dev/tools/code-to-image

## What it does

- Code and Markdown to PNG/SVG
- 8 syntax themes (midnight, GitHub dark/light, Dracula, Monokai, Solarized, Nord, One Light)
- 8 backgrounds (solid, gradients, transparent checker)
- 3 window styles (macOS traffic lights, Windows controls, none)
- Custom padding, corner radius, font size
- 15+ languages with pattern-based tokenization
- PNG export at 2x retina
- SVG export (vector)
- Embed code generator for blog posts (opt-in backlink)

## Why client-side

The image is drawn on a canvas in your tab. The privacy badge at the top of the page is a real counter; it stays at 0 forever. No server, no upload, no analytics.

## File structure

```
code-to-image/
├── index.html       # Semantic HTML + JSON-LD
├── styles.css       # Glassmorphic light theme
├── app.js           # Tokenizer + 8 themes + canvas renderer + export
├── robots.txt
├── sitemap.xml
└── README.md
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly. Works file:// too.

## Deploy

Drop into any static host. No env vars, no server runtime.

## License

MIT
