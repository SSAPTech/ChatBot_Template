# ChatBot_Template
A clean, modern AI chatbot template using JavaScript for frontend integration.


## Features

### 🤖 Core Functionality
- **AI-Powered Responses**: Uses OpenAI GPT-3.5-turbo for intelligent conversations
- **Fallback System**: Comprehensive responses when AI is unavailable
- **Real-time Status**: Shows AI availability status ("AI Assistant Ready" / "ChatBot is offline")
- **Chat History**: Maintains conversation history (configurable length)
- **Multi-page Integration**: Works seamlessly across all website pages

### 🎨 User Interface
- **Modern Design**: Beautiful gradient UI with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Fullscreen Mode**: Toggle between normal and fullscreen view using browser Fullscreen API
- **Dark Mode Support**: Automatically adapts to user's theme preference
- **Accessibility**: Full keyboard navigation and screen reader support
- **Text Formatting**: Markdown support for bold, italic, and links

### 🚀 Interactive Features
- **Quick Action Buttons**: Pre-defined buttons for common queries 
- **Loading States**: Visual feedback during AI processing
- **Message Formatting**: Automatic link detection and markdown formatting
- **Keyboard Shortcuts**: Enter to send, Escape to close
- **Simplified Responses**: Clean, concise answers for better user experience

### 🛡️ Security & Performance
- **API Key Protection**: Secure configuration management
- **Error Handling**: Graceful fallbacks for all error scenarios
- **Performance Optimized**: Minimal impact on page load times
- **Cross-browser Compatible**: Works on all modern browsers

## File Structure

```
├── config/
│   ├── api-keys.json          # API configuration (gitignored)
│   └── api-keys.template.json # Template for API keys
├── js/
│   ├── api-config.js          # OpenAI integration and API management
│   └── ai-chatbot.js          # Main chatbot functionality
├── css/
│   └── ai-chatbot.css         # Complete styling with animations
└── README.md                  # This documentation
```

## Installation

### 1. Setup API Configuration

1. Copy the template file:
   ```bash
   cp config/api-keys.template.json config/api-keys.json
   ```

2. Edit `config/api-keys.json` and add your OpenAI API key:
   ```json
   {
     "openai": {
       "apiKey": "your-actual-openai-api-key-here",
       "model": "gpt-3.5-turbo",
       "maxTokens": 500,
       "temperature": 0.7
     },
     "chatbot": {
       "name": "AI Assistant",
       "welcomeMessage": "Hello! I'm your AI Assistant. How can I help you today?",
       "maxHistoryLength": 50
     }
   }
   ```

### 2. Add to HTML Pages

#### For Home Page (index.html)
Add these lines to your HTML `<head>` section:
```html
<!-- AI Chatbot CSS -->
<link rel="stylesheet" href="css/ai-chatbot.css">
```

Add these lines before the closing `</body>` tag:
```html
<!-- AI Chatbot JS -->
<script src="js/api-config.js"></script>
<script src="js/ai-chatbot.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.aiChatbot.init();
    });
</script>
```

#### For Pages in Subdirectories (pages/*.html)
Add these lines to your HTML `<head>` section:
```html
<!-- AI Chatbot CSS -->
<link rel="stylesheet" href="../css/ai-chatbot.css">
```

Add these lines before the closing `</body>` tag:
```html
<!-- AI Chatbot JS -->
<script src="../js/api-config.js"></script>
<script src="../js/ai-chatbot.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.aiChatbot.init();
    });
</script>
```

## Configuration Options

### API Configuration (`config/api-keys.json`)

| Setting | Description | Default |
|---------|-------------|---------|
| `openai.apiKey` | Your OpenAI API key | Required |
| `openai.model` | GPT model to use | `gpt-3.5-turbo` |
| `openai.maxTokens` | Maximum response length | `500` |
| `openai.temperature` | Response creativity (0-1) | `0.7` |
| `chatbot.name` | Chatbot display name | `AI Assistant` |
| `chatbot.maxHistoryLength` | Max chat history items | `50` |


## Usage

### For Users

1. **Open Chatbot**: Click the "AI Assistant" button in the bottom-right corner
2. **Ask Questions**: Type your question.
3. **Quick Actions**: Use the pre-defined buttons for common queries
4. **Fullscreen Mode**: Click the expand button for a larger view
5. **Close**: Click the X button or press Escape



#### Customizing the Template

**1. Update Business Information**
Edit the `getFallbackResponse()` method in `js/ai-chatbot.js` to customize fallback responses for your business:

```javascript
getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('product')) {
        return "Our products include [your product categories]. " +
               "Each product is designed with [your unique selling points]. " +
               "Would you like to know more about a specific product?";
    }
    
    // Add more custom responses for your business...
}
```

**2. Customize Quick Actions**

Modify the `handleQuickAction()` method to add new quick action buttons for your business:

```javascript
handleQuickAction(action) {
    const actions = {
        products: "Tell me about your products",
        services: "What services do you offer?",
        support: "I need help or support",
        contact: "How can I contact you?",
        // Add new actions here...
    };
}
```

**3. Update Welcome Message**
Modify the welcome message in `js/ai-chatbot.js` line 56 to match your business:

```javascript
<h3>Welcome to [Your Company Name]! 🎉</h3>
```

**4. Customize AI Prompt**
Update the `createPrompt()` method to include your business context:

```javascript
createPrompt(message) {
    return `You are a helpful AI assistant for [Your Company Name], a [your business type]. 
Please provide clear, concise, and helpful responses to customer inquiries.
Keep responses professional but friendly. If you don't know something specific about the company, 
suggest they contact support for detailed information.

User question: ${message}`;
}
}
```


## Business Logic

The chatbot is designed as a generic template that can be customized for any business or use case:




## Fallback System

When OpenAI is unavailable, the chatbot provides intelligent fallback responses for common queries



## Recent Updates

### ✅ Simplified Responses
- Cleaner, more concise answers
- Better mobile readability
- Faster user interaction
- Professional presentation

### ✅ Generic Template
- Removed specific business references
- Configurable chatbot name and messages
- Generic quick action buttons
- Complete fallback response system

### ✅ UI Improvements
- Updated quick action buttons to be generic
- Updated status text to "ChatBot is offline"
- Enhanced text formatting with markdown support
- Better spacing and typography

### ✅ Multi-page Integration
- Chatbot now works on all pages
- Consistent experience across the site
- Proper path handling for subdirectories
- Unified styling and functionality

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lightweight**: Minimal impact on page load times
- **Lazy Loading**: OpenAI library loaded only when needed
- **Efficient**: Optimized animations and transitions
- **Responsive**: Smooth performance on all devices

## Security

- **API Key Protection**: Keys stored in gitignored config file
- **Client-side Only**: No server-side dependencies
- **Secure Requests**: HTTPS-only API calls
- **Error Handling**: No sensitive information in error messages

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**
   - Check if all CSS and JS files are loaded
   - Verify file paths are correct for page location
   - Check browser console for errors

2. **AI responses not working**
   - Verify OpenAI API key is set correctly
   - Check API key has sufficient credits
   - Ensure internet connection is stable
   - Fallback mode will work regardless

3. **Styling issues**
   - Check if Font Awesome is loaded
   - Verify Google Fonts are accessible
   - Clear browser cache

4. **Multi-page issues**
   - Ensure correct relative paths for CSS/JS files
   - Check that initialization script is present on each page
   - Verify chatbot appears on all pages



## Support

For technical support or questions about the chatbot system, please contact the development team.
