document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof pluginData === 'undefined') {
        console.error('Super Cursor: GSAP or pluginData is not available.');
        return;
    }

    // --- Parse arrow overrides into a lookup map ---
    const overrideMap = {};
    const rawOverrides = pluginData.arrowOverrides || '';
    if (rawOverrides.trim()) {
        rawOverrides.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            // Split on first colon only (URLs contain colons)
            const colonIndex = trimmed.indexOf(':');
            if (colonIndex === -1) return;
            const selector = trimmed.substring(0, colonIndex).trim();
            const url = trimmed.substring(colonIndex + 1).trim();
            if (selector && url) {
                overrideMap[selector] = url;
            }
        });
    }

    // --- Parse custom arrow selectors ---
    const rawSelectors = pluginData.arrowSelectors || '';
    const customArrowSelectors = rawSelectors
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    // --- Build combined hover selector ---
    const baseSelectors = ['a:has(img)', 'a:has(video)'];
    const allArrowSelectors = baseSelectors.concat(customArrowSelectors).concat(Object.keys(overrideMap));
    const combinedSelector = allArrowSelectors.join(', ');

    // --- Create cursor DOM elements ---
    const followerOrange = document.createElement('div');
    followerOrange.className = 'follower follower-orange';
    document.body.appendChild(followerOrange);

    const followerGray = document.createElement('div');
    followerGray.className = 'follower follower-gray';
    document.body.appendChild(followerGray);

    const arrow = document.createElement('img');
    arrow.className = 'cursor-arrow';
    arrow.src = pluginData.arrowImgPath;
    arrow.alt = '';
    arrow.draggable = false;
    followerGray.appendChild(arrow);

    // --- State ---
    let mouseX = -100;
    let mouseY = -100;
    let orangeX = -100;
    let orangeY = -100;
    let grayX = -100;
    let grayY = -100;
    let prevGrayX = -100;
    let prevGrayY = -100;
    let isHovering = false;
    let currentHoverTarget = null;

    const orangeSpeed = 0.15;
    const graySpeed = 0.75;
    const settleSpeedThreshold = 0.2;
    const settleDistThreshold = 10;

    // --- Mouse tracking ---
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // --- Hover detection ---
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(combinedSelector);
        if (target) {
            isHovering = true;
            currentHoverTarget = target;

            // Check override map first
            let matched = false;
            for (const selector in overrideMap) {
                if (target.matches(selector) || target.closest(selector)) {
                    arrow.src = overrideMap[selector];
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                arrow.src = pluginData.arrowImgPath;
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(combinedSelector);
        if (target) {
            isHovering = false;
            currentHoverTarget = null;
            gsap.to(arrow, { opacity: 0, duration: 0.2 });
            // Reset to default
            arrow.src = pluginData.arrowImgPath;
        }
    });

    // --- Scroll safety: re-check hover target ---
    window.addEventListener('scroll', () => {
        if (!isHovering) return;
        const el = document.elementFromPoint(mouseX, mouseY);
        if (!el || !el.closest(combinedSelector)) {
            isHovering = false;
            currentHoverTarget = null;
            gsap.to(arrow, { opacity: 0, duration: 0.2 });
            arrow.src = pluginData.arrowImgPath;
        }
    }, { passive: true });

    // --- GSAP animation loop ---
    gsap.ticker.add(() => {
        // Interpolate followers
        orangeX += (mouseX - orangeX) * orangeSpeed;
        orangeY += (mouseY - orangeY) * orangeSpeed;
        grayX += (mouseX - grayX) * (1 - graySpeed);
        grayY += (mouseY - grayY) * (1 - graySpeed);

        // Position followers
        gsap.set(followerOrange, { x: orangeX, y: orangeY });
        gsap.set(followerGray, { x: grayX, y: grayY });

        // Arrow visibility: show only when gray follower has settled
        if (isHovering) {
            const dx = grayX - prevGrayX;
            const dy = grayY - prevGrayY;
            const speed = Math.sqrt(dx * dx + dy * dy);
            const distToMouse = Math.sqrt(
                (grayX - mouseX) * (grayX - mouseX) +
                (grayY - mouseY) * (grayY - mouseY)
            );

            if (speed < settleSpeedThreshold && distToMouse < settleDistThreshold) {
                gsap.to(arrow, { opacity: 1, duration: 0.3 });
            }
        }

        prevGrayX = grayX;
        prevGrayY = grayY;
    });
});
