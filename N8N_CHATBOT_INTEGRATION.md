# n8n Chatbot Integration - StartChatting Page

## Overview
The StartChatting page has been integrated with the AI team's n8n chatbot workflow for intelligent chat responses. This document explains the implementation and configuration.

## Features

### ✅ Implemented Features
- **Real-time Chat Interface**: Interactive chat UI with message history
- **n8n Webhook Integration**: Direct connection to AI team's chatbot workflow 
- **Session Management**: Unique session IDs for conversation tracking 
- **Auto-scroll**: Automatic scrolling to latest messages
- **Loading States**: Visual feedback while waiting for AI responses
- **Error Handling**: Graceful error messages when connection fails
- **Quick Actions**: Pre-defined prompt buttons for common queries
- **Responsive Design**: Works seamlessly on desktop and mobile

### 💬 Chat Features
1. **User Messages**: Displayed on right side with yellow background
2. **AI Responses**: Displayed on left side with gray background
3. **Timestamps**: Shows time for each message
4. **Typing Indicator**: Animated dots while AI is responding
5. **Empty State**: Welcome screen with quick action buttons

## Configuration

### Environment Variables
Add the following to your `.env` file:

```env
# n8n Chatbot Webhook URL - AI Team Integration
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot
```

### n8n Webhook Setup

#### Required Webhook Configuration
Your n8n workflow should accept POST requests with the following payload:

```json
{
  "message": "User's message text",
  "sessionId": "unique_session_identifier",
  "timestamp": "2025-11-27T10:30:00.000Z"
}
```

#### Expected Response Format
Your n8n workflow should return a JSON response:

```json
{
  "response": "AI chatbot response text",
  "sessionId": "same_session_identifier",
  "timestamp": "2025-11-27T10:30:01.000Z"
}
```

**Alternative Response Formats Supported:**
- `{ "message": "Response text" }` - Will use "message" field
- `{ "response": "Response text" }` - Will use "response" field

## Implementation Details

### File Modified
- `Frontend/src/pages/StartChatting.tsx`

### New Interfaces
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

### Key Functions

#### 1. `handleSendMessage()`
- Sends user message to n8n webhook
- Manages loading states
- Handles API errors
- Updates chat history

#### 2. `getSessionId()`
- Generates unique session ID per browser session
- Stores in sessionStorage
- Enables conversation context tracking

#### 3. `handleQuickAction()`
- Handles quick action button clicks
- Auto-populates and sends messages

### State Management
```typescript
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState(false);
const chatContainerRef = useRef<HTMLDivElement>(null);
```

## Quick Action Buttons

Pre-configured prompts for common user queries:

1. **Find coworking spaces** - "Find coworking spaces in Delhi NCR region"
2. **GST Registration** - "Help me with GST Registration complete registration process"
3. **Compare workspace plans** - "Compare workspace plans and find the best deal"
4. **Business compliance** - "Check business compliance requirements"

## Usage

### For Users
1. Open the StartChatting page
2. Click on a quick action button or type your message
3. Press Enter or click the Send button
4. Wait for AI response (typing indicator shows)
5. Continue the conversation naturally

### For Developers

#### Testing Locally
1. Update `.env` with your n8n webhook URL
2. Start the development server: `npm run dev`
3. Navigate to `/start-chatting`
4. Test chat functionality

#### Debugging
- Check browser console for API errors
- Verify n8n webhook URL is correct
- Ensure n8n workflow is active and accessible
- Check network tab for request/response details

## API Integration Flow

```
User Types Message
      ↓
handleSendMessage() called
      ↓
Add user message to chat
      ↓
POST request to n8n webhook
      ↓
n8n processes with AI
      ↓
Response received
      ↓
Add AI response to chat
      ↓
Auto-scroll to bottom
```

## Error Handling

### Connection Errors
If n8n webhook fails:
- User sees friendly error message
- Chat remains functional
- User can retry sending message

### Network Issues
- Timeout: 30 seconds (default fetch timeout)
- Offline: Browser shows network error
- Invalid URL: Console logs error

## Session Management

### Session ID Format
```
session_<timestamp>_<random_string>
Example: session_1732704600000_a3f9k2m1p
```

### Storage
- Stored in: `sessionStorage`
- Key: `chat_session_id`
- Lifetime: Until browser tab closes
- Purpose: Maintain conversation context

## Security Considerations

### CORS
Ensure n8n webhook allows requests from your domain:
```javascript
Access-Control-Allow-Origin: https://your-frontend-domain.com
```

### Rate Limiting
Consider implementing rate limiting to prevent abuse:
- Client-side: Disable send button while loading
- Server-side: n8n workflow should handle rate limits

### Data Privacy
- Session IDs are client-generated
- No personal data sent unless user types it
- Messages not stored in localStorage (privacy by default)

## Styling

### Theme Colors
- Primary: `#EDB003` (Yellow/Gold)
- User messages: `bg-[#EDB003]` with white text
- AI messages: `bg-gray-100` with gray-900 text
- Hover states: Darker yellow `#d69f03`

### Responsive Design
- Desktop: Full chat interface
- Mobile: Optimized touch interactions
- Tablet: Adaptive layout

## Future Enhancements

### Potential Features
1. **Message History**: Persist chat history in localStorage
2. **Voice Input**: Speech-to-text for messages
3. **File Upload**: Send documents to AI
4. **Typing Indicators**: Show when AI is typing
5. **Message Reactions**: Like/dislike responses
6. **Export Chat**: Download conversation history
7. **Multi-language**: Support for regional languages
8. **Rich Responses**: Support for cards, buttons, images

## Troubleshooting

### Common Issues

#### 1. Messages not sending
**Problem**: Click send but nothing happens
**Solution**: 
- Check console for errors
- Verify n8n webhook URL in `.env`
- Ensure n8n workflow is active

#### 2. No AI response
**Problem**: User message sent but no reply
**Solution**:
- Check n8n workflow execution logs
- Verify response format matches expected structure
- Test webhook directly with Postman

#### 3. CORS errors
**Problem**: Browser blocks request
**Solution**:
- Configure CORS in n8n webhook settings
- Add your frontend domain to allowed origins

#### 4. Slow responses
**Problem**: Long wait times for responses
**Solution**:
- Optimize n8n workflow
- Check AI API rate limits
- Consider adding timeout handling

## Contact

For issues with:
- **Frontend Integration**: Contact Frontend team
- **n8n Workflow**: Contact AI team
- **API Configuration**: Contact Backend team

## Changelog

### Version 1.0.0 (2025-11-27)
- ✅ Initial integration with n8n webhook
- ✅ Real-time chat interface
- ✅ Session management
- ✅ Quick action buttons
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

---

**Last Updated**: November 27, 2025
**Integration Status**: ✅ Ready for AI Team Webhook URL
