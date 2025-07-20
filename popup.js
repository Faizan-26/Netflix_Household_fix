// Popup JavaScript for Netflix Household Fix extension

// DOM elements
const extensionToggle = document.getElementById('extensionToggle');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    loadExtensionStatus();
    setupEventListeners();
});

// Load extension status
function loadExtensionStatus() {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
        if (chrome.runtime.lastError || !response) {
            // Default to enabled if communication fails
            updateUI({ extensionEnabled: true });
            return;
        }
        updateUI(response);
    });
}

// Setup event listeners
function setupEventListeners() {
    extensionToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;

        chrome.runtime.sendMessage({
            action: 'toggleExtension',
            enabled: enabled
        }, (response) => {
            if (chrome.runtime.lastError || !response?.success) {
                // Revert toggle if operation fails
                extensionToggle.checked = !enabled;
                return;
            }
            updateStatusIndicator(enabled);
        });
    });
}

// Update UI based on extension status
function updateUI(status) {
    extensionToggle.checked = status.extensionEnabled;
    updateStatusIndicator(status.extensionEnabled);
}

// Update status indicator
function updateStatusIndicator(enabled) {
    if (enabled) {
        statusDot.className = 'status-dot active';
        statusText.textContent = 'Active';
    } else {
        statusDot.className = 'status-dot inactive';
        statusText.textContent = 'Disabled';
    }
}
