document.addEventListener('DOMContentLoaded', function() {

    const layers = {
        body: document.querySelector('.layer-1'),
        head: document.querySelector('.layer-2'),
        side: document.querySelector('.layer-3'),
        hair: document.querySelector('.layer-4'),
        eyes: document.querySelector('.layer-5'),
        face: document.querySelector('.layer-6'),
    };
    
    // get arms
    const leftArm   = document.querySelector    ('.layer-arm-left'  );
    const rightArm  = document.querySelector    ('.layer-arm-right' );
    const container = document.querySelector    ('.layer-stack'     );
    
    // layer check
    if (!container || !layers.eyes) { console.warn('Required layers not found'); return; }

    // ADJUST
    const CONFIG = {
        movement: {
            body: 15,
            head: 18,
            side: 25,
            hair: 15,
            eyes: 36,
            face: 30,
        },
        deadZone:       0.05,
        smoothness:     0.08,
        idleAmplitude:  1.5,
        idleSpeed:      0.02,
    };

    // track current & target positions for each layer
    const positions = {};
    const targets = {};
    
    // initialize positions for all layers
    Object.keys(layers).forEach(key => {
        positions[key]  = { x: 0, y: 0 };
        targets[key]    = { x: 0, y: 0 };
    });

    let isHovering = false;
    
    // get the center position of the container
    function getContainerCenter() {
        const rect = container.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
    
    // smooth animation using requestAnimationFrame
    function smoothFollow() { // update each layer
        Object.keys(layers).forEach(key => {
            const layer = layers[key];
            if (!layer) return;
            
            if (CONFIG.movement[key] === 0) return;
            
            positions[key].x += (targets[key].x - positions[key].x) * CONFIG.smoothness;
            positions[key].y += (targets[key].y - positions[key].y) * CONFIG.smoothness;
            
            layer.style.transform = `translate(${positions[key].x}px, ${positions[key].y}px)`;
        });
        
        requestAnimationFrame(smoothFollow);
    }

    // start the animation loop
    smoothFollow();

    // track mouse movement on the ENTIRE DOCUMENT
    document.addEventListener('mousemove', function(e) {
        const center = getContainerCenter();
        
        const offsetX = (e.clientX - center.x) / (window.innerWidth / 2);
        const offsetY = (e.clientY - center.y) / (window.innerHeight / 2);
        
        let adjustedX = offsetX;
        let adjustedY = offsetY;
        
        if (Math.abs(offsetX) < CONFIG.deadZone) adjustedX = 0;
        if (Math.abs(offsetY) < CONFIG.deadZone) adjustedY = 0;
        
        adjustedX = Math.max(-1, Math.min(1, adjustedX));
        adjustedY = Math.max(-1, Math.min(1, adjustedY));
        
        Object.keys(layers).forEach(key => {
            const moveAmount = CONFIG.movement[key] || 0;
            targets[key].x = adjustedX * moveAmount;
            targets[key].y = adjustedY * moveAmount;
        });
        
        isHovering = true;
    });

    document.addEventListener('mouseleave', function() {
        Object.keys(layers).forEach(key => {
            targets[key].x = 0;
            targets[key].y = 0;
        });
        isHovering = false;
    });

    // subtle idle animation when not hovering
    let idleTime = 0;
    
    function idleAnimation() {
        if (!isHovering) {
            idleTime += CONFIG.idleSpeed;
            
            let allAtCenter = true;
            Object.keys(layers).forEach(key => {
                if (Math.abs(targets[key].x) > 0.1 || Math.abs(targets[key].y) > 0.1) {
                    allAtCenter = false;
                }
            });
            
            if (allAtCenter) {
                const idleX = Math.sin(idleTime * 0.7) * CONFIG.idleAmplitude;
                const idleY = Math.cos(idleTime * 0.5) * CONFIG.idleAmplitude;
                
                if (!isHovering) {
                    Object.keys(layers).forEach(key => {
                        const moveAmount = CONFIG.movement[key] || 0;
                        if (moveAmount > 0) {
                            const layerIdleX = idleX * (moveAmount / 6);
                            const layerIdleY = idleY * (moveAmount / 6);
                            targets[key].x = layerIdleX;
                            targets[key].y = layerIdleY;
                        }
                    });
                }
            }
        }
        requestAnimationFrame(idleAnimation);
    }
    
    idleAnimation();

    window.addEventListener('resize', function() {
        if (!isHovering) {
            Object.keys(layers).forEach(key => {
                targets[key].x = 0;
                targets[key].y = 0;
            });
        }
    });

    // touch support for mobile devices
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const center = getContainerCenter();
        
        const offsetX = (touch.clientX - center.x) / (window.innerWidth / 2);
        const offsetY = (touch.clientY - center.y) / (window.innerHeight / 2);
        
        let adjustedX = offsetX;
        let adjustedY = offsetY;
        
        if (Math.abs(offsetX) < CONFIG.deadZone) adjustedX = 0;
        if (Math.abs(offsetY) < CONFIG.deadZone) adjustedY = 0;
        
        adjustedX = Math.max(-1, Math.min(1, adjustedX));
        adjustedY = Math.max(-1, Math.min(1, adjustedY));
        
        Object.keys(layers).forEach(key => {
            const moveAmount = CONFIG.movement[key] || 0;
            targets[key].x = adjustedX * moveAmount;
            targets[key].y = adjustedY * moveAmount;
        });
        
        isHovering = true;
    });

    document.addEventListener('touchend', function() {
        Object.keys(layers).forEach(key => {
            targets[key].x = 0;
            targets[key].y = 0;
        });
        isHovering = false;
    });

    console.log('Multi-layer parallax effect initialized!');
    console.log('Movement settings:', CONFIG.movement);
});