# Netflix Household Fix Extension

A Chrome extension that helps with Netflix household sharing authentication issues. I faced netflix household issue with my account so i made this extension to fix it.

## Features

- **Automatic Operation**: Works silently on all Netflix pages
- **Household Support**: Helps maintain Netflix household connections
- **Simple Interface**: Clean toggle to enable or disable the extension
- **Universal Coverage**: Functions across all Netflix pages and sections
- **Privacy Focused**: All processing happens locally on your device
- **Cookies Editing** : Supports export/import cookies for any website
## How It Works

The extension uses advanced early injection technology to intercept Netflix authentication requests before they can be processed. When enabled, it:

1. **Early Script Injection**: Automatically injects blocking code at the earliest possible moment when Netflix pages load
2. **Request Interception**: Catches and blocks specific household verification requests
3. **Seamless Operation**: Works on first page loads, refreshes, and navigation without requiring hot reloads
4. **Automatic Reload**: Detects household warning messages and performs hot reloads to bypass them
5. **Silent Operation**: Works transparently in the background without user interruption

## Installation

1. **Download the Extension**

   - Clone or download this repository to your computer

2. **Open Chrome Extensions**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner

3. **Load the Extension**

   - Click "Load unpacked"
   - Select the `Netflix_Household_fix` folder
   - The extension will appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Netflix Household Fix" and pin it for easy access

## Usage

**Simple Toggle Control**

1. Click the extension icon in your Chrome toolbar
2. Use the toggle switch to enable or disable the extension
3. The status indicator shows whether the extension is active

**Status Indicators**

- **Active**: Green dot indicates the extension is working
- **Disabled**: Gray dot shows the extension is turned off

The extension works automatically once enabled - no additional configuration needed.

### Permissions Required

- **tabs**: Monitor active browser tabs
- **scripting**: Inject scripts into Netflix pages
- **storage**: Save extension settings
- **activeTab**: Access current tab information
- **webNavigation**: Detect page navigation events

### Compatibility

- **Supported Sites**: Netflix pages (netflix.com)
- **Browser**: Chrome with Manifest V3 support
- **Content Script**: Runs at document_start for earliest possible injection
- **Request Types**: Blocks both XMLHttpRequest and Fetch API calls
- **Operation**: Works on first page loads, refreshes, navigation, and SPA routing

## Troubleshooting

### Extension Not Working

1. Verify the extension is enabled in the popup interface
2. Reload the extension from `chrome://extensions/` (click the refresh icon)
3. Open a fresh Netflix tab (not just refresh - open new tab and go to netflix.com)
4. Check that both `background.js` and `injector.js` files are present
5. Ensure you are on a Netflix page (netflix.com)

### Status Shows "Loading" or "Disabled"

1. Reload the extension in Chrome extensions page
2. Check that the extension has proper permissions
3. Restart Chrome if the issue persists


### Testing the Extension

1. Load the extension in Chrome extensions page
2. Open a **fresh Netflix tab** (important: not just refresh)
3. Check the popup for current status - should show "Active" with green dot
4. Test the enable/disable toggle functionality
5. Verify the extension works on first page loads (not just hot reloads)

## Privacy and Security

- **Local Processing**: All operations happen on your device using content scripts
- **Silent Operation**: No console logging or external communication during normal use

## Support

If you encounter any issues:

1. Review the troubleshooting section above
2. Reload the extension from the Chrome extensions page
3. Restart your browser if necessary
4. Check that you're using a compatible Chrome version


## Why obfuscate?

I obfuscate the code to make it harder for Netflix to detect and block the extension. This is for educational purposes only. 