// Popup JavaScript for Netflix Household Fix extension

let updateInterval = null;

// DOM elements
const extensionToggle = document.getElementById('extensionToggle');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const countdownContainer = document.getElementById('countdownContainer');
const countdownValue = document.getElementById('countdownValue');
const countdownProgress = document.getElementById('countdownProgress');
const statusMessage = document.getElementById('statusMessage');
const forceBlockBtn = document.getElementById('forceBlockBtn');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    loadExtensionStatus();
    setupEventListeners();
    startStatusUpdates();
});

// Load extension status
function loadExtensionStatus() {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
        if (response) {
            updateUI(response);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Extension toggle
    extensionToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;

        chrome.runtime.sendMessage({
            action: 'toggleExtension',
            enabled: enabled
        }, (response) => {
            if (response && response.success) {
                updateStatusIndicator(enabled, false);
                showToast(enabled ? 'Extension enabled' : 'Extension disabled');
            }
        });
    });

    // Force block button
    forceBlockBtn.addEventListener('click', () => {
        forceBlockBtn.disabled = true;
        forceBlockBtn.innerHTML = '<span class="btn-icon">⏳</span>Blocking...';

        chrome.runtime.sendMessage({ action: 'forceBlock' }, (response) => {
            if (response && response.success) {
                showToast('Blocking started manually');
                setTimeout(() => {
                    forceBlockBtn.disabled = false;
                    forceBlockBtn.innerHTML = '<span class="btn-icon">⚡</span>Force Block Now';
                }, 1000);
            }
        });
    });
}

// Start status updates
function startStatusUpdates() {
    updateInterval = setInterval(() => {
        loadExtensionStatus();
    }, 200); // Update every 200ms for smooth countdown
}

// Update UI based on status
function updateUI(status) {
    const { extensionEnabled, isBlocking, timeRemaining } = status;

    // Update toggle
    extensionToggle.checked = extensionEnabled;

    // Update status indicator
    updateStatusIndicator(extensionEnabled, isBlocking);

    // Update blocking section
    updateBlockingSection(isBlocking, timeRemaining);

    // Update force block button
    forceBlockBtn.disabled = !extensionEnabled || isBlocking;
}

// Update status indicator
function updateStatusIndicator(enabled, blocking) {
    statusDot.className = 'status-dot';

    if (!enabled) {
        statusDot.classList.add('inactive');
        statusText.textContent = 'Extension Disabled';
    } else if (blocking) {
        statusDot.classList.add('blocking');
        statusText.textContent = 'Blocking Active';
    } else {
        statusDot.classList.add('active');
        statusText.textContent = 'Ready & Monitoring';
    }
}

// Update blocking section
function updateBlockingSection(isBlocking, timeRemaining) {
    if (isBlocking && timeRemaining > 0) {
        countdownContainer.style.display = 'block';
        statusMessage.style.display = 'none';

        // Update countdown
        const seconds = Math.ceil(timeRemaining / 1000);
        countdownValue.textContent = seconds;

        // Update progress circle (12 seconds = 100%)
        const progress = ((12000 - timeRemaining) / 12000) * 100;
        const offset = 100 - progress;
        countdownProgress.style.strokeDashoffset = offset;

    } else {
        countdownContainer.style.display = 'none';
        statusMessage.style.display = 'block';

        if (isBlocking) {
            statusMessage.textContent = 'Finalizing block...';
        } else {
            statusMessage.textContent = 'Ready to block GraphQL requests';
        }
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: slideDown 0.3s ease, fadeOut 0.3s ease 2s forwards;
    `;
    toast.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 2500);
}

// Check if current tab is Netflix
function checkNetflixTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.url) {
            const isNetflix = currentTab.url.includes('netflix.com');

            // Update force block button text
            if (isNetflix) {
                forceBlockBtn.innerHTML = '<span class="btn-icon">⚡</span>Force Block Now';
            } else {
                forceBlockBtn.innerHTML = '<span class="btn-icon">🌐</span>Open Netflix First';
                forceBlockBtn.disabled = true;
            }
        }
    });
}

// Clean up on popup close
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// Check Netflix tab on load
setTimeout(checkNetflixTab, 100);
