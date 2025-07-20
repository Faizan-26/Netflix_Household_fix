// Background service worker for Netflix Household Fix extension

let isExtensionEnabled = true;
let blockingState = {
    isBlocking: false,
    timeoutId: null,
    startTime: null,
    duration: 12000 // 5 seconds
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    // Set default state
    chrome.storage.local.set({
        extensionEnabled: true,
        blockingState: false
    });

    // Disable blocking rule initially
    disableBlocking();
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!isExtensionEnabled || !tab.url) return;

    // Check if it's a Netflix tab and URL changed
    if (changeInfo.url || changeInfo.status === 'loading') {
        handleNetflixNavigation(tab.url, tabId);
    }
});

// Listen for tab refresh (navigation to same URL)
chrome.webNavigation.onCommitted.addListener((details) => {
    if (!isExtensionEnabled) return;

    if (details.frameId === 0) { // Main frame only
        handleNetflixNavigation(details.url, details.tabId);
    }
});

// Handle Netflix navigation logic
function handleNetflixNavigation(url, tabId) {
    if (!url.includes('netflix.com')) return;

    const isBrowsePage = url.includes('netflix.com/browse');
    const isWatchPage = url.includes('netflix.com/watch/');
    const isNetflixPage = url.includes('netflix.com');

    if (isBrowsePage || isWatchPage || isNetflixPage) {
        console.log('Netflix navigation detected:', url);
        startBlocking(tabId);
    }
}

// Start blocking for 5 seconds
function startBlocking(tabId) {
    if (blockingState.timeoutId) {
        clearTimeout(blockingState.timeoutId);
    }

    blockingState.isBlocking = true;
    blockingState.startTime = Date.now();

    // Enable blocking rule
    enableBlocking();

    // Update storage
    chrome.storage.local.set({
        blockingState: true,
        blockStartTime: blockingState.startTime
    });

    // Notify content script
    chrome.tabs.sendMessage(tabId, {
        action: 'blockingStarted',
        duration: blockingState.duration
    }).catch(() => {
        // Ignore if content script not ready
    });

    // Set timeout to stop blocking
    blockingState.timeoutId = setTimeout(() => {
        stopBlocking(tabId);
    }, blockingState.duration);

    console.log('Blocking started for 5 seconds');
}

// Stop blocking
function stopBlocking(tabId) {
    blockingState.isBlocking = false;
    blockingState.timeoutId = null;

    // Disable blocking rule
    disableBlocking();

    // Update storage
    chrome.storage.local.set({
        blockingState: false
    });

    // Notify content script
    chrome.tabs.sendMessage(tabId, {
        action: 'blockingStopped'
    }).catch(() => {
        // Ignore if content script not ready
    });

    console.log('Blocking stopped');
}

// Enable blocking using declarativeNetRequest
function enableBlocking() {
    chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['netflix_rules']
    });
}

// Disable blocking using declarativeNetRequest
function disableBlocking() {
    chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ['netflix_rules']
    });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'toggleExtension':
            isExtensionEnabled = request.enabled;
            chrome.storage.local.set({ extensionEnabled: request.enabled });

            if (!request.enabled) {
                // If extension is disabled, stop any active blocking
                if (blockingState.timeoutId) {
                    clearTimeout(blockingState.timeoutId);
                    stopBlocking(sender.tab?.id);
                }
            }

            sendResponse({ success: true });
            break;

        case 'getStatus':
            sendResponse({
                extensionEnabled: isExtensionEnabled,
                isBlocking: blockingState.isBlocking,
                timeRemaining: blockingState.isBlocking ?
                    Math.max(0, blockingState.duration - (Date.now() - blockingState.startTime)) : 0
            });
            break;

        case 'forceBlock':
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url.includes('netflix.com')) {
                    startBlocking(tabs[0].id);
                }
            });
            sendResponse({ success: true });
            break;
    }

    return true; // Keep message channel open for async response
});

// Load saved settings on startup
chrome.storage.local.get(['extensionEnabled'], (result) => {
    isExtensionEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
});
