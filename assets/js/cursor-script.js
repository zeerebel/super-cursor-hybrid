document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap === 'undefined' || typeof pluginData === 'undefined') {
        console.error('Super Cursor: GSAP or pluginData is not available.');
        return;
    }

    const body = document.body;

    const followerOrange = document.createElement('div');
    followerOrange.className = 'cursor-follower-orange';

    const followerGray = document.createElement('div');
    followerGray.className = 'cursor-follower-gray';

    const arrow = document.createElement('img');
    arrow.className = 'cursor-arrow';
    arrow.src = pluginData.arrowImgPath;

    body.appendChild(followerOrange);
    body.appendChild(followerGray);
    body.appendChild(arrow);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const orangePos = { x: mouse.x, y: mouse.y };
    const grayPos = { x: mouse.x, y: mouse.y };
    const lastGrayPos = { x: grayPos.x, y: grayPos.y };
    
    let isHoveringMedia = false;
    let arrowVisible = false;

    // --- Main Animation Loop ---
    gsap.ticker.add(() => {
        // UPDATED: Drastically different durations for a long trail effect
        gsap.to(orangePos, { x: mouse.x, y: mouse.y, duration: 0.15, ease: "power2.out" }); // Very fast
        gsap.to(grayPos, { x: mouse.x, y: mouse.y, duration: 0.75, ease: "power2.out" }); // Much slower, triple the lag

        // Apply positions
        gsap.set(followerOrange, { x: orangePos.x, y: orangePos.y });
        gsap.set(followerGray, { x: grayPos.x, y: grayPos.y });
        gsap.set(arrow, { x: grayPos.x, y: grayPos.y });
        
        // Robust arrow trigger logic
        const graySpeed = Math.hypot(grayPos.x - lastGrayPos.x, grayPos.y - lastGrayPos.y);
        const distanceToMouse = Math.hypot(grayPos.x - mouse.x, grayPos.y - mouse.y);
        lastGrayPos.x = grayPos.x;
        lastGrayPos.y = grayPos.y;

        if (isHoveringMedia && !arrowVisible) {
            if (graySpeed < 0.2 && distanceToMouse < 10) {
                arrowVisible = true;
                gsap.to(arrow, { opacity: 1, duration: 0.3 });
            }
        }
    });

    // --- Hover and Event Logic ---
    const mediaLinks = document.querySelectorAll('a:has(img), a:has(video)');
    
    const handleMouseEnter = () => {
        if (!isHoveringMedia) {
            isHoveringMedia = true;
            body.classList.add('cursor-media-hover');
        }
    };

    const handleMouseLeave = () => {
        if (isHoveringMedia) {
            isHoveringMedia = false;
            if (arrowVisible) {
                arrowVisible = false;
                gsap.to(arrow, { opacity: 0, duration: 0.2 });
            }
            body.classList.remove('cursor-media-hover');
        }
    };

    mediaLinks.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
    });

    // --- BUG FIX: Listener for the scroll event ---
    const checkHoverOnScroll = () => {
        if (!isHoveringMedia) return; // Only run the check if the state is currently "hovering"

        const elementUnderCursor = document.elementFromPoint(mouse.x, mouse.y);
        // If the element under the cursor is not a valid media link, trigger the leave function
        if (!elementUnderCursor || !elementUnderCursor.closest('a:has(img), a:has(video)')) {
            handleMouseLeave();
        }
    };
    
    window.addEventListener('scroll', checkHoverOnScroll, { passive: true });
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
});