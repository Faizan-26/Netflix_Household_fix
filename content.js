// Content script for Netflix Household Fix extension

let notificationElement = null;
let countdownInterval = null;
let timeRemaining = 0;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'blockingStarted':
            showBlockingNotification(request.duration);
            break;

        case 'blockingStopped':
            hideBlockingNotification();
            break;
    }
});

// Show blocking notification with countdown
function showBlockingNotification(duration) {
    hideBlockingNotification(); // Remove any existing notification

    timeRemaining = duration;

    // Create notification element
    notificationElement = document.createElement('div');
    notificationElement.id = 'netflix-household-fix-notification';
    notificationElement.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(229, 9, 20, 0.3);
      z-index: 999999;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 280px;
      transition: all 0.3s ease;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="
          width: 12px;
          height: 12px;
          background: #ffd700;
          border-radius: 50%;
          margin-right: 10px;
          animation: pulse 1.5s infinite;
        "></div>
        <strong>Netflix Household Fix</strong>
      </div>
      <div style="margin-bottom: 8px; opacity: 0.9;">
        GraphQL requests blocked for security
      </div>
      <div style="
        background: rgba(255, 255, 255, 0.1);
        padding: 8px 12px;
        border-radius: 6px;
        text-align: center;
        font-weight: bold;
      ">
        Unblocking in: <span id="countdown">${Math.ceil(timeRemaining / 1000)}s</span>
      </div>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
      }
    </style>
  `;

    document.body.appendChild(notificationElement);

    // Start countdown
    startCountdown();

    console.log('Netflix Household Fix: Blocking notification shown');
}

// Start countdown timer
function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        timeRemaining -= 100;

        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            const secondsLeft = Math.ceil(timeRemaining / 1000);
            countdownElement.textContent = `${secondsLeft}s`;

            if (timeRemaining <= 0) {
                hideBlockingNotification();
            }
        } else {
            clearInterval(countdownInterval);
        }
    }, 100);
}

// Hide blocking notification
function hideBlockingNotification() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    if (notificationElement) {
        // Fade out animation
        notificationElement.style.opacity = '0';
        notificationElement.style.transform = 'translateX(100%)';

        setTimeout(() => {
            if (notificationElement && notificationElement.parentNode) {
                notificationElement.parentNode.removeChild(notificationElement);
            }
            notificationElement = null;
        }, 300);

        console.log('Netflix Household Fix: Blocking notification hidden');
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    hideBlockingNotification();
});

// Show subtle page indicator
function showPageIndicator() {
    const indicator = document.createElement('div');
    indicator.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #e50914;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      z-index: 999998;
      backdrop-filter: blur(5px);
      border: 1px solid #e50914;
    ">
      🛡️ Netflix Household Fix Enabled
    </div>
  `;

    document.body.appendChild(indicator);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (indicator && indicator.parentNode) {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }, 3000);
}

// Show page indicator when content script loads
if (window.location.href.includes('netflix.com')) {
    setTimeout(showPageIndicator, 1000);
}
