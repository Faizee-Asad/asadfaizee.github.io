# Image Compressor

Free, client-side image compressor. JPG, PNG, WebP, batch processing, format conversion, ZIP export. Zero upload.

Live at: https://asadfaizee.is-a.dev/tools/image-compressor

## What it does

- Drag and drop up to 50 images
- Compress JPG, PNG, WebP via HTML5 Canvas
- Convert between formats (auto, WebP, JPEG, PNG)
- Resize while compressing (set max width)
- Live quality slider (10% to 100%)
- Individual download or ZIP export
- Per-file before/after size + savings %
- Aggregate stats: total original, total compressed, % saved
- 100% client-side, zero upload, no server

## Why client-side

Photos are private. Most online image compressors upload your image to their server, process it, and send it back. For vacation pics, fine. For client work, internal docs, anything sensitive, that's a leak vector.

This tool uses the HTML5 Canvas API. Your image is loaded into a canvas in your tab, encoded by the browser's built-in encoder, and downloaded. No server ever sees your image. The privacy badge at the top of the page is a real counter, and it stays at 0.

## File structure

```
image-compressor/
├── index.html       # Semantic HTML + JSON-LD
├── styles.css       # Drag-drop UI
├── app.js           # Drop zone, compression engine, ZIP builder
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
