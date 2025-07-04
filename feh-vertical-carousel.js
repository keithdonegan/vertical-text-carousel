(function(window) {
    'use strict';

    // Default configuration
    var defaultOptions = {
        // Target elements
        trackSelector: '#carouselTrack',
        wrapperSelector: '.carousel-wrapper',
        
        // Default settings
        itemsToShow: 3,
        speed: 0.5,
        
        // Responsive breakpoints based on viewport height
        responsive: [
            {
                breakpoint: 900, // viewport height >= 900px
                settings: {
                    itemsToShow: 4,
                    speed: 0.5
                }
            },
            {
                breakpoint: 700, // viewport height >= 700px
                settings: {
                    itemsToShow: 3,
                    speed: 0.6
                }
            },
            {
                breakpoint: 500, // viewport height >= 500px
                settings: {
                    itemsToShow: 2,
                    speed: 0.8
                }
            },
            {
                breakpoint: 0, // viewport height < 500px
                settings: {
                    itemsToShow: 1,
                    speed: 1.0
                }
            }
        ]
    };

    var track, wrapper, items, animationFrame, position = 0, speed = 0.5, currentConfig = {};

    function deepMerge(target, source) {
        var result = {};
        var key;
        
        // Copy target properties
        for (key in target) {
            if (target.hasOwnProperty(key)) {
                result[key] = target[key];
            }
        }
        
        // Merge source properties
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = deepMerge(target[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    }

    function getResponsiveConfig(options) {
        var viewportHeight = window.innerHeight;
        var i, breakpoint, mergedSettings;
        
        // Find the appropriate breakpoint
        for (i = 0; i < options.responsive.length; i++) {
            breakpoint = options.responsive[i];
            if (viewportHeight >= breakpoint.breakpoint) {
                // Merge default settings with breakpoint settings
                mergedSettings = {};
                
                // Copy default options
                for (var prop in options) {
                    if (options.hasOwnProperty(prop) && prop !== 'responsive') {
                        mergedSettings[prop] = options[prop];
                    }
                }
                
                // Override with breakpoint settings
                for (var setting in breakpoint.settings) {
                    if (breakpoint.settings.hasOwnProperty(setting)) {
                        mergedSettings[setting] = breakpoint.settings[setting];
                    }
                }
                
                return mergedSettings;
            }
        }
        
        // Fallback to default settings
        return options;
    }

    function setupCarousel(options) {
        var i, itemHeight, clone;
        
        // Get DOM elements
        track = document.querySelector(options.trackSelector);
        wrapper = document.querySelector(options.wrapperSelector);
        
        if (!track || !wrapper) {
            console.error('FEH Vertical Carousel: Required elements not found');
            return false;
        }

        // Convert NodeList to Array (ES5 way)
        items = [];
        var trackChildren = track.children;
        for (i = 0; i < trackChildren.length; i++) {
            items.push(trackChildren[i]);
        }
        
        // Get current responsive configuration
        currentConfig = getResponsiveConfig(options);
        
        // Update speed
        speed = currentConfig.speed;
        
        // Clear previously cloned items
        var clones = track.querySelectorAll('.carousel-item[data-clone]');
        for (i = 0; i < clones.length; i++) {
            clones[i].remove();
        }

        // Calculate height per item based on items to show
        itemHeight = 100 / currentConfig.itemsToShow;

        // Apply dynamic inline style to each original item
        for (i = 0; i < items.length; i++) {
            items[i].style.height = itemHeight + 'vh';
        }

        // Clone original items for seamless loop
        for (i = 0; i < items.length; i++) {
            clone = items[i].cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            clone.style.height = itemHeight + 'vh';
            track.appendChild(clone);
        }
        
        console.log('FEH Carousel - Viewport: ' + window.innerHeight + 'px, Items to show: ' + currentConfig.itemsToShow + ', Speed: ' + currentConfig.speed);
        return true;
    }

    function animate() {
        position -= speed;

        if (Math.abs(position) >= track.scrollHeight / 2) {
            position = 0;
        }

        track.style.transform = 'translateY(' + position + 'px)';
        animationFrame = requestAnimationFrame(animate);
    }

    function createResizeHandler(options) {
        var resizeTimeout;
        
        return function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
                position = 0;
                if (track) {
                    track.style.transform = 'translateY(0)';
                }
                if (setupCarousel(options)) {
                    animate();
                }
            }, 150);
        };
    }

    // Main carousel function
    function fehVerticalCarousel(userOptions) {
        var options;
        
        // Set default parameter
        if (typeof userOptions === 'undefined') {
            userOptions = {};
        }
        
        // Merge user options with defaults
        options = deepMerge(defaultOptions, userOptions);
        
        // Wait for DOM to be ready
        function initCarousel() {
            if (setupCarousel(options)) {
                animate();
                
                // Setup resize handler
                window.addEventListener('resize', createResizeHandler(options));
            }
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCarousel);
        } else {
            initCarousel();
        }
    }

    // Expose to global scope
    window.fehVerticalCarousel = fehVerticalCarousel;

})(window);