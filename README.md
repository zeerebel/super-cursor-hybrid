# Super Cursor Hybrid

A WordPress plugin that replaces the default browser cursor with a dual-circle GSAP animation system. Two translucent circles follow the mouse at different speeds — a fast orange follower and a slower gray follower — creating a physics-based trailing effect. When the gray follower settles over linked media, a directional arrow fades in.

Built as a frontend interaction design tool for WordPress sites that need a distinctive cursor treatment without touching theme code.

**Live demo:** [superdupercursor.mongphu.com](https://superdupercursor.mongphu.com/)

## What It Does

- **Dual follower system** — two circles track the mouse independently. The orange follower responds in 0.15s, the gray follower in 0.75s, producing a visible lag/trail effect.
- **Physics-based arrow reveal** — when hovering over linked images or video, a PNG arrow fades in only after the gray follower has settled (speed < 0.2px/frame and distance < 10px from mouse). This prevents the arrow from appearing while the cursor is still moving.
- **Custom arrow selectors** — define your own CSS selectors via the admin panel to trigger the arrow cursor on any element.
- **Custom arrow overrides** — map specific selectors to custom PNG cursors (e.g. a shopping bag icon for `.shop-item`, a play icon for `.video-trigger`).
- **Mobile-aware** — the custom cursor is hidden entirely on screens below 1025px via CSS media queries, and the PHP enqueue function checks `wp_is_mobile()` before loading any assets.
- **Admin and editor safe** — assets are not loaded in the WordPress admin or Elementor's preview mode.
- **Settings page** — toggle on/off, configure arrow selectors, and map custom cursor PNGs under Settings → Super Cursor.
- **GSAP-powered** — all animation runs through GSAP's ticker for consistent frame-rate performance instead of `requestAnimationFrame` or CSS transitions.
- **wp_localize_script for asset paths** — all dynamic data (arrow image path, selectors, overrides) is passed from PHP to JavaScript via `wp_localize_script`, avoiding hardcoded URLs.

## Technical Architecture

```
super-cursor-hybrid.php        → Plugin bootstrap, settings page, asset enqueue, wp_localize_script
assets/
  js/cursor-script.js          → GSAP animation loop, hover detection, arrow visibility logic, override mapping
  css/cursor-style.css         → Follower styling, CSS custom properties for sizing, media queries
  img/
    arrow-light.png            → Default directional arrow overlay
```

**Key implementation details:**

- GSAP `ticker.add()` drives the animation loop — both followers are repositioned every frame with `gsap.set()` for GPU-composited transforms.
- Follower centering uses CSS `calc()` with custom properties (`--size`) rather than JavaScript offset math.
- Hover targets are selected with `a:has(img), a:has(video)` plus any user-defined selectors.
- Arrow override map splits on first colon only, so URLs with `https://` parse correctly.
- Scroll events trigger a `document.elementFromPoint()` check to correctly exit hover state when the page scrolls away from the target element — a common bug in cursor-replacement plugins.
- The default cursor is globally hidden with `cursor: none !important` on desktop only.
- `will-change: transform` is applied to all cursor elements for compositor-layer promotion.

## Requirements

- WordPress 5.8+
- PHP 7.4+
- No build tooling required. GSAP is loaded from cdnjs at runtime.

## Installation

1. Download or clone this repository.
2. Upload the `super-cursor-hybrid` folder to `wp-content/plugins/`.
3. Activate the plugin in **Plugins → Installed Plugins**.
4. Go to **Settings → Super Cursor** and enable the custom cursor.

## Configuration

Under **Settings → Super Cursor**, you can:

1. **Enable/disable** the custom cursor globally.
2. **Custom Selector(s) for Arrow Cursor** — enter CSS selectors (comma or newline separated) that should show the default arrow on hover. Example: `.video-trigger, .shop-item`
3. **Custom Selector to Arrow Map** — map selectors to custom PNG URLs (one per line). Format: `.shop-item : https://domain.com/cart-cursor.png`

## GSAP License

This plugin loads GSAP from cdnjs. GSAP's standard (no-charge) license covers most websites. If your site charges users for access, check [GSAP's licensing page](https://gsap.com/licensing/) for Business Green requirements.

## Changelog

### 3.8.0
- Added proper WordPress plugin headers (Plugin URI, License, Text Domain, Requires at least, Requires PHP)
- Updated GSAP from 3.12.2 to 3.12.5
- Added admin fields for custom arrow selectors and custom arrow override mapping
- Arrow override map now correctly parses URLs containing colons
- Scroll safety check resets arrow source to default on mouseout
- Bumped version

### 3.7.9
- Initial public release on GitHub
- Dual follower system with physics-based arrow reveal
- Mobile detection, admin/Elementor safety, GSAP ticker loop

## License

GPLv2 or later.

## Author

[Mark Phu](https://mongphu.com) · Creative Farm Design
