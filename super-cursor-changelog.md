# Super Cursor Hybrid — Changelog

## 3.7.9 — 2025-06-28
### Changed
- Widened the speed gap between followers for a more dramatic trailing effect (orange 0.15s, gray 0.75s).
- Removed dynamic mouse-speed scaling from followers for a cleaner, more predictable visual.
### Fixed
- Added scroll event listener that checks `elementFromPoint()` to correctly exit hover state when the page scrolls away from the target element.

## 3.7.8 — 2025-06-28
### Added
- Dynamic follower scaling based on mouse speed using `gsap.utils.mapRange` — followers shrink slightly during fast movement and return to full size when still.
### Changed
- Switched animation engine back from manual linear interpolation to `gsap.to()` for stability.
- Narrowed CSS transitions to only `background-color` and `border-color` instead of `all` for better performance.

## 3.7.6 — 2025-06-28
### Changed
- Replaced `gsap.to()` animation with manual linear interpolation for more direct control over follower movement.
- Extracted animation speeds into named constants (`orangeSpeed`, `graySpeed`) for easier tuning.
- Arrow reveal now requires both velocity and distance thresholds (speed < 0.2 and distance < 10px) to prevent premature arrow display.

## 3.7.5 — 2025-06-28
### Changed
- Reduced follower durations (orange 0.2s, gray 0.4s) for a faster, more responsive feel.
- Cleaned up internal comments.

## 3.7.4 — 2025-06-28
### Added
- Speed-based arrow trigger — tracks the gray follower's frame-to-frame velocity and only reveals the arrow once the follower has stopped moving (speed < 0.1), replacing the previous distance-only check.
### Changed
- Increased gray follower duration to 0.9s for a more pronounced ghosting trail effect.

## 3.7.3 — 2025-06-28
### Changed
- Renamed red follower to orange (`cursor-follower-orange`) for accuracy.
- Replaced manual lerp animation with `gsap.to()` duration-based animation for both followers.
- Arrow now follows the gray follower's position instead of the mouse directly.
### Added
- Media-aware hover state: arrow only appears when hovering links containing images or video, and only after the gray follower has settled near the mouse.
- Hover state tracking with `isHoveringMedia` and `arrowVisible` flags for proper sequential animation.

## 3.7.2 — 2025-06-28
### Added
- Introduced the dual-follower system — a fast red circle and a slower gray circle with different interpolation rates, creating a visible trailing effect.
### Changed
- Removed arrow rotation logic; arrow is now a static overlay positioned at the mouse.

## 3.7.1 — 2025-06-28
### Changed
- **Major rewrite.** Removed jQuery dependency entirely. Rewrote all animation logic in vanilla JavaScript using GSAP's `ticker.add()` loop.
- Cursor DOM elements are now created dynamically in JavaScript instead of being injected via PHP in `wp_footer`.
- Removed the old `super_cursor_add_html()` function and all PHP-side HTML output.
- Added `wp_localize_script` to pass the arrow image path from PHP to JavaScript.
- Added Elementor preview detection (`$_GET['elementor-preview']`) and `is_admin()` check to prevent loading in the WordPress admin.
- Rewrote CSS from scratch with new class names (`cursor-follower`, `cursor-arrow`) replacing the old `pxl-cursor` system.
### Added
- Arrow image element with directional rotation based on mouse movement angle (`Math.atan2`).
- Smooth arrow rotation interpolation.

## 3.7.0 — 2025-06-28
### Changed
- Version bump. No functional changes from 3.4.1.

## 3.4.1 — 2025-06-28
### Added
- Initial version tracked in this changelog.
- Single jQuery-based GSAP follower circle with hover scaling on links and buttons.
- PHP-injected cursor HTML via `wp_footer` with inline SVG arrow icon.
- Admin settings page with enable/disable toggle.
- Mobile detection via `wp_is_mobile()` and CSS media queries.
- Media hover state with gray circle and rotated SVG arrow.
