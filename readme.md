# Netflix Household Fix Extension

A Chrome extension that temporarily blocks Netflix GraphQL requests to help with household sharing authentication issues.

## Features

- 🛡️ **Smart Blocking**: Automatically blocks `https://web.prod.cloud.netflix.com/graphql` for 10 seconds when navigating to Netflix pages
- ⏱️ **Countdown Timer**: Visual countdown showing when the blocking will be lifted
- 🔄 **Auto-Refresh Protection**: Blocks GraphQL requests again when any Netflix page is refreshed
- 🎯 **Targeted Blocking**: Only blocks on specific Netflix URLs (`/browse` and `/watch/`)
- 🎨 **Beautiful UI**: Modern popup interface with real-time status updates
- 📱 **Non-Intrusive Notifications**: Elegant in-page notifications that don't steal focus

## How It Works

1. **Browse Page Detection**: When you visit `https://www.netflix.com/browse`, the extension blocks GraphQL requests for 5 seconds
2. **Watch Page Detection**: When you navigate to any `https://www.netflix.com/watch/` URL, blocking is triggered again
3. **Refresh Protection**: Any page refresh on Netflix will trigger a new 5-second block
4. **Smart Unblocking**: After 5 seconds, GraphQL requests are automatically allowed again

## Installation

1. **Download the Extension**

   - Clone or download this repository to your computer

2. **Open Chrome Extensions**

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner

3. **Load the Extension**

   - Click "Load unpacked"
   - Select the `Netflix_Household_fix` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Netflix Household Fix" and click the pin icon

## Usage

### Basic Operation

1. **Enable/Disable**: Click the extension icon and use the toggle to enable or disable the extension
2. **Status Monitoring**: The popup shows real-time status including:
   - Extension enabled/disabled state
   - Whether blocking is currently active
   - Countdown timer when blocking is in progress

### Manual Control

- **Force Block**: Use the "Force Block Now" button to manually trigger a 5-second block
- **Real-time Updates**: The popup updates every 200ms to show precise countdown timing

### Visual Indicators

- **In-Page Notifications**: When blocking starts, you'll see an elegant notification in the top-right corner of Netflix pages
- **Status Indicator**: The popup shows colored status dots:
  - 🟢 Green: Extension active and ready
  - 🟠 Orange: Currently blocking (with pulsing animation)
  - 🔘 Gray: Extension disabled

## Technical Details

### Files Structure

```
Netflix_Household_fix/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for blocking logic
├── content.js            # In-page notifications and UI
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── rules.json            # Declarative net request rules
├── icons/                # Extension icons
└── readme.md            # This file
```

### Permissions Used

- `tabs`: Monitor tab navigation
- `scripting`: Inject content scripts
- `declarativeNetRequest`: Block network requests
- `storage`: Save extension settings
- `activeTab`: Access current tab information
- `webNavigation`: Detect page navigation events

### Target URLs

- **Blocked URL**: `https://web.prod.cloud.netflix.com/graphql`
- **Trigger URLs**:
  - `https://www.netflix.com/browse`
  - `https://www.netflix.com/watch/*`
  - Any Netflix page refresh

## Troubleshooting

### Extension Not Working

1. Make sure the extension is enabled in the popup
2. Refresh the Netflix page
3. Check that you're on a Netflix page (`netflix.com`)

### No Notifications Showing

1. The extension only shows notifications on Netflix pages
2. Make sure content scripts are allowed to run
3. Try refreshing the page

### Blocking Not Happening

1. Check the popup to see if the extension is enabled
2. Look for the countdown timer in the popup when blocking should be active
3. Make sure you're navigating to the correct URLs (`/browse` or `/watch/`)

## Development

### Testing the Extension

1. Load the extension in Chrome
2. Navigate to Netflix
3. Check the popup for status updates
4. Watch for in-page notifications

### Customizing Block Duration

To change the 12-second block duration:

1. Edit `background.js`
2. Change the `duration: 12000` value (in milliseconds)
3. Reload the extension

### Adding New Trigger URLs

To add more URLs that trigger blocking:

1. Edit the `handleNetflixNavigation` function in `background.js`
2. Add new URL conditions
3. Reload the extension

## Privacy & Security

- **Local Only**: All data stays on your device
- **No Tracking**: No analytics or data collection
- **Minimal Permissions**: Only requests necessary permissions
- **Open Source**: All code is visible and auditable

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Reload the extension (`chrome://extensions/`)
3. Restart Chrome if necessary

## License

This project is open source. Feel free to modify and distribute as needed.

---

**Note**: This extension is designed to help with Netflix household authentication issues. Use responsibly and in accordance with Netflix's terms of service.
