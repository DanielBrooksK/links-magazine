# Assets — Links Magazine

## Images

This project uses Unsplash images loaded via direct URL. No local image files are required.

All images are loaded with the following URL pattern:
```
https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w={width}&q=80
```

### Image IDs Used

| ID | Subject | Used In |
|----|---------|---------|
| `1587174486073-ae5e5cff23aa` | Aerial golf course | Hero (homepage, article, destinations) |
| `1426728923317-74d81b75e46a` | Ocean golf course | Pebble Beach (homepage card, destinations) |
| `1535131749006-b7f58c99034b` | Coastal links golf | Royal County Down (homepage card, courses) |
| `1504198070370-4d38e07d7395` | Parkland golf | Augusta National |
| `1606557985087-c3a67e3fc72d` | Golf fairway | Pinehurst / courses hero |
| `1566648007264-c0bfd2340e10` | Golf course | St Andrews section |
| `1593111774240-d529f12cf4bb` | Golf driver | Gear hero, product cards |
| `1547347298-4074ad3086f0` | Golf balls | Titleist product card |
| `1558618666-fcd25c85cd64` | Putting | Scotty Cameron product card |
| `1571019614242-c5c5dee9f50b` | Golfer silhouette | Archive section (B&W) |
| `1533929736458-ca588d08c8be` | Lighthouse | Turnberry article |
| `1542291026-7eec264c27ff` | Athletic shoe | FootJoy product card |
| `1507003211169-0a1dd7228f2d` | Portrait man 1 | Author bio, player bag |
| `1472099645785-5658abf4ff4e` | Portrait man 2 | Player bag |
| `1500648767791-00dcc994a43e` | Portrait man 3 | Player bag |

### Replacing Images

To replace any image with a local file:
1. Download your image and place it in `assets/images/`
2. Update the `src` attribute in the relevant HTML file
3. Replace the Unsplash URL with `../assets/images/your-image.jpg`

### Performance Notes

- Hero images use `loading="eager"` and `fetchpriority="high"` for LCP optimisation
- All other images use `loading="lazy"` for deferred loading
- Images specify `auto=format` to leverage Unsplash's automatic WebP/AVIF serving
- Width parameters are set appropriate to each use case (hero: 1920px, cards: 600–800px)

## Fonts

Loaded via Google Fonts CDN:
- **Cormorant Garamond** — Display headlines (300, 400, 600, 700 + italics)
- **Playfair Display** — Section headers (400, 700 + italics)
- **Lora** — Body copy (400, 500 + italics)
- **DM Sans** — UI elements, labels, captions (400, 500)

## Icons

All icons are inline SVG — no icon font dependencies.

---

*Links Magazine is a design practice project.*
