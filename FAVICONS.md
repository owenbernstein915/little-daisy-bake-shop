# Site icons

`public/favicon.svg` is the cupcake master, using the site's plum, golden
yellow, and cream. Its checked-in PNG/ICO exports are served at stable URLs:

- `favicon.png`: 96 × 96 for browsers and search results.
- `favicon.ico`: 16, 32, 48, and 96px frames.
- `apple-touch-icon.png`: 180 × 180 for mobile bookmarks.
- `icon-192.png` and `icon-512.png`: web manifest icons.

The HTML template declares file-backed PNG and ICO icons rather than an
embedded data URL. `npm run build` copies these files without extra dependencies.
Google controls recrawl timing and whether an icon appears in search results.
