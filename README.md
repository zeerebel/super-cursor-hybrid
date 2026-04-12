# Super Cursor Hybrid

A WordPress plugin that replaces the default browser cursor with a dual-circle GSAP animation system. Two translucent circles follow the mouse at different speeds — a fast orange follower and a slower gray follower — creating a physics-based trailing effect. When the gray follower settles over linked media, a directional arrow fades in.

Built as a frontend interaction design tool for WordPress sites that need a distinctive cursor treatment without touching theme code.

## What It Does

- **Dual follower system** — two circles track the mouse independently. The orange follower responds in 0.15s, the gray follower in 0.75s, producing a visible lag/trail effect.
- **Physics-based arrow reveal** — when hovering over linked images or video, a PNG arrow fades in only after the gray follower has settled (speed < 0.2px/frame and distance < 10px from mouse). This prevents the arrow from appearing while the cursor is still moving.
- **Mobile-aware** — the custom cursor is hidden entirely on screens below 1025px via CSS media queries, and the PHP enqueue function checks `wp_is_mobile()` before loading any assets.
- **Admin and editor safe** — assets are not loaded in the WordPress admin or Elementor's preview mode.
- **Settings page** — simple on/off toggle under Settings → Super Cursor.
- **GSAP-powered** — all animation runs through GSAP's ticker for consistent frame-rate performance instead of `requestAnimationFrame` or CSS transitions.
- **wp_localize_script for asset paths** — the arrow image path is passed from PHP to JavaScript via `wp_localize_script`, avoiding hardcoded URLs in the JS file.

## Technical Architecture

```
super-cursor-hybrid.php        → Plugin bootstrap, settings page, asset enqueue, wp_localize_script
assets/
  js/cursor-script.js          → GSAP animation loop, hover detection, arrow visibility logic
  css/cursor-style.css         → Follower styling, CSS custom properties for sizing, media queries
  img/
    arrow-light.png            → Directional arrow overlay
    icon.png                   → Plugin icon
    group.png, group-1.png     → Cursor design assets
```

**Key implementation details:**

- GSAP `ticker.add()` drives the animation loop — both followers are repositioned every frame with `gsap.set()` for GPU-composited transforms.
- Follower centering uses CSS `calc()` with custom properties (`--size`) rather than JavaScript offset math.
- Hover targets are selected with `a:has(img), a:has(video)` to limit the arrow effect to media links only.
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

## License

GPLv2 or later.

## Author

[Mark Phu](https://mongphu.com) · Creative Farm Design
