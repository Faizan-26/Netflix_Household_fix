# Netflix Household Fix Extension

A Chrome extension that helps with Netflix household sharing authentication issues by managing certain network requests.

## Features

- **Automatic Operation**: Works silently on all Netflix pages
- **Household Support**: Helps maintain Netflix household connections
- **Simple Interface**: Clean toggle to enable or disable the extension
- **Universal Coverage**: Functions across all Netflix pages and sections
- **Privacy Focused**: All processing happens locally on your device

## How It Works

The extension uses advanced early injection technology to intercept Netflix authentication requests before they can be processed. When enabled, it:

1. **Early Script Injection**: Automatically injects blocking code at the earliest possible moment when Netflix pages load
2. **Request Interception**: Catches and blocks specific household verification requests (`CLCSInterstitialLolomo` and `CLCSInterstitialPlaybackAndPostPlayback`)
3. **Seamless Operation**: Works on first page loads, refreshes, and navigation without requiring hot reloads
4. **Automatic Reload**: Detects household warning messages and performs hot reloads to bypass them
5. **Silent Operation**: Works transparently in the background without console output or user interruption

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

## Technical Details

### Project Structure

```
Netflix_Household_fix/
├── manifest.json          # Extension configuration with content script setup
├── background.js          # Extension state management and popup communication
├── injector.js            # Early content script for request blocking
├── popup.html            # User interface
├── popup.css             # Interface styling
├── popup.js              # Interface functionality
├── icons/                # Extension icons
└── readme.md            # Documentation
```

### Key Features

- **Document Start Injection**: Uses `"run_at": "document_start"` content script for maximum effectiveness
- **Dual System Architecture**: Background script handles state management while content script handles blocking
- **Target-Specific Blocking**: Specifically blocks `CLCSInterstitialLolomo` and `CLCSInterstitialPlaybackAndPostPlayback` operations
- **Hot Reload Detection**: Automatically detects household verification warnings and performs cache-preserving reloads
- **Silent Operation**: No console logging or user-visible output during normal operation

### Permissions Required

- **tabs**: Monitor active browser tabs
- **scripting**: Inject scripts into Netflix pages
- **storage**: Save extension settings
- **activeTab**: Access current tab information
- **webNavigation**: Detect page navigation events

### Compatibility

- **Supported Sites**: All Netflix pages (netflix.com)
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

### General Issues

1. Make sure you're using a supported Chrome browser
2. Verify the extension is properly installed and enabled
3. Check Chrome's developer console for any error messages

## Development

### Testing the Extension

1. Load the extension in Chrome extensions page
2. Open a **fresh Netflix tab** (important: not just refresh)
3. Check the popup for current status - should show "Active" with green dot
4. Test the enable/disable toggle functionality
5. Verify the extension works on first page loads (not just hot reloads)

### Customizing Functionality

To modify the extension behavior:

1. **Core Blocking Logic**: Edit `injector.js` for request interception and blocking behavior
2. **Extension State**: Modify `background.js` for enable/disable functionality and tab management
3. **User Interface**: Update `popup.html`, `popup.css`, or `popup.js` for popup changes
4. **Target Operations**: Change the GraphQL operation names in `injector.js` if Netflix updates their API
5. **Testing**: Always test with fresh Netflix tabs after making changes

## Privacy and Security

- **Local Processing**: All operations happen on your device using content scripts
- **No Data Collection**: The extension does not collect, store, or transmit any personal data
- **Minimal Permissions**: Only requests necessary browser permissions for Netflix page access
- **No External Connections**: Extension operates entirely within your browser
- **Silent Operation**: No console logging or external communication during normal use
- **Open Source**: All code is visible and can be audited

## Support

If you encounter any issues:

1. Review the troubleshooting section above
2. Reload the extension from the Chrome extensions page
3. Restart your browser if necessary
4. Check that you're using a compatible Chrome version

## License

This project is open source. Feel free to modify and distribute as needed.

---

**Note**: This extension uses advanced content script injection to intercept specific Netflix GraphQL operations (`CLCSInterstitialLolomo` and `CLCSInterstitialPlaybackAndPostPlayback`) that trigger household verification checks. It operates silently and preserves cache during reloads. Use responsibly and in accordance with Netflix's terms of service.
