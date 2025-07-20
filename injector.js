// Content script injector - runs at document_start for earliest possible injection
(function () {
    'use strict';

    // Create script element to inject our blocking code directly into the page context
    const script = document.createElement('script');

    // Inject the blocking code as early as possible
    script.textContent = '(' + function () {
        // Set early flag to indicate we're active
        window.netflixHouseholdFixEarlyActive = true;

        // Store original functions IMMEDIATELY before Netflix can load
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        const originalFetch = window.fetch;

        // Function to check if extension is enabled (default to true for early injection)
        function isExtensionEnabled() {
            // Default to enabled if not set yet
            const enabled = window.netflixHouseholdFixEnabled !== false;
            return enabled;
        }

        // Override XMLHttpRequest.open immediately
        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            this._url = url;
            this._method = method;
            return originalXHROpen.call(this, method, url, ...args);
        };

        // Override XMLHttpRequest.send with blocking logic
        XMLHttpRequest.prototype.send = function (data) {
            // Check if extension is enabled before blocking
            if (!isExtensionEnabled()) {
                return originalXHRSend.call(this, data);
            }

            if (this._url && this._url.includes('web.prod.cloud.netflix.com/graphql')) {
                if (data) {
                    try {
                        let payload = '';

                        // Handle different data types
                        if (typeof data === 'string') {
                            payload = data;
                        } else if (data instanceof FormData) {
                            return originalXHRSend.call(this, data);
                        } else if (data instanceof ArrayBuffer) {
                            payload = new TextDecoder().decode(data);
                        } else if (data instanceof Uint8Array) {
                            payload = new TextDecoder().decode(data);
                        } else {
                            payload = JSON.stringify(data);
                        }                        // Log all GraphQL requests we intercept
                        const operationMatch = payload.match(/"operationName":"([^"]+)"/);
                        const operationName = operationMatch ? operationMatch[1] : 'Unknown';

                        // Check for target operations - PRIORITIZE THE MOST IMPORTANT ONES
                        const isImportantOperation = payload.includes('"operationName":"CLCSInterstitialLolomo"') ||
                            payload.includes('"operationName":"CLCSInterstitialPlaybackAndPostPlayback"');

                        const isFeedbackOperation = payload.includes('"operationName":"CLCSSendFeedback"');

                        if (isImportantOperation || isFeedbackOperation) {
                            const operationType = payload.includes('CLCSInterstitialLolomo') ? 'CLCSInterstitialLolomo' :
                                payload.includes('CLCSInterstitialPlaybackAndPostPlayback') ? 'CLCSInterstitialPlaybackAndPostPlayback' : 'CLCSSendFeedback';

                            // Immediately set up the fake response
                            const fakeResponse = `{"data":{"${operationType}":null}}`;

                            // Set response properties synchronously
                            Object.defineProperty(this, 'readyState', { value: 4, writable: false, configurable: true });
                            Object.defineProperty(this, 'status', { value: 200, writable: false, configurable: true });
                            Object.defineProperty(this, 'statusText', { value: 'OK', writable: false, configurable: true });
                            Object.defineProperty(this, 'responseText', { value: fakeResponse, writable: false, configurable: true });
                            Object.defineProperty(this, 'response', { value: fakeResponse, writable: false, configurable: true });

                            // Trigger callbacks immediately (synchronously)
                            if (this.onreadystatechange) {
                                try {
                                    this.onreadystatechange();
                                } catch (e) {
                                    // Silent error handling
                                }
                            }
                            if (this.onload) {
                                try {
                                    this.onload();
                                } catch (e) {
                                    // Silent error handling
                                }
                            }

                            return; // Block the actual request
                        }
                    } catch (error) {
                        // Silent error handling
                    }
                }
            }
            return originalXHRSend.call(this, data);
        };

        // Override fetch API immediately
        window.fetch = function (url, options = {}) {
            // Check if extension is enabled before blocking
            if (!isExtensionEnabled()) {
                return originalFetch.call(this, url, options);
            }

            if (typeof url === 'string' && url.includes('web.prod.cloud.netflix.com/graphql')) {
                if (options.body) {
                    try {
                        let payload = '';

                        // Handle different body types
                        if (typeof options.body === 'string') {
                            payload = options.body;
                        } else if (options.body instanceof FormData) {
                            return originalFetch.call(this, url, options);
                        } else if (options.body instanceof ArrayBuffer) {
                            payload = new TextDecoder().decode(options.body);
                        } else if (options.body instanceof Uint8Array) {
                            payload = new TextDecoder().decode(options.body);
                        } else {
                            payload = JSON.stringify(options.body);
                        }                        // Log all GraphQL requests we intercept
                        const operationMatch = payload.match(/"operationName":"([^"]+)"/);
                        const operationName = operationMatch ? operationMatch[1] : 'Unknown';

                        // Check for target operations - PRIORITIZE THE MOST IMPORTANT ONES
                        const isImportantOperation = payload.includes('"operationName":"CLCSInterstitialLolomo"') ||
                            payload.includes('"operationName":"CLCSInterstitialPlaybackAndPostPlayback"');

                        const isFeedbackOperation = payload.includes('"operationName":"CLCSSendFeedback"');

                        if (isImportantOperation || isFeedbackOperation) {
                            const operationType = payload.includes('CLCSInterstitialLolomo') ? 'CLCSInterstitialLolomo' :
                                payload.includes('CLCSInterstitialPlaybackAndPostPlayback') ? 'CLCSInterstitialPlaybackAndPostPlayback' : 'CLCSSendFeedback';

                            // Return fake successful response
                            return Promise.resolve(new Response(
                                `{"data":{"${operationType}":null}}`,
                                {
                                    status: 200,
                                    statusText: 'OK',
                                    headers: { 'Content-Type': 'application/json' }
                                }
                            ));
                        }
                    } catch (error) {
                        // Silent error handling
                    }
                }
            }
            return originalFetch.call(this, url, options);
        };

        // Monitor for household verification detection and auto-reload
        function checkForHouseholdMessage() {
            // Only run this after DOM is ready
            if (!document.body) return false;

            // Try multiple selectors in case the structure changes
            const selectors = [
                'body > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div > div',
                '[data-uia="error-message-container"]',
                '[data-uia="household-error"]',
                'div[role="dialog"]',
                '.error-message',
                '.household-message'
            ];

            const targetText = "Your device isn't part of the Netflix Household for this account";

            // Check each selector
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    if (element && element.textContent && element.textContent.includes(targetText)) {
                        // Perform hot reload (soft reload) that preserves cache
                        setTimeout(() => {
                            // Method 1: Simple reload without cache clearing
                            window.location.reload();

                            // Fallback method if above doesn't work
                            setTimeout(() => {
                                window.location.href = window.location.href;
                            }, 100);
                        }, 300);
                        return true;
                    }
                }
            }

            // Also check entire body text as fallback
            if (document.body && document.body.textContent && document.body.textContent.includes(targetText)) {
                setTimeout(() => {
                    // Hot reload without cache clearing
                    window.location.reload();
                }, 300);
                return true;
            }

            return false;
        }

        // Wait for DOM to be ready before starting household detection
        function startHouseholdDetection() {
            if (document.body) {
                // Monitor for household verification message every 500ms
                const householdCheckInterval = setInterval(() => {
                    if (checkForHouseholdMessage()) {
                        clearInterval(householdCheckInterval);
                    }
                }, 500);

                // Also check when DOM changes (using MutationObserver)
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            setTimeout(() => {
                                if (checkForHouseholdMessage()) {
                                    observer.disconnect();
                                }
                            }, 50);
                        }

                        if (mutation.type === 'characterData') {
                            setTimeout(() => {
                                if (checkForHouseholdMessage()) {
                                    observer.disconnect();
                                }
                            }, 50);
                        }
                    });
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            } else {
                // Wait for body to be available
                setTimeout(startHouseholdDetection, 10);
            }
        }        // Start household detection when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startHouseholdDetection);
        } else {
            startHouseholdDetection();
        }

    } + ')();';

    // Inject the script as early as possible
    if (document.documentElement) {
        document.documentElement.prepend(script);
    } else {
        // Fallback: wait for documentElement
        const observer = new MutationObserver(() => {
            if (document.documentElement) {
                document.documentElement.prepend(script);
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true });
    }
})();
