
// Background service worker for Netflix Household Fix extension
// This now works in conjunction with the early content script injector.js

let isExtensionEnabled = true;

chrome.runtime.onInstalled.addListener(() => {
    // Set default state
    chrome.storage.local.set({
        extensionEnabled: true
    });
});

// Function to set extension state on a specific tab (for both early and late injection)
function setExtensionStateOnTab(tabId, enabled) {
    chrome.scripting.executeScript({
        target: { tabId: tabId }, func: (enabled) => {
            window.netflixHouseholdFixEnabled = enabled;

            if (window.netflixHouseholdFixEarlyActive) {
                // Early injection system is active, state updated
            }
        },
        args: [enabled],
        world: 'MAIN'
    }).catch(() => {
        // Silent fail if tab is not accessible
    });
}

// Listen for tab updates - Simplified since early injection handles primary blocking
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url) return;

    // Handle ALL Netflix pages - mainly for state management now
    if (tab.url && tab.url.includes('netflix.com')) {
        // Always set state for both early and late injection systems
        setExtensionStateOnTab(tabId, isExtensionEnabled);
    }
});

// Listen for tab activation to ensure state is set
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes('netflix.com')) {
            // Always ensure state is set when switching to Netflix tabs
            setExtensionStateOnTab(activeInfo.tabId, isExtensionEnabled);
        }
    });
});

// Function to update all Netflix tabs with current state
function updateAllNetflixTabs(enabled) {
    chrome.tabs.query({ url: "*://*.netflix.com/*" }, (tabs) => {
        tabs.forEach(tab => {
            setExtensionStateOnTab(tab.id, enabled);
        });
    });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'toggleExtension':
            isExtensionEnabled = request.enabled;
            chrome.storage.local.set({ extensionEnabled: request.enabled });
            // Update all Netflix tabs with new state
            updateAllNetflixTabs(request.enabled);
            sendResponse({ success: true });
            break;

        case 'getStatus':
            sendResponse({
                extensionEnabled: isExtensionEnabled
            });
            break;

        default:
            sendResponse({ error: 'Unknown action' });
            break;
    }

    return true; // Keep message channel open for async response
});

// Load saved settings on startup
chrome.storage.local.get(['extensionEnabled'], (result) => {
    isExtensionEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;

    // Update all existing Netflix tabs with current state
    updateAllNetflixTabs(isExtensionEnabled);
});
