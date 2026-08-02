# Regex Tester + Explainer

Free, client-side regex tester with plain-English pattern explanation. Live match highlighting, capture groups, named groups, replace mode. Zero upload.

Live at: https://asadfaizee.is-a.dev/tools/regex-tester

## What it does

- Live regex match highlighting (overlay behind a textarea so the cursor still works)
- Plain-English pattern explainer (token-by-token breakdown)
- Capture group inspector (numbered + named)
- Replace mode with backreferences ($1, $2, $&, $`, $')
- All JavaScript regex flags (g, i, m, s, u, y)
- Sidebar cheatsheet (click to insert any token)
- Pre-loaded sample pattern (named date groups)
- 100% client-side, zero upload, no server

## Why client-side

Regex patterns often contain the data they were built to extract. Testing a pattern against a real customer list, real log lines, or a real API payload means trusting a server-side tool with both your pattern AND your data. This tool uses the browser's built-in RegExp engine. Nothing leaves your tab.

## File structure

```
regex-tester/
├── index.html       # Semantic HTML + JSON-LD
├── styles.css       # Dark-mode dev aesthetic
├── app.js           # Tokenizer + explainer + matching engine
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
