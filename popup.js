// DOM elements
const extensionToggle = document.getElementById('extensionToggle');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const cookieFormat = document.getElementById('cookieFormat');
const exportCopy = document.getElementById('exportCopy');
const exportDownload = document.getElementById('exportDownload');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const importBtn = document.getElementById('importBtn');
const importText = document.getElementById('importText');
const footerText = document.getElementById('footerText');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    loadExtensionStatus();
    setupEventListeners();
});

// Load extension status
function loadExtensionStatus() {
    // Check for update requirement first
    chrome.storage.local.get(['updateRequired', 'extensionEnabled'], (result) => {
        if (result.updateRequired) {
            // Show update overlay and hide main content check
            document.getElementById('update-overlay').style.display = 'flex';
            // Disable interactions
            document.querySelector('.container').style.pointerEvents = 'none';
            document.getElementById('update-overlay').style.pointerEvents = 'auto'; // Re-enable pointer events for the overlay
            return;
        }

        // Normal flow
        chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
            if (chrome.runtime.lastError || !response) {
                // If message fails, maybe background is dead or checking? 
                // Fallback to storage result if available
                updateUI({ extensionEnabled: result.extensionEnabled !== undefined ? result.extensionEnabled : true });
                return;
            }
            updateUI(response);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${target}Tab`).classList.add('active');
        });
    });

    // Extension toggle
    extensionToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        chrome.runtime.sendMessage({
            action: 'toggleExtension',
            enabled: enabled
        }, (response) => {
            if (chrome.runtime.lastError || !response?.success) {
                extensionToggle.checked = !enabled;
                return;
            }
            updateStatusIndicator(enabled);
        });
    });

    // Cookie Export - Copy
    exportCopy.addEventListener('click', async () => {
        const cookies = await getCurrentTabCookies();
        if (!cookies.length) {
            showStatus('No cookies found for this site', 'error');
            return;
        }
        const formatted = formatCookies(cookies, cookieFormat.value);
        await navigator.clipboard.writeText(formatted);
        showStatus('Cookies copied to clipboard!', 'success');
    });

    // Cookie Export - Download
    exportDownload.addEventListener('click', async () => {
        const cookies = await getCurrentTabCookies();
        if (!cookies.length) {
            showStatus('No cookies found for this site', 'error');
            return;
        }
        const formatted = formatCookies(cookies, cookieFormat.value);
        const blob = new Blob([formatted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        const tab = await getCurrentTab();
        const domain = new URL(tab.url).hostname.replace(/\./g, '_');

        chrome.downloads.download({
            url: url,
            filename: `cookies_${domain}_${timestamp}.txt`,
            saveAs: true
        });
        showStatus('Download started', 'success');
    });

    // Cookie Delete
    deleteAllBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete all cookies for this site?')) return;

        const cookies = await getCurrentTabCookies();
        if (!cookies.length) {
            showStatus('No cookies to delete', 'error');
            return;
        }

        const tab = await getCurrentTab();
        const url = new URL(tab.url).origin;

        let deletedCount = 0;
        for (const cookie of cookies) {
            try {
                await chrome.cookies.remove({
                    url: url,
                    name: cookie.name,
                    storeId: cookie.storeId
                });
                deletedCount++;
            } catch (e) {
                console.error('Failed to delete cookie:', cookie.name, e);
            }
        }

        showStatus(`Deleted ${deletedCount} cookies! Refreshing...`, 'success');
        setTimeout(() => chrome.tabs.reload(tab.id), 1500);
    });

    // Cookie Import
    importBtn.addEventListener('click', async () => {
        const text = importText.value.trim();
        if (!text) {
            showStatus('Please paste cookies first', 'error');
            return;
        }

        try {
            const cookies = parseCookies(text);
            if (!cookies.length) throw new Error('No valid cookies found');

            const tab = await getCurrentTab();
            const currentUrl = new URL(tab.url);

            let successCount = 0;
            for (const cookie of cookies) {
                try {
                    // Prepare cookie object for chrome.cookies.set
                    const newCookie = {
                        url: currentUrl.origin,
                        name: cookie.name,
                        value: cookie.value,
                        domain: cookie.domain || currentUrl.hostname,
                        path: cookie.path || '/',
                        secure: cookie.secure === 'TRUE' || cookie.secure === true,
                        httpOnly: cookie.httpOnly === 'TRUE' || cookie.httpOnly === true,
                        expirationDate: cookie.expirationDate ? parseFloat(cookie.expirationDate) : undefined
                    };

                    // Clean domain for set (remove leading dot if it's there as chrome.cookies.set handles it via 'domain' param)
                    if (newCookie.domain.startsWith('.')) {
                        newCookie.domain = newCookie.domain.substring(1);
                    }

                    await chrome.cookies.set(newCookie);
                    successCount++;
                } catch (e) {
                    console.error('Failed to set cookie:', cookie.name, e);
                }
            }

            showStatus(`Imported ${successCount} cookies! Refreshing...`, 'success');
            setTimeout(() => chrome.tabs.reload(tab.id), 1500);
        } catch (err) {
            showStatus('Import failed: ' + err.message, 'error');
        }
    });
}

// Helper: Get active tab
async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

// Helper: Get cookies for active tab
async function getCurrentTabCookies() {
    const tab = await getCurrentTab();
    if (!tab?.url) return [];
    // Using 'url' instead of 'domain' to get all cookies sent to this page
    // (including parent domain cookies like .netflix.com)
    return chrome.cookies.getAll({ url: tab.url });
}

// Cookie Formatter
function formatCookies(cookies, format) {
    if (format === 'json') {
        return JSON.stringify(cookies, null, 2);
    }

    if (format === 'netscape') {
        return cookies.map(c => {
            const domain = c.domain;
            const subdomains = domain.startsWith('.') ? 'TRUE' : 'FALSE';
            const path = c.path;
            const secure = c.secure ? 'TRUE' : 'FALSE';
            const expiration = c.expirationDate ? Math.floor(c.expirationDate) : 0;
            return `${domain}\t${subdomains}\t${path}\t${secure}\t${expiration}\t${c.name}\t${c.value}`;
        }).join('\n');
    }

    if (format === 'raw') {
        return cookies.map(c => `${c.name}=${c.value}`).join('; ');
    }

    return '';
}

// Cookie Parser
function parseCookies(text) {
    // Try JSON
    try {
        const data = JSON.parse(text);
        return Array.isArray(data) ? data : [data];
    } catch (e) { }

    // Try Netscape
    const lines = text.split('\n');
    const netscapeCookies = [];
    lines.forEach(line => {
        if (!line.trim() || line.startsWith('#')) return;
        const parts = line.split('\t');
        if (parts.length >= 7) {
            netscapeCookies.push({
                domain: parts[0],
                path: parts[2],
                secure: parts[3] === 'TRUE',
                expirationDate: parts[4],
                name: parts[5],
                value: parts[6]
            });
        }
    });
    if (netscapeCookies.length) return netscapeCookies;

    // Try Raw (name=value; name2=value2)
    const rawCookies = [];
    text.split(';').forEach(pair => {
        const [name, ...valueParts] = pair.trim().split('=');
        if (name && valueParts.length) {
            rawCookies.push({
                name: name.trim(),
                value: valueParts.join('=').trim()
            });
        }
    });

    return rawCookies;
}

// Show feedback status
function showStatus(msg, type) {
    footerText.textContent = msg;
    footerText.style.color = type === 'error' ? '#ff4d4d' : '#4CAF50';
    setTimeout(() => {
        footerText.textContent = 'Automatic household fix active';
        footerText.style.color = '#666';
    }, 3000);

    // usage of notifications
    chrome.permissions.contains({ permissions: ['notifications'] }, (result) => {
        if (result) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Cookie Master',
                message: msg
            });
        }
    });
}

function updateUI(status) {
    extensionToggle.checked = status.extensionEnabled;
    updateStatusIndicator(status.extensionEnabled);
}

function updateStatusIndicator(enabled) {
    if (enabled) {
        statusDot.className = 'status-dot active';
        statusText.textContent = 'Active';
    } else {
        statusDot.className = 'status-dot inactive';
        statusText.textContent = 'Disabled';
    }
}
