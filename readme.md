# Netflix Household Fix Extension

A Chrome extension that helps with Netflix household sharing authentication issues by managing certain network requests.

## Features

- **Automatic Operation**: Works silently on all Netflix pages
- **Household Support**: Helps maintain Netflix household connections
- **Simple Interface**: Clean toggle to enable or disable the extension
- **Universal Coverage**: Functions across all Netflix pages and sections
- **Privacy Focused**: All processing happens locally on your device

## How It Works

The extension monitors Netflix web traffic and manages specific authentication requests that can interfere with household sharing. When enabled, it:

1. **Detects Netflix Pages**: Automatically activates when you visit any Netflix page
2. **Manages Authentication**: Handles specific household verification requests
3. **Maintains Sessions**: Helps keep your Netflix household connection stable
4. **Works Transparently**: Operates in the background without interrupting your viewing

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
├── manifest.json          # Extension configuration
├── background.js          # Main extension logic
├── popup.html            # User interface
├── popup.css             # Interface styling
├── popup.js              # Interface functionality
├── icons/                # Extension icons
└── readme.md            # Documentation
```

### Permissions Required

- **tabs**: Monitor active browser tabs
- **scripting**: Inject scripts into Netflix pages
- **storage**: Save extension settings
- **activeTab**: Access current tab information
- **webNavigation**: Detect page navigation events

### Compatibility

- **Supported Sites**: All Netflix pages (netflix.com)
- **Browser**: Chrome with Manifest V3 support
- **Operation**: Works automatically on all Netflix sections including home, browse, watch, search, profiles, and settings

## Troubleshooting

### Extension Not Working

1. Verify the extension is enabled in the popup interface
2. Refresh the Netflix page
3. Ensure you are on a Netflix page (netflix.com)
4. Try disabling and re-enabling the extension

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
2. Navigate to any Netflix page
3. Check the popup for current status
4. Test the enable/disable toggle functionality

### Customizing Functionality

To modify the extension behavior:

1. Edit `background.js` and `injector.js` for core functionality changes
2. Update the popup interface by modifying `popup.html`, `popup.css`, or `popup.js`
3. Reload the extension after making changes

## Privacy and Security

- **Local Processing**: All operations happen on your device
- **No Data Collection**: The extension does not collect or transmit any personal data
- **Minimal Permissions**: Only requests necessary browser permissions
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

**Note**: This extension is designed to help with Netflix household authentication issues. Use responsibly and in accordance with Netflix's terms of service.
