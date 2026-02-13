// This script monkey-patches addEventListener to force passive: true for touch events
// This is used to suppress "Added non-passive event listener" violations from third-party libraries like react-pageflip

(function () {
    if (typeof window === 'undefined') return;

    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        let newOptions = options;

        if (type === 'touchstart' || type === 'touchmove' || type === 'wheel') {
            if (typeof options === 'boolean') {
                // If options is a boolean (capture), convert to object
                newOptions = { capture: options, passive: true };
            } else if (typeof options === 'object') {
                // If options is an object, force passive: true
                newOptions = { ...options, passive: true };
            } else {
                // If no options provided, default to passive: true
                newOptions = { passive: true };
            }
        }

        return originalAddEventListener.call(this, type, listener, newOptions);
    };
})();
