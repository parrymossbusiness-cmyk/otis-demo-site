# Otis White Real Estate Static Site

Pure HTML5 and Tailwind CDN site for Cloudflare Pages.

## Files

- `index.html` - homepage with lead form, target markets, AEO block, media spotlight, and schema.
- `assets/oakland-hills-view-hero.png` - custom Oakland Hills view-property hero image.
- `oakland-real-estate.html` - Oakland city landing page template.
- `antioch-real-estate.html`, `fairfield-real-estate.html`, `richmond-real-estate.html`, `brentwood-real-estate.html`, and `vallejo-real-estate.html` - supporting city landing pages linked from the homepage.
- `first-time-buyer-guide.html` - first-time buyer guide template.
- `move-up-buyer-strategy.html` - move-up buyer guide template.
- `luv-and-business.html` - media and local business spotlight page.
- `_headers` - Cloudflare Pages security headers.
- `robots.txt` and `sitemap.xml` - crawl discovery files.

## Cloudflare Pages

Deploy the folder as a static site with no build command and `/` as the output directory.

Before launch, replace placeholder phone/social URLs if needed and connect the lead form to a CRM, email service, Cloudflare Worker, or Cloudflare Pages Functions endpoint.
